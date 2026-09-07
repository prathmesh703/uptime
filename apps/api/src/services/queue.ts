import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "rediss://default:gQAAAAAAAg-IAAIgcDI3NzNmNjI5OTFmMzU0YTg1YTY1NzdhYzcxZTJjMGU5Mg@concise-alien-135048.upstash.io:6379";

// Regular client for ZSET/Hash commands
export const redis = new Redis(REDIS_URL);

// Separate publisher client — a Redis connection in subscribe mode cannot issue
// regular commands, so we need two distinct connections.
const publisher = new Redis(REDIS_URL);

redis.on("error", (err) => {
  console.error("[Redis Error]", err.message);
});

redis.on("connect", () => {
  console.log("[Redis] Connected to Redis server at", REDIS_URL);
});

publisher.on("error", (err) => {
  console.error("[Redis Publisher Error]", err.message);
});

export const ZSET_QUEUE_KEY = "uptime:zset_queue";
export const MONITOR_CONFIG_KEY = "uptime:monitor_config";
export const VALIDATE_JOBS_CHANNEL = "uptime:validate_jobs";

export interface MonitorConfig {
  targetUrl: string;
  url?: string;
  intervalSeconds: number;
  interval?: number;
}

export interface ValidateJobPayload {
  websiteId: string;
  url: string;
}

/**
 * Add a monitor to the background queue.
 * - Stores metadata (URL, interval) inside Redis Hash (uptime:monitor_config)
 * - Adds monitorId to Redis Sorted Set (uptime:zset_queue) with score Date.now()
 *   so that it runs immediately on creation.
 */
export async function addMonitorToQueue(
  monitorId: string,
  targetUrl: string,
  intervalSeconds: number
): Promise<void> {
  const config: MonitorConfig = {
    targetUrl,
    url: targetUrl,
    intervalSeconds,
    interval: intervalSeconds,
  };

  // Store metadata inside Redis Hash
  await redis.hset(MONITOR_CONFIG_KEY, monitorId, JSON.stringify(config));

  // Add to Sorted Set using Date.now() as score (run immediately)
  await redis.zadd(ZSET_QUEUE_KEY, Date.now(), monitorId);

  console.log(
    `[Queue] Monitor added: id=${monitorId}, targetUrl=${targetUrl}, interval=${intervalSeconds}s`
  );
}

/**
 * Remove a monitor from the background queue.
 * - Removes monitorId from ZSET via ZREM
 * - Deletes config from Hash via HDEL
 */
export async function removeMonitorFromQueue(monitorId: string): Promise<void> {
  await redis.zrem(ZSET_QUEUE_KEY, monitorId);
  await redis.hdel(MONITOR_CONFIG_KEY, monitorId);

  console.log(`[Queue] Monitor removed: id=${monitorId}`);
}

/**
 * Dispatch a validate job to the Hub via Redis Pub/Sub.
 * The Hub subscribes to VALIDATE_JOBS_CHANNEL and forwards
 * the job to all connected Validators over WebSocket.
 */
async function dispatchValidateJob(
  websiteId: string,
  targetUrl: string
): Promise<void> {
  const payload: ValidateJobPayload = {
    websiteId,
    url: targetUrl,
  };
  const subscriberCount = await publisher.publish(
    VALIDATE_JOBS_CHANNEL,
    JSON.stringify(payload)
  );
  console.log(
    `[Queue] Dispatched validate job | websiteId=${websiteId} | url=${targetUrl} | hub subscribers=${subscriberCount}`
  );
}

/**
 * Starts the Redis ZSET background worker loop.
 * Runs setInterval every 1,000ms.
 * - Fetches all due monitors using ZRANGEBYSCORE uptime:zset_queue 0 <current_timestamp>
 * - For each due monitor:
 *     - Instantly calculates nextRunTime = Date.now() + (intervalSeconds * 1000)
 *     - Updates score in ZSET to prevent double-processing
 *     - Publishes a validate job to the Hub via Redis Pub/Sub
 */
export function startBackgroundWorker(): ReturnType<typeof setInterval> {
  console.log("[Worker] Background worker started. Checking queue every 1,000ms...");

  const intervalTimer = setInterval(async () => {
    try {
      const now = Date.now();
      // Fetch all due monitors whose scheduled score is <= current timestamp
      const dueMonitorIds: string[] = await redis.zrangebyscore(
        ZSET_QUEUE_KEY,
        0,
        now
      );

      if (!dueMonitorIds || dueMonitorIds.length === 0) {
        return;
      }

      for (const monitorId of dueMonitorIds) {
        // Fetch monitor config from Hash
        const rawConfig = await redis.hget(MONITOR_CONFIG_KEY, monitorId);
        if (!rawConfig) {
          // If no config found in Hash, remove orphaned entry from ZSET
          console.warn(`[Worker] Missing config for monitor ${monitorId}, removing from queue.`);
          await redis.zrem(ZSET_QUEUE_KEY, monitorId);
          continue;
        }

        let config: MonitorConfig;
        try {
          config = JSON.parse(rawConfig);
        } catch {
          console.error(`[Worker] Failed to parse config for monitor ${monitorId}`);
          continue;
        }

        const targetUrl = config.targetUrl || config.url || "";
        const intervalSeconds = Number(config.intervalSeconds || config.interval) || 60;

        // Instantly calculate nextRunTime and update score in ZSET to prevent double-processing
        const nextRunTime = Date.now() + intervalSeconds * 1000;
        await redis.zadd(ZSET_QUEUE_KEY, nextRunTime, monitorId);

        // Publish job to the Hub via Redis Pub/Sub instead of doing a direct fetch().
        // The Hub will forward the job to all connected Validators over WebSocket.
        if (targetUrl) {
          dispatchValidateJob(monitorId, targetUrl);
        }
      }
    } catch (err: any) {
      console.error("[Worker] Error processing queue tick:", err.message);
    }
  }, 1000);

  return intervalTimer;
}

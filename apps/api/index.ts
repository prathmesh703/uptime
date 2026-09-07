import  express  from "express";
import { authMiddleware } from "./Middleware";
import { prismaClient } from "db/client";
import cors from "cors";
import crypto from "crypto";
import {
  addMonitorToQueue,
  removeMonitorFromQueue,
  startBackgroundWorker,
} from "./src/services/queue";

const app = express();
app.use(cors());
app.use(express.json());

// Monitor / Website creation route (existing v1 endpoint)
app.post("/api/v1/website", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { url, intervalSeconds, interval } = req.body;
    const intervalSec = Number(intervalSeconds || interval) || 60;

    const data = await prismaClient.website.create({
      data: {
        userId,
        url,
      },
    });
    console.log("userId", userId);
    console.log("data", data);

    // Add monitor to Redis background worker queue
    await addMonitorToQueue(data.id, url, intervalSec);

    res.json({
      id: data.id,
    });
  } catch (err) {
    console.error("Error creating website monitor:", err);
    res.status(500).json({ error: "Failed to create monitor" });
  }
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const webId = req.query.websiteId! as unknown as string;
  const userId = req.userId;
  const data = await prismaClient.website.findFirst({
    where: {
      userId,
      id: webId,
    },
    include: {
      ticks: true,
    },
  });

  res.json(data);
});

app.get("/api/v1/websites", authMiddleware, async (req, res)=>{
  const userId = req.userId;
  console.log("user", userId);
  const websites = await prismaClient.website.findMany({
        where:{
      userId,
      off: false,
    },
    include: {
      ticks: true,
    },
  });

  res.json(websites);
});

// Monitor / Website deletion route (existing v1 endpoint)
app.delete(
  ["/api/v1/website", "/api/v1/website/", "/api/v1/website/:websiteId"],
  authMiddleware,
  async (req, res) => {
    try {
      const websiteId = (req.params?.websiteId ||
        req.body?.websiteId ||
        req.query?.websiteId) as string;
      const userId = req.userId;

      if (!websiteId) {
        res.status(400).json({ error: "websiteId is required" });
        return;
      }

      const website = await prismaClient.website.findFirst({
        where: {
          id: websiteId,
          userId,
        },
      });

      if (!website) {
        res.status(404).json({ error: "Website not found" });
        return;
      }

      await prismaClient.website.update({
        where: {
          id: websiteId,
        },
        data: {
          off: true,
        },
      });

      // Remove monitor from Redis background worker queue
      await removeMonitorFromQueue(websiteId);

      res.json({
        msg: "removed website successfully",
      });
    } catch (err) {
      console.error("Error removing website:", err);
      res.status(500).json({ error: "Failed to remove website" });
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  // Start Redis ZSET background worker on server boot
  startBackgroundWorker();
});

export default app;
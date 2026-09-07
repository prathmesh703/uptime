import {  type ServerWebSocket } from "bun";
import { v7 as uuidv7 } from "uuid";
import type {IncomingMessage, SignupIncomingMessage} from "common/client"
import {prismaClient} from "db/client"
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import { PublicKey } from "@solana/web3.js";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "rediss://default:gQAAAAAAAg-IAAIgcDI3NzNmNjI5OTFmMzU0YTg1YTY1NzdhYzcxZTJjMGU5Mg@concise-alien-135048.upstash.io:6379";
const VALIDATE_JOBS_CHANNEL = "uptime:validate_jobs";

const subscriber = new Redis(REDIS_URL);

subscriber.on("connect", () => {
    console.log("[Hub] Redis subscriber connected at", REDIS_URL);
});

subscriber.on("error", (err) => {
    console.error("[Hub] Redis subscriber error:", err.message);
});

const validators: { validatorId: string; socket: ServerWebSocket<unknown>; publicKey: string }[] = [];
const CALLBACKS: { [callbackId: string]: (data: IncomingMessage) => void } = {};
const COST_PER_VALIDATION = 100;

Bun.serve({
    fetch(req, server) {
        console.log("server");
        if(server.upgrade(req)){
            return;
        }
        return new Response("upgrade failed" , {status: 500});
    },
    port: process.env.PORT || 8080,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            const data: IncomingMessage = JSON.parse(message);
            console.log("reached hub");
            if (data.type === "signup") {
                const verified = await verifyMessage(
                    `message signed for ${data.data.publickey}, ${data.data.callbackId}`,
                    data.data.publickey,
                    data.data.signedMessage
                );
                if(verified){
                    await signupHandler(ws, data.data);
                } else {
                    console.log("Signature verification failed for", data.data.publickey);
                }
            } else if (data.type === "validate") {
                const cb = CALLBACKS[data.data.callbackId];
                if (cb) {
                    cb(data);
                    delete CALLBACKS[data.data.callbackId];
                }
            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            validators.splice(
                validators.findIndex((v) => v.socket === ws),
                1
            );
            console.log(`[Hub] Validator disconnected. Active validators: ${validators.length}`);
        },
    },
});

/**
 * Dispatch a validate request to all currently connected validators.
 * Each validator receives a WebSocket message with the URL and a unique callbackId.
 * When the validator replies, the Hub verifies the signature and writes a WebsiteTick to Postgres.
 */
function dispatchToValidators(websiteId: string, url: string): void {
    if (validators.length === 0) {
        console.warn(`[Hub] No validators connected — skipping dispatch for ${url}`);
        return;
    }

    validators.forEach((validator) => {
        const callbackId = uuidv7();
        console.log(`[Hub] Sending validate request to validator ${validator.validatorId} for ${url}`);

        validator.socket.send(
            JSON.stringify({
                type: "validate",
                data: {
                    url,
                    callbackId,
                    websiteId, // ✅ FIX: websiteId was previously never sent to validators
                },
            })
        );

        CALLBACKS[callbackId] = async (data: IncomingMessage) => {
            if (data.type === "validate") {
                const { validatorId, status, latency, signedMessage } = data.data;

                const verified = await verifyMessage(
                    `Reply to ${callbackId}`,
                    validator.publicKey,
                    signedMessage
                );
                if (!verified) {
                    console.warn(`[Hub] Signature verification failed for callback ${callbackId}`);
                    return;
                }

                await prismaClient.$transaction(async (tx) => {
                    await tx.websiteTicks.create({
                        data: {
                            websiteId,
                            validatorId,
                            status,
                            latency,
                            createdAt: new Date(),
                        },
                    });

                    await tx.validator.update({
                        where: { id: validatorId },
                        data: {
                            pendingPayouts: { increment: COST_PER_VALIDATION },
                        },
                    });
                });

                console.log(
                    `[Hub] Tick recorded | websiteId=${websiteId} | validatorId=${validatorId} | status=${status} | latency=${latency}ms`
                );
            }
        };
    });
}

async function signupHandler(
    ws: ServerWebSocket<unknown>,
    { callbackId, publickey, signedMessage, ip }: SignupIncomingMessage
) {
    console.log("signupHandler called with:", { publickey, callbackId, ip });
    const validatorinDB = await prismaClient.validator.findFirst({
        where: {
            publickey,
        },
    });

    if (validatorinDB) {
        ws.send(
            JSON.stringify({
                type: "signup",
                data: {
                    validatorId: validatorinDB.id,
                    callbackId,
                },
            })
        );
        validators.push({
            validatorId: validatorinDB.id,
            socket: ws,
            publicKey: validatorinDB.publickey,
        });
        console.log(`[Hub] Known validator signed in: ${validatorinDB.id}. Active: ${validators.length}`);
        return;
    }

    try {
        const newValidator = await prismaClient.validator.create({
            data: {
                ip,
                location: "Latur",
                publickey,
            },
        });

        validators.push({
            validatorId: newValidator.id,
            socket: ws,
            publicKey: newValidator.publickey,
        });
        console.log(`[Hub] New validator registered: ${newValidator.id}. Active: ${validators.length}`);
    } catch (err) {
        console.error("Failed to create validator:", err);
    }
}

async function verifyMessage(signedMessage: string, publicKey: string, signature: string) {
    console.log("verifyMessage called with:", { signedMessage, publicKey, signature });
    const messageByte = nacl_util.decodeUTF8(signedMessage);
    const result = nacl.sign.detached.verify(
        messageByte,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes()
    );
    return result;
}

subscriber.subscribe(VALIDATE_JOBS_CHANNEL, (err, count) => {
    if (err) {
        console.error("[Hub] Failed to subscribe to Redis channel:", err.message);
    } else {
        console.log(`[Hub] Subscribed to "${VALIDATE_JOBS_CHANNEL}". Listening for validate jobs... (${count} subscription(s))`);
    }
});

subscriber.on("message", (channel, message) => {
    if (channel !== VALIDATE_JOBS_CHANNEL) return;

    try {
        const { websiteId, url } = JSON.parse(message) as { websiteId: string; url: string };
        console.log(`[Hub] Received validate job | websiteId=${websiteId} | url=${url}`);
        dispatchToValidators(websiteId, url);
    } catch (err: any) {
        console.error("[Hub] Failed to parse validate job message:", err.message);
    }
});
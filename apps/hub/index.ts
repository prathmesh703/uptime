import {  type ServerWebSocket } from "bun";
import { v7 as uuidv7 } from "uuid";
import type {IncomingMessage, SignupIncomingMessage} from "common/client"
import {prismaClient} from "db/client"
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import { PublicKey } from "@solana/web3.js";

const validators: {validatorId: string, socket: ServerWebSocket<unknown>, publicKey: string }[] =[];
const CALLBACKS: {[callbackId: string]: (data: IncomingMessage) => void} = {}
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
        async message(ws: ServerWebSocket<unknown> , message: string){
            const data : IncomingMessage = JSON.parse(message);
            console.log("reached hub");
            if(data.type ==='signup'){
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
            }  else if( data.type === 'validate'){
                const cb = CALLBACKS[data.data.callbackId];
                if (cb) {
                  cb(data);
                  delete CALLBACKS[data.data.callbackId];
                }
            }
        },
        async close(ws: ServerWebSocket<unknown>){
            validators.splice(validators.findIndex(v=> v.socket ===ws), 1);
        }
    }
})

async function  signupHandler(ws: ServerWebSocket<unknown> , { callbackId,publickey,signedMessage,ip}: SignupIncomingMessage) {
    console.log("signupHandler called with:", { publickey, callbackId, ip });
    const validatorinDB = await prismaClient.validator.findFirst({
        where:{
            publickey,
        },
    })
    if(validatorinDB){
        ws.send(JSON.stringify({
            type: 'signup',
            data:{
                validatorId : validatorinDB.id,
                callbackId
            }
        }))
        validators.push({
            validatorId: validatorinDB.id,
            socket:ws, 
            publicKey:validatorinDB.publickey
        })
        return;
    }

    try {
        const newValidator = await prismaClient.validator.create({
            data: { 
                ip,
                location:'Latur',
                publickey
            }
        })

        validators.push({
            validatorId: newValidator.id,
            socket: ws,
            publicKey: newValidator.publickey
        })
    } catch (err) {
        console.error("Failed to create validator:", err);
    }
}

async function verifyMessage(signedMessage: string, publicKey: string, signature: string ){
    console.log("verifyMessage called with:", { signedMessage, publicKey, signature });
    const messageByte = nacl_util.decodeUTF8(signedMessage);
    const result = nacl.sign.detached.verify(
         messageByte,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes()
    )
    return result;
}

setInterval(async ()=>{
    const Websites = await prismaClient.website.findMany({
        where:{
            off:false
        },
    });
    for(const website of Websites){
        validators.forEach(validator => {
            const callbackId = uuidv7();
            console.log(`send validate request for ${website.url}`);
            validator.socket.send(JSON.stringify({
                type:'validate',
                data:{
                    url: website.url,
                    callbackId
                },
            }));

                CALLBACKS[callbackId] = async (data:IncomingMessage) => {
                    if(data.type === 'validate') {
                        const { validatorId, status, latency , signedMessage } = data.data;
                        const  verified = await verifyMessage(
                            `Reply to ${callbackId}`,
                            validator.publicKey,
                            signedMessage
                        );
                        if (!verified) {
                            return ;
                        }

                        await prismaClient.$transaction(async (tx) => {
                            await tx.websiteTicks.create({
                                data: {
                                    websiteId: website.id,
                                    validatorId,
                                    status,
                                    latency,
                                    createdAt:new Date(),
                                }
                            });

                            await tx.validator.update({
                                where: {id : validatorId},
                                data: {
                                    pendingPayouts: {increment: COST_PER_VALIDATION},
                                },
                            });
                        })

                    }
                }
        })
    }
}, 60*1000)
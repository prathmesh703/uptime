import type {OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage} from "common/client"
import { v7 as uuidv7 } from "uuid";
import { Keypair} from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const CALLBACKS: {[callbackId: string]:(data: SignupOutgoingMessage ) => void} = {}
let validatorId : string | null = null;

async function main() {
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
    );    
    const ws = new WebSocket("wss://uptime-hub.onrender.com");
    console.log("reached validator")
    ws.onmessage = async (event) =>{
        const data: OutgoingMessage = JSON.parse(event.data);
        console.log("in");
        if(data.type === 'signup') {
            CALLBACKS[data.data.callbackId]?.(data.data)
            delete CALLBACKS[data.data.callbackId];
        } else if(data.type === 'validate') {
            await validateHandler(ws, data.data, keypair);
        }
    }

    ws.onopen = async () =>{
        console.log("2in");
        const callbackId = uuidv7();
        CALLBACKS[callbackId] = (data: SignupOutgoingMessage) => {
            validatorId = data.validatorId;
        }
        console.log("Sending signup with publickey:", keypair.publicKey.toBase58());
        const signedMessage = await sign(`message signed for ${keypair.publicKey}, ${callbackId}`, keypair);
        
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                callbackId,
                ip: '127.0.0.1',
                publickey: keypair.publicKey.toBase58(), 
                signedMessage,
            },
        }));

    }
}

async function validateHandler(ws: WebSocket, {url, callbackId, websiteId}: ValidateOutgoingMessage , keypair: Keypair ){
    console.log(`validating ${url}`);
    const startTime = Date.now();
    const signature = await sign(`Reply to ${callbackId}` , keypair);

    try {
        const response = await fetch(url);
        const endtime = Date.now();
        const latency = endtime - startTime;
        const status = response.status;

        console.log(status);
        ws.send(JSON.stringify({
            type: 'validate',
            data:{
                callbackId, 
                status: status === 200 ? 'Good' : 'Bad',
                latency,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    } catch (error) {
        ws.send(JSON.stringify({
            type:'validate',
            data: {
                callbackId,
                status:'Bad',
                latency: 1000,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
        console.log(error);
    }
}

async function sign(message:string, keypair: Keypair) {
    const messageByte = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(
        messageByte,
        keypair.secretKey
    );
    return JSON.stringify(Array.from(signature));
}

main();

setInterval( async () =>{
}, 10000);

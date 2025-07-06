import  express  from "express";
import { authenticate } from "./Middleware";
import { prismaClient } from "db/client";


const app = express();
app.post("/api/v1/website", authenticate, async (req , res)=>{
    const userId = req.userId;
    const { url } = req.body;
    const data = await prismaClient.website.create({
        data:{
            userId, 
            url
        }
    })
    res.json({
        id:data.id
    })
});

app.get("api/v1/website/status", authenticate, async (req, res) => {
    const webId = req.query.websiteId! as unknown as string;
    const userId = req.userId;
    const data = await prismaClient.website.findFirst({
        where:{
            userId, 
            id: webId 
        }, 
        include: {
            ticks: true
        }

    })

    res.json(data);
});

app.get("api/v1/websites", authenticate, async (req, res)=>{
    const userId = req.userId;

    const websites = await prismaClient.website.findMany({
        where:{
            userId, 
            off: false
        }, 
        include:{
            ticks: true
        }
    })

    res.json(websites);
})
app.delete("api/v1/website/", authenticate, async (req, res)=>{
    const websiteId = req.body.websiteId;
    const userId = req.userId;

    await prismaClient.website.update({
        where:{
            id : websiteId, 
            userId
        }, 
        data:{
            off : true
        }
    })

    res.json({
        msg: " removed website successfully"
    })
})
app.listen(3000);
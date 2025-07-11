import  express  from "express";
import { authMiddleware } from "./Middleware";
import { prismaClient } from "db/client";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.post("/api/v1/website", authMiddleware, async (req , res)=>{
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

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
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

app.get("/api/v1/websites", authMiddleware, async (req, res)=>{
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
app.delete("/api/v1/website/", authMiddleware, async (req, res)=>{
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

console.log("server started");
app.listen(3000);
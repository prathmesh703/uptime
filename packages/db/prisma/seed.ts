import { prismaClient } from "../src";


async function seed() {
    await prismaClient.user.create({
        data:{
            id:"8", 
            email:"e@gmail.com", 
        }
    })
    
   const website =  await prismaClient.website.create({
        data:{
            url:"https://e.com", 
            userId:"8"
        }
    })

    const validator = await prismaClient.validator.create({
        data:{
            publickey:"0x918723432", 
            location:"pune", 
            ip: "127.0.0.1",
        }
    })

    await prismaClient.websiteTicks.create({
        data:{
            websiteId:website.id, 
            status:"Good", 
            createdAt: new Date(), 
            latency: 100,
            validatorId:validator.id,
        }
    })

    await prismaClient.websiteTicks.create({
        data:{
            websiteId:website.id,
            status:"Good", 
            createdAt: new Date(Date.now()-1000*60*10), 
            latency: 100,
            validatorId:validator.id,
        }
    })

    await prismaClient.websiteTicks.create({
        data:{
            websiteId:website.id,
            status:"Bad", 
            createdAt: new Date(Date.now()-1000*60*20), 
            latency: 100,
            validatorId:validator.id,
        }
    })


}

seed();
import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

export interface WebsiteTick {
    id : string, 
    createdAt : string, 
    status: string, 
    latency: string, 
}

interface Website {
    id: string, 
    url : string, 
    ticks : WebsiteTick[],
}

export function useWebsites(){
    const { getToken } = useAuth();
    const [websites , setWebsites] = useState<Website[]>([]);
    
    async function  refresh (){
        const token = await getToken();
       const repsonse = await axios.get(`${BACKEND_URL}/api/v1/websites` , {
            headers:{
                Authorization: token,
            },
       });
       setWebsites(repsonse.data);
    }

    async function removeWebsite(websiteId: string) {
        const token = await getToken();
        await axios.delete(`${BACKEND_URL}/api/v1/website`, {
            headers: {
                Authorization: token,
            },
            data: {
                websiteId,
            },
        });
        await refresh();
    }

    useEffect(()=>{
        refresh();
        const interval = setInterval(refresh, 10000); 
        return () => clearInterval(interval); 
    }, [])
    return {websites, refresh, removeWebsite};
}
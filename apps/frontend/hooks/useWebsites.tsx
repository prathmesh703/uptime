import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Website {
    id: string, 
    url : string, 
    ticks : {
        id : string, 
        createdAt : string, 
        status: string, 
        latency: string, 
    }, 
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
       setWebsites(repsonse.data.websites);
    }

    useEffect(()=>{
        refresh();
        const interval = setInterval(refresh, 1000*60*1); 
        return () => clearInterval(interval); 
    })
    return websites;
}
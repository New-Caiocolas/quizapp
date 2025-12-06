"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({ children }) {
    const router = useRouter(); 

    const { data: session, status } = useSession(); 

    if (status === "loading") {
        return null;
    }

    if (!session) {
        setTimeout(() => {
        router.push("/login");
    }, 500); 
    
    return null;
}

    return <div className="min-h-screen">{children}</div>
}
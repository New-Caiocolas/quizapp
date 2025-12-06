'use client'
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({ children }) {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]); 

    if (status === "loading") {
        return null; 
    }

    if (session) {
        return <div className="min-h-screen">{children}</div>;
    }

    return null;

}
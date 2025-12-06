'use client'
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({ children }) {
    const router = useRouter();
    const { data: session, status } = useSession();

    // 🛑 Lógica movida para o useEffect
    useEffect(() => {
        // Redireciona APENAS se o status for 'unauthenticated' e não estiver carregando
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]); 

    if (status === "loading") {
        return null; 
    }

    // Se estiver autenticado, renderiza o conteúdo
    if (session) {
        return <div className="min-h-screen">{children}</div>;
    }

    // Retorna null (ou um spinner leve) enquanto o useEffect decide a rota
    return null;

}
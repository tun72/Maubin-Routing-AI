"use client"

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";


function Logout({ content }: { content?: string }) {
    const router = useRouter()

    const { clearAuth } = useAuthStore()
    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };
    return (
        <>{content ? <Button type={"button"} onClick={handleLogout} variant={"ghost"} size={"lg"} className="text-xl">
            {content} <LogOut />
        </Button> : <Button type={"button"} onClick={handleLogout} size={"icon"} variant={"ghost"}>
            <LogOut />
        </Button>}</>
    )
}

export default Logout
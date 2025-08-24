"use client"
import AuthForm from "@/components/login-form";
import { signUpSchema } from "@/lib/validation";
import { useAuthStore, useIsHydrated } from "@/store/auth-store";
import { GalleryVerticalEnd } from "lucide-react"; import { useRouter } from "next/navigation";
;
import { useEffect, useState } from "react";


export default function SignupPage() {
    const { isAuthenticated, isAdmin, hasEmailConfig } = useAuthStore()
    const router = useRouter()

    const isHydrated = useIsHydrated()
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        if (!isHydrated) {
            return // Wait for hydration before redirecting
        }
        if (isAuthenticated) {
            router.push("/home")
        } else {
            setIsLoading(false)
        }
    }, [isAuthenticated, hasEmailConfig, router, isHydrated, isAdmin])


    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Maubin Navigation
                </a>
                <AuthForm type={"SIGN_UP"} schema={signUpSchema} defaultValues={{ email: "", password: "", username: "" }} />

            </div>
        </div>
    )
}

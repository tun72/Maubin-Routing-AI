"use client"
import AuthForm from "@/components/login-form"
import { SignInSchema } from "@/lib/validation"
import { useAuthStore, useIsHydrated } from "@/store/auth-store"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"

export default function LoginPage() {
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
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md md:max-w-4xl">
                <AuthForm type={"SIGN_IN"} schema={SignInSchema} defaultValues={{ email: "", password: "" }} />
            </div>
        </div>
    )
}

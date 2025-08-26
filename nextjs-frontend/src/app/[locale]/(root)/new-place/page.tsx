"use client"
import Header from "@/components/home/Header";
import SearchLocation from "@/components/new-place/SearchLocation";
import { useAuthStore, useIsHydrated } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Home() {

    const { isAuthenticated, isAdmin, hasEmailConfig } = useAuthStore()
    const router = useRouter()

    const isHydrated = useIsHydrated()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!isHydrated) {
            return // Wait for hydration before redirecting
        }

        if (!isAuthenticated) {
            router.push("/login")
        } else {
            setIsLoading(false)
        }
    }, [isAuthenticated, hasEmailConfig, router, isHydrated, isAdmin])

    if (isLoading && isHydrated) {
        return null
    }
    return (
        <div className="min-h-screen bg-gradient-to-br ">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <SearchLocation />
            </div>
        </div>

        // <Map accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string} />
    )
}

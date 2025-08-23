"use client"
import { AppSidebar } from "@/components/app-sidebar"
import type React from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toogle"
import { useAuthStore, useIsHydrated } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Logout from "@/components/Logout"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
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
        } else if (!isAdmin) {
            toast("You'r not admin", {
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            })
            router.push("/login")
        } else {
            setIsLoading(false)
        }
    }, [isAuthenticated, hasEmailConfig, router, isHydrated, isAdmin])

    if (isLoading && isHydrated) {
        return null
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    </div>
                    <div className="w-full flex items-center justify-end px-4 space-x-4">
                        <ThemeToggle />
                        <Logout />
                    </div>

                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

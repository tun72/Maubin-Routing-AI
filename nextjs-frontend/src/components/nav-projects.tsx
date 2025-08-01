import {
    type LucideIcon,
} from "lucide-react"


import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
// import { ThemeToggle } from "./ui/theme-toogle"

export function NavProjects({
    projects,
}: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {


    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Functions</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (

                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}

            </SidebarMenu>
            {/* <SidebarGroupLabel>Toggle Themes</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem >
                    <SidebarMenuButton asChild>
                        <Link href={"#"}>
                            <ThemeToggle />
                            <span>Light / Dark</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem></SidebarMenu> */}
        </SidebarGroup>
    )
}

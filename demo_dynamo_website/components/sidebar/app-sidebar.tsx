"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    FolderClock,
    FolderMinus,
    Frame,
    GalleryVerticalEnd,
    LayoutGrid,
    Map,
    MessageCircleMore,
    MonitorCog,
    PencilRuler,
    PieChart,
    Settings2,
    SquarePen,
    SquareTerminal,
    UserCog,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
// import { NavUser } from "./nav-user"
import { Logo } from "./logo"
import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "",
    },
    teams: [
        {
            name: "Acme Inc123",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutGrid,
            isActive: true,
            // items: [
            //     {
            //         title: "History",
            //         url: "/dashboard",
            //     },
            //     {
            //         title: "Starred",
            //         url: "#",
            //     },
            //     {
            //         title: "Settings",
            //         url: "#",
            //     },
            // ],
        },
        {
            title: "Operator",
            url: "#",
            icon: UserCog,
            items: [
                {
                    title: "OP Status",
                    url: "#",
                },
                {
                    title: "OP Table",
                    url: "/operator",
                },
            ],
        },
        {
            title: "Machine",
            url: "#",
            icon: MonitorCog,
            items: [
                {
                    title: "MC Status",
                    url: "#",
                },
                {
                    title: "Machine Table",
                    url: "machine",
                },
            ],
        },
        {
            title: "Drawing Code",
            url: "/drawingCode",
            icon: PencilRuler,
            items: [
                {
                    title: "Drawing Code Table",
                    url: "/drawingCode",
                },
            ],
        },
        {
            title: "Process",
            url: "#",
            icon: SquarePen,
            items: [
                {
                    title: "Process Table",
                    url: "/process",
                },
            ],
        },
        {
            title: "Oder",
            url: "#",
            icon: MessageCircleMore,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
            ],
        },
        {
            title: "Group",
            url: "#",
            icon: FolderMinus,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
            ],
        },
        {
            title: "History",
            url: "/history",
            icon: FolderClock,
            items: [
                {
                    title: "History Process",
                    url: "/history/historyProcess",
                },
                {
                    title: "History Machine",
                    url: "/history/historyMachine",
                },
                {
                    title: "History Operator",
                    url: "/history/historyOperator",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        // {
        //     title: "Settings",
        //     url: "#",
        //     icon: Settings2,
        //     items: [
        //         {
        //             title: "General",
        //             url: "#",
        //         },
        //         {
        //             title: "Team",
        //             url: "#",
        //         },
        //         {
        //             title: "Billing",
        //             url: "#",
        //         },
        //         {
        //             title: "Limits",
        //             url: "#",
        //         },
        //     ],
        // },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    // const isMobile = useIsMobile()
    return (
        <Sidebar collapsible="icon" {...props} className="bg-white">
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            {/* <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter> */}
            <SidebarRail />
        </Sidebar>
    )
}

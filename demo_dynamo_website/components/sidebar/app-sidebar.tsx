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
    Tablet,
    UserCog,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { Logo } from "./logo"
import { useAuth } from "@/contexts/AuthContext"
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
            title: "Thống kê",
            url: "/dashboard",
            icon: LayoutGrid,
            isActive: true,
            items: [
                // {
                //     title: "Máy móc",
                //     url: "/dashboard/machine",
                // },
                {
                    title: "Vận hành",
                    url: "/dashboard/operation",
                },
                // {
                //     title: "Gia công chi tiết",
                //     url: "/dashboard/process",
                // },
                // {
                //     title: "Bản vẽ",
                //     url: "/dashboard/drawingCode",
                // },
            ],
        },
        {
            title: "Nhân viên",
            url: "/operator",
            icon: UserCog,
            items: [
                // {
                //     title: "OP Status",
                //     url: "/operator/status",
                // },
                {
                    title: "Danh sách nhân viên",
                    url: "/operator",
                },
                {
                    title: "Cài đặt KPI",
                    url: "/operator/kpi",
                },
            ],
        },
        {
            title: "Máy móc",
            url: "/machine",
            icon: MonitorCog,
            items: [
                // {
                //     title: "MC Status",
                //     url: "/machine/status",
                // },
                {
                    title: "Danh sách máy móc",
                    url: "/machine/table",
                },
                {
                    title: "Cài đặt KPI",
                    url: "/machine/kpi",
                },
            ],
        },
        {
            title: "Bản vẽ & Đơn",
            url: "/drawingCode",
            icon: PencilRuler,
            items: [
                {
                    title: "Bản vẽ & Đơn hàng",
                    url: "/drawingCode",
                },
            ],
        },
        {
            title: "Gia công",
            url: "/process",
            icon: SquarePen,
            items: [
                {
                    title: "Kanban Process",
                    url: "/process/kanban",
                },
                {
                    title: "Gia công chi tiết",
                    url: "/process",
                },
            ],
        },
        {
            title: "Mã hàng",
            url: "#",
            icon: MessageCircleMore,
            items: [
                {
                    title: "Mã hàng gia công",
                    url: "/orderDetail",
                },
            ],
        },
        {
            title: "Nhóm",
            url: "/group",
            icon: FolderMinus,
            items: [
                {
                    title: "Các Nhóm",
                    url: "/group",
                },
                {
                    title: "Cài đặt KPI",
                    url: "/group/kpi",
                }
            ],
        },
        {
            title: "Lịch sử",
            url: "/history",
            icon: FolderClock,
            items: [
                {
                    title: " Quy trình",
                    url: "/history/historyProcess",
                },
                {
                    title: " Máy móc",
                    url: "/history/historyMachine",
                },
                {
                    title: " Người vận hành",
                    url: "/history/historyOperator",
                },
            ],
        },
        // {
        //     title: "Tablet",
        //     url: "/tablet",
        //     icon: Tablet,
        //     items: [
        //         {
        //             title: "Kế hoạch",
        //             url: "/tablet/process",
        //         },
        //         {
        //             title: "Vận hành",
        //             url: "/tablet/operation",
        //         },
        //         {
        //             title: "Khai báo",
        //             url: "/tablet/newProcess",
        //         },
        //     ],
        // },
    ],
    // projects: [
    //     {
    //         name: "Design Engineering",
    //         url: "#",
    //         icon: Frame,
    //     },
    //     {
    //         name: "Sales & Marketing",
    //         url: "#",
    //         icon: PieChart,
    //     },
    //     {
    //         name: "Travel",
    //         url: "#",
    //         icon: Map,
    //     },
    // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth()

    // Filter navigation items based on user role
    const getNavItemsForRole = () => {
        if (user?.role === "Operator") {
            return data.navMain.filter(item =>
                item.title === "Thống kê" || item.title === "Tablet"
            )
        }
        // Admin sees all navigation items
        return data.navMain
    }

    return (
        <Sidebar collapsible="icon" {...props} className="bg-white">
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={getNavItemsForRole()} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            {/* <SidebarFooter>
                <IIC />
            </SidebarFooter> */}
            {/* <SidebarRail /> */}
        </Sidebar>
    )
}

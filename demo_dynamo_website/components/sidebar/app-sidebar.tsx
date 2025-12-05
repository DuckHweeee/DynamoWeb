"use client"

import * as React from "react"
import {
    FolderClock,
    FolderMinus,
    LayoutGrid,
    MessageCircleMore,
    MonitorCog,
    PencilRuler,
    SquarePen,
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

const data = {
    navMain: [
        {
            title: "THỐNG KÊ",
            url: "/dashboard",
            icon: LayoutGrid,
            isActive: true,
            items: [
                {
                    title: "Máy móc ",
                    url: "/dashboard/machine",
                },
                {
                    title: "Vận hành",
                    url: "/dashboard/operation",
                },
                {
                    title: "Gia công chi tiết",
                    url: "/dashboard/process",
                },
                {
                    title: "Bản vẽ",
                    url: "/dashboard/drawingCode",
                },
            ],
        },
        {
            title: "NHÂN VIÊN",
            url: "/operator",
            icon: UserCog,
            items: [
                {
                    title: "Trạng thái nhân viên",
                    url: "/operator/status",
                },
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
            title: "MÁY MÓC",
            url: "/machine",
            icon: MonitorCog,
            items: [
                {
                    title: "Trạng thái máy móc",
                    url: "/machine/status",
                },
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
        // {
        //     title: "Bản vẽ & Đơn",
        //     url: "/drawingCode",
        //     icon: PencilRuler,
        //     items: [
        //         {
        //             title: "Bản vẽ & Đơn hàng",
        //             url: "/drawingCode",
        //         },
        //     ],
        // },
        {
            title: "MÃ HÀNG",
            url: "#",
            icon: MessageCircleMore,
            items: [
                {
                    title: "Mã hàng gia công",
                    url: "/orderDetail",
                },
                 {
                    title: "Trạng thái mã hàng",
                    url: "/orderDetail/status",
                },
            ],
        },
        {
            title: "GIA CÔNG",
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
            title: "NHÓM",
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
                },
                {
                    title: "Báo cáo hàng ngày",
                    url: "/group/dailyReport",
                }
            ],
        },
        {
            title: "LỊCH SỬ",
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
        {
            title: "TABLET",
            url: "/tablet",
            icon: Tablet,
            items: [
                {
                    title: "Kế hoạch",
                    url: "/tablet/process",
                },
                {
                    title: "Vận hành",
                    url: "/tablet/operation",
                },
                {
                    title: "Khai báo",
                    url: "/tablet/newProcess",
                },
            ],
        },
        {
            title: "TÀI KHOẢN",
            url: "/account",
            icon: UserCog,
            items: [
                { title: "Quản lý tài khoản", url: "/account" },
            ]
        }
    ],
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
            </SidebarContent>
        </Sidebar>
    )
}

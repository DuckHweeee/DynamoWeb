"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { Toaster } from "sonner";
import { ClientHeader } from "../../components/navUser";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  FolderClock,
  FolderMinus,
  LayoutGrid,
  MessageCircleMore,
  MonitorCog,
  SquarePen,
  Tablet,
  UserCog,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bounce, ToastContainer } from "react-toastify";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const data = {
  navMain: [
    {
      title: "THỐNG KÊ",
      url: "/dashboard",
      icon: LayoutGrid,
      isActive: true,
      items: [
        {
          title: "Thống kê máy móc ",
          url: "/dashboard/machine",
        },
        {
          title: "Thống kê vận hành",
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
          title: "Kế hoạch chi tiết",
          url: "/process",
        },

        {
          title: "Gia công chi tiết",
          url: "/process/unplannedProcess",
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
          title: " Gia công chi tiết",
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

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [currentTitle, setCurrentTitle] = useState<string>("")

  useEffect(() => {
    const allItems = data.navMain.flatMap(m => m.items ?? [])
    const found = allItems.find(i => i.url === pathname)
    if (found) setCurrentTitle(found.title)
  }, [pathname])

  // Filter navigation items based on user role
  const getNavItemsForRole = () => {
    console.log("user role: ", user?.role)
    if (user?.role === "Operator") {
      const navBarForOperator = data.navMain.filter(item =>
        item.title === "Thống kê" || item.title === "Tablet"
      )
      console.log("nav bar item for operator: ", navBarForOperator)
      return navBarForOperator
    }
    // Admin sees all navigation items
    return data.navMain
  }

  useEffect(() => {
    getNavItemsForRole()
  }, [user])

  return (
    <div
      className={`
    ${geistSans.variable} ${geistMono.variable} antialiased
    min-h-screen
    bg-[url(/test12.jpg)]
    bg-no-repeat bg-cover bg-fixed
  `}
    >
      <ProtectedRoute allowedRoles={["Admin", "Operator"]}>
        <SidebarProvider>
          <Toaster richColors position="top-right" closeButton />
          <AppSidebar data={getNavItemsForRole()} />
          <SidebarInset className="bg-transparent" >
            <ClientHeader title={currentTitle} />
            {children}
          </SidebarInset>
          <ToastContainer position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce} />
        </SidebarProvider>
      </ProtectedRoute>
    </div>
  );
}

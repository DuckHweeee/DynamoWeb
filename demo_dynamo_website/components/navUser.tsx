"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getBreadcrumbFromPath(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    return segments
        .map((segment) =>
            segment
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        )
        .join(" > ");
}

export function ClientHeader() {
    const pathname = usePathname();
    const breadcrumb = getBreadcrumbFromPath(pathname || "/");
    const { user, logout } = useAuth();

    return (
        <header className="m-2 px-5 py-4 bg-white rounded-[10px] flex items-center justify-between shadow">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex flex-col">
                    <h1 className="text-xl font-semibold text-[#890101]">
                        Xin chào {user?.fullname || user?.username || "Dynamo"}, ngày mới tốt lành!
                    </h1>
                    {/* <p className="text-sm text-gray-500">{breadcrumb}</p> */}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* <div className="relative">
                    <Bell className="w-6 h-6 text-gray-700" />
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full" />
                </div> */}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center px-4 py-2 bg-white rounded-xl cursor-pointer hover:bg-[#F8DBDB] transition-colors border border-gray-300 shadow-md">
                            <div className="flex flex-row gap-2 items-center">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/dynamo.png" />
                                    <AvatarFallback>
                                        {user?.fullname?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "D"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-base px-3">
                                    <span className="text-red-900 font-medium capitalize">
                                        {user?.fullname || user?.username || "Dynamo"}
                                    </span>
                                    <span className="text-red-700 text-sm tracking-wide ">
                                        Vai trò {user?.role === "Admin" ? "quản lý" : "người vận hành"}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown className="ml-2 text-gray-600" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-55">
                        <DropdownMenuItem onClick={logout} className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Đăng xuất</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

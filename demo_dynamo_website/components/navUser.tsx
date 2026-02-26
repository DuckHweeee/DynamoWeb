"use client";

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

interface ClientHeaderProps {
    title: string
}

// function getBreadcrumbFromPath(pathname: string) {
//     const segments = pathname.split("/").filter(Boolean);
//     return segments
//         .map((segment) =>
//             segment
//                 .split("-")
//                 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                 .join(" ")
//         )
//         .join(" > ");
// }

export function ClientHeader(title: ClientHeaderProps) {
    // const pathname = usePathname();
    // const breadcrumb = getBreadcrumbFromPath(pathname || "/");
    const { user, logout } = useAuth();

    return (
        <header className="px-5 py-3 bg-white/10 backdrop-blur
            border border-white/20
            shadow-xl rounded-[15px] m-2 flex items-center justify-between shadow">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 text-white" />
                <div className="flex flex-col">
                    <h1 className="relative text-xl font-extrabold uppercase tracking-wide
                        bg-gradient-to-r from-[#e5e7eb] via-[#9ca3af] to-[#f9fafb]
                        bg-clip-text text-transparent
                        drop-shadow-[1px_1px_1px_rgba(0,0,0,0.45)] mb-1
                    ">
                        <span className="absolute inset-0 bg-gradient-to-r from-[#9ca3af] via-[#f3f4f6] to-[#6b7280]
                        bg-clip-text text-transparent translate-x-[1px] translate-y-[1px]">
                            {title.title}
                        </span>
                        <span className="relative">
                            {title.title}
                        </span>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* <div className="relative">
                    <Bell className="w-6 h-6 text-gray-700" />
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full" />
                </div> */}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center px-4 py-2 bg-white rounded-xl cursor-pointer hover:bg-[#EAEAEA] transition-colors border border-slate-200">
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

"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

    return (
        <header className="m-2 px-4 py-3 bg-white rounded-[10px] flex items-center justify-between shadow">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold text-[#369FFF]">Hello IIC 4.0, welcome back!</h1>
                    <p className="text-sm text-gray-500">{breadcrumb}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Bell className="w-6 h-6 text-gray-700" />
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full" />
                </div>

                <div className="flex items-center px-3 py-1 bg-[#DDEEFF] rounded-md">
                    <div className="flex flex-row gap-2 items-center">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/dynamo.png" />
                            <AvatarFallback>Dynamo</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-lg">
                            <span className="text-black font-medium">Dynamo</span>
                            <span className="text-blue-600">Admin</span>
                        </div>
                    </div>
                    <ChevronDown className="ml-2 text-gray-600" />
                </div>
            </div>
        </header>
    );
}

"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { MachineStatusProvider } from "./_components/MachineStatusContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function TabletLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isProcess = pathname.includes("/tablet/process");
    const isOperation = pathname.includes("/tablet/operation");
    const isNewProcess = pathname.includes("/tablet/newProcess");

    const tabletCSS = "max-[1300px]:text-3xl max-[1300px]:!py-7 max-[1300px]:!px-8";

    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ProtectedRoute allowedRoles={["Operator", "Admin"]}>
                <div className="flex items-center justify-between p-3 lg:px-8 bg-[#E5EAF0]">
                    {/* <div className="flex lg:flex-1 items-center gap-4">
                        <a href="#" className="-m-1.5 p-1.5">
                            <img className="h-15 w-auto" src="/logo.png" alt="Logo" />
                        </a>
                    </div> */}
                    {/* Tắt tạm thời */}
                    <div className="flex gap-x-5">
                        <Link href={"/dashboard/machine"}>
                            <Button
                                className={`cursor-pointer hover:bg-blue-200 text-2xl font-semibold !py-6 px-4 rounded-sm ${tabletCSS}
                                    ${!isProcess && !isNewProcess && !isOperation ? "text-blue-950 border-blue-950 border-3 bg-white" : " bg-white text-blue-950"}
                                `}
                            >
                                Thống Kê
                            </Button>
                        </Link>
                        <Link href={"/tablet/process"}>
                            <Button
                                className={`cursor-pointer hover:bg-blue-200 text-2xl font-semibold !py-6 px-4 rounded-sm ${tabletCSS}
                                    ${isProcess
                                        ? "text-blue-950 border-blue-950 border-3 bg-white"
                                        : " bg-white text-blue-950"
                                    }`}
                            >
                                Kế Hoạch
                            </Button>
                        </Link>
                        <Link href={"/tablet/newProcess"}>
                            <Button
                                className={`cursor-pointer hover:bg-blue-200 text-2xl font-semibold !py-6 px-4 rounded-sm ${tabletCSS}
                                    ${isNewProcess
                                        ? "text-blue-950 border-blue-950 border-3 bg-white"
                                        : " bg-white text-blue-950"
                                    }`}
                            >
                                Khai Báo
                            </Button>
                        </Link>
                        <Link href={"/tablet/operation"}>
                            <Button
                                variant="outline"
                                className={`cursor-pointer hover:bg-blue-200 text-2xl font-semibold !py-6 px-4 rounded-sm ${tabletCSS}
                                     ${isOperation
                                        ? " bg-white border-blue-950 border-3"
                                        : "text-blue-950 "
                                    }`}
                            >
                                Vận Hành
                            </Button>
                        </Link>

                        <Button
                            onClick={logout}
                            variant="outline"
                            size="sm"
                            className="text-2xl font-semibold !py-6 px-4 rounded-sm border-red-500 border-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Đăng Xuất
                        </Button>
                    </div>
                </div>

                <MachineStatusProvider>
                    {children}
                </MachineStatusProvider>
                <Toaster richColors position="top-left" />
            </ProtectedRoute>
        </div>
    );
}

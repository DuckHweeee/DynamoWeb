"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { MachineStatusProvider } from "./_components/MachineStatusContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function TbaletLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isProcess = pathname.includes("/tablet/process");
    // const isOperation = pathname.includes("/tablet/operation");

    return (
        <html>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="flex items-center justify-between p-3 lg:px-8 bg-[#E5EAF0]">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <img className="h-15 w-auto" src="/logo.png" alt="Logo" />
                        </a>
                    </div>
                    <div className="flex gap-x-5">
                        <Link href={"/tablet/process"}>
                            <Button
                                className={`cursor-pointer hover:bg-blue-200 text-2xl font-semibold !py-6 px-4 rounded-sm ${isProcess
                                    ? "text-blue-950 border-blue-950 border-3 bg-white"
                                    : " bg-white text-blue-950"
                                    }`}
                            >
                                Chu Trình
                            </Button>
                        </Link>
                        <Link href={"/tablet/operation"}>
                            <Button
                                variant="outline"
                                className={`cursor-pointer hover:bg-blue-200 text-2xl font-semibold !py-6 px-4 rounded-sm ${isProcess
                                    ? " bg-white"
                                    : "text-blue-950 border-blue-950 border-3"
                                    }`}
                            >
                                Vận Hành
                            </Button>
                        </Link>
                    </div>
                </div>
                <MachineStatusProvider>
                    {children}
                </MachineStatusProvider>
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}

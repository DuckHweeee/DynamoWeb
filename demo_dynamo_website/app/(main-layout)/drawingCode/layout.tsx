"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ClipboardList, PencilRuler } from "lucide-react";
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

    const isOrder = pathname.startsWith("/drawingCode/order");
    const isDrawingCode = !isOrder && pathname.startsWith("/drawingCode");
    return (
        // <html>
        <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <div className="m-2 px-4 py-1 bg-white rounded-[10px] shadow">
                <div className="flex items-center justify-center p-3">
                    <div className="flex gap-x-3">
                        <Link href={"/drawingCode"}>
                            <Button
                                className={`cursor-pointer hover:bg-blue-200 text-xl font-semibold !py-6 px-4 rounded-sm border-1 bg-white text-blue-950
                                    ${isDrawingCode
                                        ? "border-2 border-blue-950"
                                        : ""
                                    }`}
                            >
                                <PencilRuler
                                    className={`!w-[20px] !h-[20px] text-blue-950`}
                                /> Bản vẽ
                            </Button>
                        </Link>
                        <Link href={"/drawingCode/order"}>
                            <Button
                                className={`cursor-pointer hover:bg-blue-200 text-xl font-semibold !py-6 px-4 rounded-sm border-1 bg-white text-blue-950
                                    ${isOrder
                                        ? "border-2 border-blue-950"
                                        : ""
                                    }`}
                            >
                                <ClipboardList className={`!w-[20px] !h-[20px] text-blue-950`} />Đơn hàng
                            </Button>
                        </Link>
                    </div>
                </div>
                {children}
            </div>
            {/* <Toaster richColors position="top-left" /> */}
        </div>
        // </html>
    );
}

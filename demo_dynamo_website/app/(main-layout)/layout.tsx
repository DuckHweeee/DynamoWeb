"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { Toaster } from "sonner";
import { ClientHeader } from "../../components/navUser";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ProtectedRoute allowedRoles={["Admin", "Operator"]}>
        <SidebarProvider>
          <Toaster richColors position="top-right" closeButton />
          <AppSidebar />
          <SidebarInset className="bg-[#EAEAEA]">
            <ClientHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    </div>
  );
}

"use client"

import * as React from "react"
import {
    LucideProps,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { Logo } from "./logo"

interface DataProps {
        title: string;
        url: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
        isActive?: boolean;
        items: {
            title: string;
            url: string;
        }[];
    }

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  data: DataProps[]
//   onSelectTitle: (title: string) => void
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="bg-white/40 backdrop-blur-3xl
            border border-white/20
            shadow-xl rounded-xl m-2">
                <Logo />
            </SidebarHeader>
            <SidebarContent >
                <NavMain items={data} />
            </SidebarContent>
        </Sidebar>
    )
}

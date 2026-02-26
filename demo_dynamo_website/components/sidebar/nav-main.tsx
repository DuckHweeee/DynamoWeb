"use client"

import { useState } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    const [activeGroup, setActiveGroup] = useState<string | null>(null)
    const [activeItem, setActiveItem] = useState<string | null>(null)

    const handleItemClick = (groupTitle: string, itemTitle: string) => {
        setActiveGroup(groupTitle)
        setActiveItem(itemTitle)
    }

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const isGroupActive = activeGroup === item.title

                    return (
                        <Collapsible
                            key={item.title}
                            open={isGroupActive}
                            onOpenChange={(open) => {
                                if (open) setActiveGroup(item.title)
                                else if (activeGroup === item.title) setActiveGroup(null)
                            }}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        className={`cursor-pointer text-base text-white pb-6 pt-6 ${isGroupActive ? "text-[#890101] bg-white" : ""}`}
                                    >
                                        <Link href={item.url}>
                                            {item.icon && (
                                                <span
                                                    className={` inline-flex items-center justify-center bg-white/40 backdrop-blur-3xl
                                                                border border-white/20
                                                                shadow-xl rounded-md
                                                        ${isGroupActive
                                                            ? "border-[#890101] text-[#890101]"
                                                            : "border-white/50 text-white"
                                                        }
                                                    `}
                                                    style={{ width: 36, height: 36 }}
                                                >
                                                    <item.icon
                                                        size={20}
                                                        className="pointer-events-none"
                                                    />
                                                </span>
                                            )}
                                        </Link>
                                        <span className={`${isGroupActive ? "text-[#890101] bg-white" : ""} tracking-widest `}>{item.title}</span>
                                        <ChevronRight
                                            className={`ml-auto transition-transform duration-200 ${isGroupActive ? "rotate-90" : ""
                                                }`}
                                        />

                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                {item.items && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => {
                                                const isActive = activeItem === subItem.title
                                                return (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}

                                                    >
                                                        <SidebarMenuSubButton asChild className={isActive ? "text-[#890101] bg-white " : "  text-white "}>
                                                            <Link
                                                                href={subItem.url}
                                                                onClick={() =>
                                                                    handleItemClick(
                                                                        item.title,
                                                                        subItem.title
                                                                    )
                                                                }
                                                            >
                                                                <span>
                                                                    {subItem.title}
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}

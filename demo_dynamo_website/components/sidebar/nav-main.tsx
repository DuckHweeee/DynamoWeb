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
                                        className={`text-lg ${isGroupActive ? "text-[#073c7e] font-bold" : ""}`}
                                    >
                                        <Link href={item.url}>
                                            {item.icon && <item.icon />}
                                        </Link>
                                        <span>{item.title}</span>
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
                                                        <SidebarMenuSubButton asChild className={isActive ? "!text-[#073c7e] font-bold " : ""}>
                                                            <Link
                                                                href={subItem.url}
                                                                onClick={() =>
                                                                    handleItemClick(
                                                                        item.title,
                                                                        subItem.title
                                                                    )
                                                                }
                                                            >
                                                                <span>{subItem.title}</span>
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

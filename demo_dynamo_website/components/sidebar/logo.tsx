"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { House } from "lucide-react"
import * as React from "react"


export function Logo() {
    const { open } = useSidebar()
    return (
        <>
            <div>
                {/* {open ?
                    // <img className="h-auto w-auto" src="/logo.png" alt="Logo" />
                    : (<House className="ml-1.5 mt-2" />)
                } */}
            </div>
        </>

    )
}

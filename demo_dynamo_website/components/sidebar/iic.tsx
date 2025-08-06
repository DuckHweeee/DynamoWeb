"use client"
import { useSidebar } from "@/components/ui/sidebar"
import * as React from "react"


export function IIC() {
    const { open } = useSidebar()
    return (
        <>
            <div>
                {open ?
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-[#004799] text-lg">Copyright by IIC 4.0</p>
                        {/* <img className="h-10 w-10" src="/avt.png" alt="Logo" /> */}
                    </div>
                    : <img className="h-auto w-auto" src="/avt.png" alt="Logo" />
                }
            </div>
        </>

    )
}

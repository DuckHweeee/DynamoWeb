"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { House } from "lucide-react"
import * as React from "react"
import Link from "next/link"


export function Logo() {
    const { open } = useSidebar()
    return (
        <>
            <Link href="/"   className="flex items-center justify-center pt-3">
                {open ?
                    <img className="h-auto w-auto" src="/Layer_2.png" alt="Logo" />
                    : (<House className="ml-1.5 mt-2" />)
                }
            </Link>
        </>

    )
}

"use client"

import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

export interface MachineStatus {
    id: string
    machineId: string
    status: string
    time: string
}

interface MachineStatusContextType {
    machineStatuses: MachineStatus[]
}

const MachineStatusContext = createContext<MachineStatusContextType>({
    machineStatuses: [],
})

export const useMachineStatus = () => useContext(MachineStatusContext)
const webSocketLink = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export const MachineStatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [machineStatuses, setMachineStatuses] = useState<MachineStatus[]>([])

    useEffect(() => {
        axios.get(`${url}/api/current-status`)
            .then((res) => setMachineStatuses(res.data))
            .catch((err) => console.error("Error fetching machine:", err))
    }, [])
    console.log("Trc khi co")
    console.log(machineStatuses)

    useEffect(() => {
        const ws = new WebSocket(`${webSocketLink}/ws/users`)

        ws.onopen = () => {
            console.log("WebSocket connected")
        }

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data)
                console.log("Toàn bộ")
                console.log(msg)
                if (msg.type === "status" && Array.isArray(msg.data)) {
                    setMachineStatuses(msg.data)
                    console.log("Sau khi có status")
                    console.log(machineStatuses)
                }
            } catch (err) {
                console.error(" Lỗi khi nhận thông tin, WebSocket error:", err)
            }
        }

        ws.onerror = (err) => {
            console.error("WebSocket error:", err)
        }
    })


    return (
        <MachineStatusContext.Provider value={{ machineStatuses }}>
            {children}
        </MachineStatusContext.Provider>
    )
}

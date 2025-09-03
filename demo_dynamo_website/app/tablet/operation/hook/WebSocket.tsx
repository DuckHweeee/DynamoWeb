// "use client"

// import { useEffect, useState } from "react"

// export interface MachineStatus {
//     id: string
//     machineId: string
//     status: string
//     time: string
// }

// export function useMachineStatusWS(url: string) {
//     const [wsData, setWsData] = useState<MachineStatus[]>([])

//     useEffect(() => {
//         const socket = new WebSocket(url)

//         socket.onopen = () => {
//             console.log("WebSocket connected")
//         }

//         socket.onmessage = (event) => {
//             try {
//                 const data = JSON.parse(event.data)
//                 if (Array.isArray(data)) {
//                     setWsData(data)
//                 } else {
//                     // Cập nhật phần tử theo machineId nếu là object đơn
//                     setWsData((prev) => {
//                         const filtered = prev.filter(
//                             (item) => item.machineId !== data.machineId
//                         )
//                         return [...filtered, data]
//                     })
//                 }
//             } catch (err) {
//                 console.error("WebSocket parse error:", err)
//             }
//         }

//         socket.onerror = (err) => {
//             console.error("WebSocket error:", err)
//         }

//         socket.onclose = () => {
//             console.warn("WebSocket closed")
//         }

//         // Cleanup on unmount
//         return () => {
//             socket.close()
//         }
//     }, [url])
//     return wsData
// }

import { DrawingCodeProcessHistory } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useMachineProcessHistory(machineId: string | null, startDate: string | null, endDate: string | null) {
    const [data, setData] = useState<DrawingCodeProcessHistory[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                
                let apiUrl = `${url}/api/drawing-code-process/machine`
                const params = new URLSearchParams()
                
                if (machineId) {
                    params.append('machine_id', machineId)
                }
                
                if (startDate && endDate) {
                    const startTimestamp = new Date(startDate).getTime()
                    const endTimestamp = new Date(endDate).getTime()
                    params.append('start', startTimestamp.toString())
                    params.append('stop', endTimestamp.toString())
                }
                
                if (params.toString()) {
                    apiUrl += `?${params.toString()}`
                }
                
                const res = await axios.get<DrawingCodeProcessHistory[]>(apiUrl);
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải dữ liệu lịch sử quy trình máy")
                console.error("Error fetching machine process history:", err)
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [machineId, startDate, endDate])

    return { data, loading, error, refetch: () => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                
                let apiUrl = `${url}/api/drawing-code-process/machine`
                const params = new URLSearchParams()
                
                if (machineId) {
                    params.append('machine_id', machineId)
                }
                
                if (startDate && endDate) {
                    const startTimestamp = new Date(startDate).getTime()
                    const endTimestamp = new Date(endDate).getTime()
                    params.append('start', startTimestamp.toString())
                    params.append('stop', endTimestamp.toString())
                }
                
                if (params.toString()) {
                    apiUrl += `?${params.toString()}`
                }
                
                const res = await axios.get<DrawingCodeProcessHistory[]>(apiUrl);
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải dữ liệu lịch sử quy trình máy")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }}
}

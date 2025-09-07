import { DrawingCodeProcessHistory } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useDrawingCodeProcessHistory(staffId: string | null, startDate: string | null, endDate: string | null) {
    const [data, setData] = useState<DrawingCodeProcessHistory[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!staffId || !startDate || !endDate) {
            setData([])
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // Convert dates to timestamps or use appropriate format
                const startTimestamp = new Date(startDate).getTime()
                const endTimestamp = new Date(endDate).getTime()
                
                const res = await axios.get<DrawingCodeProcessHistory[]>(
                    `${url}/api/drawing-code-process/staff?staff_id=${staffId}&start=${startTimestamp}&stop=${endTimestamp}`
                );
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải dữ liệu lịch sử quy trình")
                console.error("Error fetching drawing code process history:", err)
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [staffId, startDate, endDate])

    return { data, loading, error, refetch: () => {
        if (staffId && startDate && endDate) {
            const fetchData = async () => {
                try {
                    setLoading(true)
                    setError(null)
                    
                    const startTimestamp = new Date(startDate).getTime()
                    const endTimestamp = new Date(endDate).getTime()
                    
                    const res = await axios.get<DrawingCodeProcessHistory[]>(
                        `${url}/api/drawing-code-process/staff?staff_id=${staffId}&start=${startTimestamp}&stop=${endTimestamp}`
                    );
                    setData(res.data)
                } catch (err) {
                    setError("Lỗi khi tải dữ liệu lịch sử quy trình")
                } finally {
                    setLoading(false)
                }
            }
            fetchData()
        }
    }}
}

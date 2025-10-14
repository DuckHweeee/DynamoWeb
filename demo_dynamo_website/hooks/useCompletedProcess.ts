import { DrawingCodeProcessHistory } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useCompletedProcess() {
    const [data, setData] = useState<DrawingCodeProcessHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const res = await axios.get<DrawingCodeProcessHistory[]>(
                `${url}/api/drawing-code-process/completed`
            );
            
            console.log("Completed process response:", res.data)
            setData(res.data)
        } catch (err) {
            setError("Lỗi khi tải dữ liệu lịch sử quy trình hoàn thành.")
            console.error("Error fetching completed process history:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { 
        data, 
        loading, 
        error, 
        refetch: fetchData
    }
}

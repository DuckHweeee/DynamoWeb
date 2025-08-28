
import axios from "axios";
import { useEffect, useState } from "react";
import { Process } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useUnPlannedProcess() {
    const [data, setData] = useState<Process[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Process[]>(`${url}/api/drawing-code-process/unplanned`)
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải dữ liệu")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    return { data, loading, error }
}
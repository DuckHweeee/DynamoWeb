import { useEffect, useState } from "react";
import { KPI } from "../lib/type";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useStaffKPI() {
    const [data, setData] = useState<KPI[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<KPI[]>(`${url}/api/staff-kpi`)
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


import { Staff } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useStaff() {
    const [data, setData] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Staff[]>(`${url}/api/staff`);
                // Ensure we always set an array
                setData(Array.isArray(res.data) ? res.data : [])
            } catch (err) {
                setError("Lỗi khi tải dữ liệu nhân viên")
                setData([]) // Ensure data remains an empty array on error
                console.error('Staff API error:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    return { data, loading, error }
}
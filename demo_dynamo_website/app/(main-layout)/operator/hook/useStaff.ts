import { useEffect, useState } from "react"
import axios from "axios"
import { Staff } from "@/lib/type"

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useStaff() {
    const [data, setData] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Staff[]>(`${url}/api/staff`)
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải danh sách nhân viên")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return { data, loading, error }
}

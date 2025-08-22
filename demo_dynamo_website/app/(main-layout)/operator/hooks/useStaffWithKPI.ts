import { useEffect, useState } from "react"
import axios from "axios"
import { Staff } from "@/lib/type"
import { KPI } from "../kpi/lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useStaffWithKPI(idStaffString: string) {
    const [data, setData] = useState<Staff>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${url}/api/staff/${idStaffString}`)
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải thông tin")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])
    return { data, loading, error }
}


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

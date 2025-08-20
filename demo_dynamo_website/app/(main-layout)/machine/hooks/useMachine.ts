import { useEffect, useState } from "react"
import axios from "axios"
import { Group, Machine2 } from "@/lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useMachine() {
    const [data, setData] = useState<Machine2[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Machine2[]>(`${url}/api/machine`)
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

export function useGroup(groupType: string) {
    const [data, setData] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Group[]>(`${url}/api/group`)
                const filtered = res.data.filter((g) => g.groupType === groupType)
                setData(filtered)
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
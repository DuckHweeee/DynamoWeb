import axios from "axios";
import { useEffect, useState } from "react";
import { Group } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useGroup() {
    const [data, setData] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Group[]>(`${url}/api/group`);
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
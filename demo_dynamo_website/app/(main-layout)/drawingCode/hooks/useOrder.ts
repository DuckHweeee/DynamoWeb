import { Order } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useOrder() {
    const [data, setData] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Order[]>(`${url}/api/order`)
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
import axios from "axios";
import { useEffect, useState } from "react";
import { OrderDetail } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useOrderDetail() {
    const [data, setData] = useState<OrderDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get<OrderDetail[]>(`${url}/api/order-detail`)
            setData(res.data)
        } catch (err) {
            setError("Lỗi khi tải dữ liệu")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { data, loading, error, refetch: fetchData }
}

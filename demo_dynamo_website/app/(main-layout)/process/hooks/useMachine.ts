import axios from "axios";
import { useEffect, useState } from "react";
import { MachineDto } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useMachine() {
    const [data, setData] = useState<MachineDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<MachineDto[]>(`${url}/api/machine`);
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
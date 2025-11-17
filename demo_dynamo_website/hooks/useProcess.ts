import { Process2 } from "@/lib/type";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useProcess() {
    const [data, setData] = useState<Process2[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url}/api/drawing-code-process`);
            // Ensure we always work with arrays
            const responseData = Array.isArray(res.data) ? res.data : [];
            const filtered = responseData.filter((item: Process2) => item.isPlan === 1);
            setData(filtered);
        } catch (err) {
            setError("Lỗi khi tải dữ liệu process");
            setData([]) // Ensure data remains an empty array on error
            console.error('Process API error:', err)
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return { data, loading, error, refetch: fetchData };
}
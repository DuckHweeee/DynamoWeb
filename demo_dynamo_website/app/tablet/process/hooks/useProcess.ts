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
            const filtered = res.data.filter((item: Process2) => item.isPlan === 1);
            setData(filtered);
        } catch (err) {
            setError("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    console.log(data)
    // const fetchData = async () => {
    //     const res = await fetch(`${url}/api/drawing-code-process`);
    //     const filtered = res.data.filter((item: any) => item.isPlan == 1);
    //     const result = await res.json();
    //     setData(result);
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    // return {
    //     data,
    //     refetch: fetchData,
    // };
    return { data, loading, error, refetch: fetchData };
}
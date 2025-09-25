import { useEffect, useState } from "react";
import axios from "axios";
import { TotalRunTime } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useMachineTotalRuntime(groupId: string, startDate: string, endDate: string) {
    const [data, setData] = useState<TotalRunTime | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // console.log(groupId, startDate, endDate)
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${url}/api/machine-group-statistic/totalTime`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupId, startDate, endDate }),
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("Lỗi mạng hoặc server");
                const json = await res.json();
                setData(json);
                setError(null);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Lỗi khi tải dữ liệu");
                }
            } finally {
                setLoading(false);
            }
        };

        if (groupId && startDate && endDate) fetchData();
        return () => controller.abort();
    }, [groupId, startDate, endDate]);

    return { data, loading, error };
}
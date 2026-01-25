import { useEffect, useState } from "react";
import axios from "axios";
import { MachineStatisticDetail } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useMachineStatisticDetail(id: number, startDate: string, endDate: string, shiftCode: string) {
    const [data, setData] = useState<MachineStatisticDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log("Fetching machine overview data with params1:", {
                    startDate,
                    endDate,
                    shiftCode,
                    id
                });
                const res = await fetch(`${url}/api/machine-detail/statistic`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, startDate, endDate, shiftCode }),
                    // body: JSON.stringify({ id: 3, startDate: "2025-07-01", endDate: "2025-07-31" }),
                    signal: controller.signal,
                });
                console.log(res.json);
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

        if (id && startDate && endDate) fetchData();
        return () => controller.abort();
    }, [id, startDate, endDate, shiftCode]);
    return { data, loading, error };
}
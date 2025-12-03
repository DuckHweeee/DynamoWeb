import { useEffect, useState } from "react";
import axios from "axios";
import { TotalRunTime } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useMachineTotalRuntime(groupId: string, startDate: string, endDate: string) {
    const [data, setData] = useState<TotalRunTime | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post(`${url}/api/machine-group-statistic/totalTime`, {
                    groupId,
                    startDate,
                    endDate
                }, {
                    signal: controller.signal
                });
                setData(response.data);
            } catch (err: any) {
                if (err.name !== "AbortError" && !axios.isCancel(err)) {
                    console.error("Error fetching total runtime data:", err);
                    if (axios.isAxiosError(err)) {
                        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu từ server");
                    } else {
                        setError("Lỗi khi tải dữ liệu");
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        if (groupId && startDate && endDate) fetchData();
        return () => controller.abort();
    }, [groupId, startDate, endDate]);

    const refetch = () => {
        if (groupId && startDate && endDate) {
            const controller = new AbortController();
            const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.post(`${url}/api/machine-group-statistic/totalTime`, {
                        groupId,
                        startDate,
                        endDate
                    });
                    setData(response.data);
                } catch (err: any) {
                    console.error("Error fetching total runtime data:", err);
                    if (axios.isAxiosError(err)) {
                        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu từ server");
                    } else {
                        setError("Lỗi khi tải dữ liệu");
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    };

    return { data, loading, error, refetch };
}
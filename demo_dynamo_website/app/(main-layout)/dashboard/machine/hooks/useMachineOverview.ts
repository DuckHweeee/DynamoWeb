import { useEffect, useState } from "react";
import { MachineOverview } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useMachineOverview(groupId: string, startDate: string, endDate: string) {
    const [data, setData] = useState<MachineOverview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${url}/api/machine-group-statistic/overview`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        groupId: groupId,
                        startDate: startDate,
                        endDate: endDate,
                    }),
                });

                if (!res.ok) {
                    throw new Error("Lỗi mạng hoặc server");
                }

                const json: MachineOverview[] = await res.json();
                setData(json);
                setError(null);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        if (groupId && startDate && endDate) {
            fetchData();
        }
    }, [groupId, startDate, endDate]);
    return { data, loading, error };
}

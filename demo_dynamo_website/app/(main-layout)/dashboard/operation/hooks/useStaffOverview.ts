
import { useEffect, useState } from "react";
import { StaffOverview } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useStaffOverview(groupId: string, startDate: string, endDate: string) {
    const [data, setData] = useState<StaffOverview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // console.log("useStaffOverview called with:", { groupId, startDate, endDate });
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${url}/api/staff-group-statistic/overview`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        // endDate: "2025-07-26",
                        // groupId: "894727a1-a574-456a-87d8-bfee92dc722c",
                        // startDate: "2025-07-21"
                        groupId: groupId,
                        startDate: startDate,
                        endDate: endDate,
                    }),
                });

                if (!res.ok) {
                    throw new Error("Lỗi mạng hoặc server");
                }

                const json: StaffOverview[] = await res.json();
                console.log("Fetched Staff Overview Data:", json);
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
    // console.log("Staff Overview Data:", data);
    return { data, loading, error };
}

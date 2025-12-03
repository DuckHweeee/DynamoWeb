import { useEffect, useState } from "react";
import { MachineStatusType } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useMachineStatus(groupId: string) {
    const [data, setData] = useState<MachineStatusType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${url}/api/current-status/by-group/${groupId}`, {
                    // const res = await fetch(`${url}/api/current-status/by-group/5be037a1-7a84-4b74-8ae7-24fc22a6a549`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("Lỗi mạng hoặc server");
                }

                const json: MachineStatusType[] = await res.json();
                setData(json);
                setError(null);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            fetchData();
        }
    }, [groupId]);
    // console.log(data)
    return { data, loading, error };
}

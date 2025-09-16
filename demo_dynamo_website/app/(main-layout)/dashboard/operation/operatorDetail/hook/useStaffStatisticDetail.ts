import { useEffect, useState } from "react";
import { StaffStatistic } from "../../lib/type";
const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useStaffStatisticWorking(id: number, startDate: string, endDate: string) {
    const [data, setData] = useState<StaffStatistic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${url}/api/staff-detail/statistic`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, startDate, endDate }),
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

        if (id && startDate && endDate) fetchData();
        return () => controller.abort();
    }, [id, startDate, endDate]);

    return { data, loading, error };
}

export function useStaffStatisticWorkingDetail(groupId: string, id: number, startDate: string, endDate: string) {
    const [data, setData] = useState<StaffStatistic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${url}/api/staff-detail/working-statistic`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupId, id, startDate, endDate }),
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

        if (id && groupId && startDate && endDate) fetchData();
        return () => controller.abort();
    }, [id, groupId, startDate, endDate]);

    return { data, loading, error };
}


export function useStaffStatisticWorkingDefault(groupId: string, startDate: string, endDate: string) {
    const [data, setData] = useState<StaffStatistic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${url}/api/staff-detail/detail`, {
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


export function useStaffStatisticHistoryProcess(id: number, startDate: string, endDate: string) {
    const [data, setData] = useState<StaffStatistic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${url}/api/staff-detail/history`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, startDate, endDate }),
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

        if (id && startDate && endDate) fetchData();
        return () => controller.abort();
    }, [id, startDate, endDate]);

    return { data, loading, error };
}
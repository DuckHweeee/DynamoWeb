import { DrawingCodeProcessHistory } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { getStartOfDayVN } from "./getTodayRangeVN";
import { getEndOfDayVN } from "./getTodayRangeVN";
import { endOfDay } from "date-fns";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useMachineProcessHistory(machineId: string | null, startDate: string | null, endDate: string | null) {
    const [data, setData] = useState<DrawingCodeProcessHistory[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                let apiUrl = `${url}/api/drawing-code-process/machine`
                const params = new URLSearchParams()

                if (machineId) {
                    params.append('machine_id', machineId)
                }

                if (startDate != null && endDate != null) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    const startTimestamp = getStartOfDayVN(start);
                    const endTimestamp = getEndOfDayVN(end);
                    console.log(startTimestamp)
                    console.log(endTimestamp)
                    params.append('start', startTimestamp.toString())
                    params.append('stop', endTimestamp.toString())
                } else {
                    const now = new Date();
                    const startTimestamp = getStartOfDayVN(now);
                    const endTimestamp = getEndOfDayVN(now);
                    console.log(startTimestamp)
                    console.log(endTimestamp)
                    params.append("start", new Date(startTimestamp).getTime().toString());
                    params.append("stop", new Date(endTimestamp).getTime().toString());
                }


                if (params.toString()) {
                    apiUrl += `?${params.toString()}`
                }

                const res = await axios.get<DrawingCodeProcessHistory[]>(apiUrl);
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải dữ liệu lịch sử quy trình máy")
                console.error("Error fetching machine process history:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [machineId, startDate, endDate])

    return {
        data, loading, error, refetch: () => {
            const fetchData = async () => {
                try {
                    setLoading(true)
                    setError(null)

                    let apiUrl = `${url}/api/drawing-code-process/machine`
                    const params = new URLSearchParams()

                    if (machineId) {
                        params.append('machine_id', machineId)
                    }

                    if (startDate && endDate) {
                        const startTimestamp = new Date(startDate).getTime()
                        const endTimestamp = new Date(endDate).getTime()
                        params.append('start', startTimestamp.toString())
                        params.append('stop', endTimestamp.toString())
                    }

                    if (params.toString()) {
                        apiUrl += `?${params.toString()}`
                    }

                    const res = await axios.get<DrawingCodeProcessHistory[]>(apiUrl);
                    setData(res.data)
                } catch (err) {
                    setError("Lỗi khi tải dữ liệu lịch sử quy trình máy")
                } finally {
                    setLoading(false)
                }
            }
            fetchData()
        }
    }
}

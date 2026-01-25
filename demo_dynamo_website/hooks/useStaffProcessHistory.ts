import { DrawingCodeProcessHistory } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { getEndOfDayVN, getStartOfDayVN } from "./getTodayRangeVN";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useStaffProcessHistory(id: string | null, startDate: string | null, endDate: string | null) {
    const [data, setData] = useState<DrawingCodeProcessHistory[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        if (!id) {
            setData([])
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)


                var startTimestamp = 0;
                var endTimestamp = 0;

                if (startDate != null && endDate != null) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    startTimestamp = getStartOfDayVN(start);
                    endTimestamp = getEndOfDayVN(end);
                    console.log(startTimestamp)
                    console.log(endTimestamp)

                } else {
                    const now = new Date();
                    startTimestamp = getStartOfDayVN(now);
                    endTimestamp = getEndOfDayVN(now);
                    console.log(startTimestamp)
                    console.log(endTimestamp)
                }

                const res = await axios.get<DrawingCodeProcessHistory[]>(
                    `${url}/api/drawing-code-process/staff?staff_id=${id}&start=${startTimestamp}&stop=${endTimestamp}`
                );

                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải dữ liệu lịch sử quy trình")
                console.error("Error fetching drawing code process history:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, startDate, endDate])

    return {
        data, loading, error, refetch: () => {
            if (id) {
                const fetchData = async () => {
                    try {
                        setLoading(true)
                        setError(null)

                        const startTimestamp = startDate ? new Date(startDate).getTime() : 0
                        const endTimestamp = endDate ? new Date(endDate).getTime() : 0

                        const res = await axios.get<DrawingCodeProcessHistory[]>(
                            `${url}/api/drawing-code-process/staff?staff_id=${id}&start=${startTimestamp}&stop=${endTimestamp}`
                        );
                        setData(res.data)
                    } catch (err) {
                        setError("Lỗi khi tải dữ liệu lịch sử quy trình")
                    } finally {
                        setLoading(false)
                    }
                }
                fetchData()
            }
        }
    }
}

import { DrawingCodeProcessHistory } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useStaffProcessHistory(id: string | null, startDate: string | null, endDate: string | null) {
    const [data, setData] = useState<DrawingCodeProcessHistory[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // console.log("useStaffProcessHistory hook called with:", { id, startDate, endDate })
        // console.log("ID type:", typeof id, "ID value:", id)

        if (!id) {
            setData([])
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Use provided dates or default to 0 (no filter)
                const startTimestamp = startDate ? new Date(startDate).getTime() : 0
                const endTimestamp = endDate ? new Date(endDate).getTime() : 0

                // console.log("Fetching staff process history:", { id, startTimestamp, endTimestamp })

                const res = await axios.get<DrawingCodeProcessHistory[]>(
                    `${url}/api/drawing-code-process/staff?staff_id=${id}&start=${startTimestamp}&stop=${endTimestamp}`
                );

                // console.log("Staff process history response:", res.data)
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

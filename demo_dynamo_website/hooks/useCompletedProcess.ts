import { DrawingCodeProcessHistory } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { start } from "repl";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useCompletedProcess(start?: number, stop?: number) {
    const [data, setData] = useState<DrawingCodeProcessHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async (s?: number, e?: number) => {    
        try {
            setLoading(true)
            setError(null)

            const res = await axios.get<DrawingCodeProcessHistory[]>(
                `${url}/api/drawing-code-process/completed`,
                {
                    params: {
                        start: s,
                        stop: e,
                    },
                }
            )

            setData(res.data)
        } catch (err) {
            setError("Lỗi khi tải dữ liệu lịch sử quy trình hoàn thành.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (start != undefined && stop!=undefined) {
            fetchData(start, stop)
        }
    }, [start, stop])

    return { data, loading, error, refetch: fetchData }
}

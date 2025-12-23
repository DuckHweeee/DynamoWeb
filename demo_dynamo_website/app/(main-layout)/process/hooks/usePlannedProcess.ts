
import axios from "axios";
import { useEffect, useState } from "react";
import { Process } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function usePlannedProcess(pageSize = 10) {
    const [data, setData] = useState<any[]>([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)
    

    const fetchData = async (pageIndex = page) => {
        setLoading(true)
        try {
            const res = await axios.get(`${url}/api/drawing-code-process/planned`, {
                params: {
                    page: pageIndex,
                    size: pageSize,
                },
            })

            setData(res.data.content)
            setTotalPages(res.data.totalPages)
            setPage(res.data.number)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(0)
    }, [])

    return {
        data,
        page,
        totalPages,
        loading,
        nextPage: () => {
            if (page + 1 < totalPages) fetchData(page + 1)
        },
        prevPage: () => {
            if (page > 0) fetchData(page - 1)
        },
        refetch: fetchData,
    }
}
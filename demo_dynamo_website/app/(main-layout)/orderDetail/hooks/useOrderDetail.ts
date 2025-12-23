import axios from "axios";
import { useEffect, useState } from "react";
import { OrderDetail } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useOrderDetail(pageSize = 10) {
    const [data, setData] = useState<OrderDetail[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchData = async (pageIndex = page) => {
        setLoading(true);
        const res = await axios.get(`${url}/api/order-detail`, {
            params: {
                page: pageIndex,
                size: pageSize,
            },
        });

        setData(res.data.content);
        setTotalPages(res.data.totalPages);
        setPage(res.data.number);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(0);
    }, []);

    return {
        data,
        page,
        totalPages,
        loading,
        nextPage: () => {
            if (page + 1 < totalPages) fetchData(page + 1);
        },
        prevPage: () => {
            if (page > 0) fetchData(page - 1);
        },
        setPage: fetchData,
        refetch: () => fetchData(page),
    };
}
import axios from "axios";
import { useEffect, useState } from "react";
import { OrderDetail } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useOrderDetail(pageSize = 8) {
    const [data, setData] = useState<OrderDetail[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");

    const fetchData = async (
        pageIndex = page,
        searchKeyword = keyword
    ) => {
        setLoading(true);

        const res = await axios.get(
            `${url}/api/order-detail`, // 🔥 gọi API search
            {
                params: {
                    keyword: searchKeyword || null,
                    page: pageIndex,
                    size: pageSize,
                },
            }
        );

        setData(res.data.content);
        setTotalPages(res.data.totalPages);
        setPage(res.data.number);
        setLoading(false);
    };

    // load lần đầu
    useEffect(() => {
        fetchData(0, "");
    }, []);

    return {
        data,
        page,
        totalPages,
        loading,

        // pagination
        nextPage: () => {
            if (page + 1 < totalPages) {
                fetchData(page + 1);
            }
        },

        prevPage: () => {
            if (page > 0) {
                fetchData(page - 1);
            }
        },

        // 🔥 dùng khi click page
        setPage: (pageIndex: number) => {
            fetchData(pageIndex);
        },

        // 🔥 dùng cho search
        search: (kw: string) => {
            setKeyword(kw);
            fetchData(0, kw); // reset page
        },

        refetch: () => fetchData(page),
    };
}

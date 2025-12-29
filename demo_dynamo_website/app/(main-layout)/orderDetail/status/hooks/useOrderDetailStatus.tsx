import { useEffect, useState } from "react";
import { ListOrderDetailStatusType } from "../lib/type";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useOrderDetailStatus(pageSize = 12) {
  const [data, setData] = useState<ListOrderDetailStatusType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [keyword, setKeyword] = useState("");

  const fetchData = async (pageIndex = page, searchKeyword = keyword) => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/order-detail/orderStatus`, {
        params: {
          keyword: searchKeyword || null,
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
    fetchData();
  }, []);

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
    setPage: (pageIndex: number) => {
      fetchData(pageIndex);
    },
    search: (kw: string) => {
      setKeyword(kw);
      fetchData(0, kw); // reset page
    },
    refetch: fetchData,
  }
}

import { useEffect, useState } from "react";
import { GroupKPI } from "../app/(main-layout)/group/kpi/lib/type";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useGroupKPI() {
    const [data, setData] = useState<GroupKPI[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<GroupKPI[]>(`${url}/api/groupKpi`)
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải dữ liệu Group KPI")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const refetch = async () => {
        setLoading(true)
        try {
            const res = await axios.get<GroupKPI[]>(`${url}/api/groupKpi`)
            setData(res.data)
            setError(null)
        } catch (err) {
            setError("Lỗi khi tải dữ liệu Group KPI")
        } finally {
            setLoading(false)
        }
    }

    return { data, loading, error, refetch }
}

export function useGroupKPIMutations() {
    const [loading, setLoading] = useState(false)

    const createGroupKPI = async (kpiData: any) => {
        setLoading(true)
        try {
            const response = await axios.post(`${url}/api/groupKpi`, kpiData)
            return response.data
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const updateGroupKPI = async (kpiId: number, kpiData: any) => {
        setLoading(true)
        try {
            const response = await axios.put(`${url}/api/groupKpi/${kpiId}`, kpiData)
            return response.data
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const deleteGroupKPI = async (kpiId: number) => {
        setLoading(true)
        try {
            await axios.delete(`${url}/api/groupKpi/${kpiId}`)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        createGroupKPI,
        updateGroupKPI,
        deleteGroupKPI,
        loading
    }
}

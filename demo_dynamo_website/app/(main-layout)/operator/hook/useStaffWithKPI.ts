import { useEffect, useState } from "react"
import axios from "axios"
import { Staff, StaffKPI, StaffWithKPI } from "@/lib/type"

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useStaffWithKPI() {
    const [data, setData] = useState<StaffWithKPI[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffRes, kpiRes] = await Promise.all([
                    axios.get<Staff[]>(`${url}/api/staff`),
                    axios.get<any[]>(`${url}/api/staff-kpi`)
                ])

                const staffList = staffRes.data
                const kpiList = kpiRes.data

                const merged: StaffWithKPI[] = staffList.map((staff) => {
                    const kpis = kpiList
                        .filter(kpi => kpi.staffId === staff.id)
                        .map((kpi): StaffKPI => ({
                            kpiId: kpi.kpiId,
                            year: kpi.year,
                            month: kpi.month,
                            pgTimeGoal: kpi.pgTimeGoal,
                            machineTimeGoal: kpi.machineTimeGoal,
                            manufacturingPoint: kpi.manufacturingPoint,
                            oleGoal: kpi.oleGoal,
                            workGoal: kpi.workGoal,
                            kpi: kpi.kpi,
                        }))

                    return {
                        ...staff,
                        staffKpiDtos: kpis.length > 0 ? kpis : null,
                    }
                })

                setData(merged)
            } catch (err) {
                console.error(err)
                setError("Lỗi khi tải dữ liệu nhân viên và KPI")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return { data, loading, error }
}

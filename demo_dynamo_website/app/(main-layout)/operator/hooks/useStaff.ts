import { useEffect, useState } from "react"
import axios from "axios"
import { Group, Staff } from "@/lib/type"

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export function useStaff() {
    const [data, setData] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Staff[]>(`${url}/api/staff`)
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải danh sách nhân viên")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    return { data, loading, error }
}

export function useGroup() {
    const [data, setData] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Group[]>(`${url}/api/group`)
                setData(res.data)
            } catch (err) {
                setError("Lỗi khi tải dữ liệu")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    return { data, loading, error }
}

// export function useStaffDetail(staffIdString: string) {
//     const [data, setData] = useState<Staff[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await axios.get<Staff[]>(`${url}/api/staff/${staffIdString}`)
//                 setData(res.data)
//             } catch (err) {
//                 setError("Lỗi khi tải thông tin")
//             } finally {
//                 setLoading(false)
//             }
//         }
//         fetchData()
//     }, [])
//     return { data, loading, error }
// }
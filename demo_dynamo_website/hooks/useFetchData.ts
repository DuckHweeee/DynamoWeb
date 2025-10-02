import { Machine2, Process, Process2, Staff } from "@/lib/type"
import { useEffect, useState } from "react"
import axios from "axios"

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

//Cần viết dạng này nhiều hơn (phát triển nếu kịp thời gian) 
export const useFetchProcesses = () => {
    const [data, setData] = useState<Process2[]>([]);

    const fetchData = async () => {
        const res = await fetch(`${url}/api/drawing-code-process`);
        const result = await res.json();
        setData(result);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        refetch: fetchData,
    };
};

// Chưa test
// export function useFetchMachines() {
//     const [machine, setMachine] = useState<Machine2[]>([])
//     useEffect(() => {
//         axios.get(`${url}/api/machine`)
//             .then((res) => setMachine(res.data))
//             .catch((err) => console.error("Error fetching machine:", err))
//     }, [])
//     return machine
// }
export function useFetchMachines() {
    const [data, setData] = useState<Machine2[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Machine2[]>(`${url}/api/machine`);
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




// Chưa test
// export function useFetchOperators() {
//     const [operator, setOperator] = useState<Staff[]>([])
//     useEffect(() => {
//         axios.get(`${url}/api/staff`)
//             .then((res) => setOperator(res.data))
//             .catch((err) => console.error("Error fetching operator:", err))
//     }, [])
//     // console.log(operator)
//     return operator
// }
export function useFetchOperators() {
    const [data, setData] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<Staff[]>(`${url}/api/staff`);
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
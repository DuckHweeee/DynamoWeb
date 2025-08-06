import { Machine2, Process, Process2, Staff } from "@/lib/type"
import { useEffect, useState } from "react"
import axios from "axios"

// const url = "http://10.70.166.119:8080";
const url = process.env.NEXT_PUBLIC_BACKEND_URL;

// export function useFetchProcesses() {
//     const [processes, setProcesses] = useState<Process2[]>([])
//     useEffect(() => {
//         axios.get(`${url}/api/drawing-code-process`)
//             .then((res) => setProcesses(res.data))
//             .catch((err) => console.error("Error fetching processes:", err))
//     }, [])
//     return processes
// }
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

// Cần viết lại cái này
export function useFetchMachines() {
    const [machine, setMachine] = useState<Machine2[]>([])
    useEffect(() => {
        axios.get(`${url}/api/machine`)
            .then((res) => setMachine(res.data))
            .catch((err) => console.error("Error fetching machine:", err))
    }, [])
    return machine
}

export function useFetchOperators() {
    const [operator, setOperator] = useState<Staff[]>([])
    useEffect(() => {
        axios.get(`${url}/api/staff`)
            .then((res) => setOperator(res.data))
            .catch((err) => console.error("Error fetching operator:", err))
    }, [])
    return operator
}
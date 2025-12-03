import { useEffect, useState } from "react";
import axios from "axios";
import { MachineOverview } from "../lib/type";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useMachineOverview(groupId: string, startDate: string, endDate: string) {
    const [data, setData] = useState<MachineOverview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log("Fetching machine overview data with params:", {
                groupId,
                startDate,
                endDate
            });

            const response = await axios.post(`${url}/api/machine-group-statistic/overview`, {
                groupId: groupId,
                startDate: startDate,
                endDate: endDate,
            });

            console.log("Machine overview API response:", response.data);

            // Ensure the response data is an array
            const machineOverviewData: MachineOverview[] = Array.isArray(response.data) 
                ? response.data 
                : [];

            setData(machineOverviewData);
            setError(null);
        } catch (err) {
            console.error("Machine overview fetch error:", err);
            
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || err.message || "Lỗi khi tải dữ liệu máy móc";
                setError(errorMessage);
            } else {
                setError("Lỗi khi tải dữ liệu máy móc");
            }
            
            setData([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (groupId && startDate && endDate) {
            fetchData();
        } else {
            // Reset data when parameters are missing
            setData([]);
            setLoading(false);
            setError(null);
        }
    }, [groupId, startDate, endDate]);
    const refetch = () => {
        if (groupId && startDate && endDate) {
            fetchData();
        }
    };

    return { data, loading, error, refetch };
}

import { useEffect, useState } from "react";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface MachineStatistic {
    machineId: number;
    machineName: string;
    runTime: number;
    stopTime: number;
    pgTime: number;
    offsetTime: number;
    spanTime: number;
    pgTimeExpected: number;
    numberOfProcesses: number;
}

export interface MachineStatisticsRequest {
    groupId: string;
    startDate: string;
    endDate: string;
}

export function useMachineStatistics(groupId: string, startDate: string, endDate: string) {
    const [data, setData] = useState<MachineStatistic[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Only fetch if all required parameters are provided
            if (!groupId || !startDate || !endDate) {
                setData([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const requestBody: MachineStatisticsRequest = {
                    groupId,
                    startDate,
                    endDate
                };

                const response = await axios.post<MachineStatistic[]>(
                    `${url}/api/machine-group-statistic/overview`,
                    requestBody
                );

                setData(response.data);
            } catch (err) {
                setError("Lỗi khi tải thống kê máy móc");
                console.error("Error fetching machine statistics:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [groupId, startDate, endDate]);

    return { data, loading, error };
}
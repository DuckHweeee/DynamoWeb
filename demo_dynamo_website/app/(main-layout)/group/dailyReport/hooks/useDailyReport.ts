import { useState, useEffect } from 'react';
import axios from 'axios';
import { DailyReport } from '@/lib/type';

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useDailyReport() {
    const [data, setData] = useState<DailyReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDailyReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${url}/api/report`);
            setData(response.data);
        } catch (err) {
            console.error('Error fetching daily report data:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'An error occurred while fetching data');
            } else {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDailyReports();
    }, []);

    const refetch = () => {
        fetchDailyReports();
    };

    return { data, loading, error, refetch };
}

export function useDailyReportMutations() {
    const createDailyReport = async (reportData: Omit<DailyReport, 'id' | 'createdDate'>) => {
        try {
            const response = await axios.post(`${url}/api/report`, reportData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create daily report');
            }
            throw new Error('Failed to create daily report');
        }
    };

    const updateDailyReport = async (id: number, reportData: Partial<DailyReport>) => {
        try {
            const response = await axios.put(`${url}/api/report/${id}`, reportData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update daily report');
            }
            throw new Error('Failed to update daily report');
        }
    };

    const deleteDailyReport = async (id: number) => {
        try {
            const response = await axios.delete(`${url}/api/report/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to delete daily report');
            }
            throw new Error('Failed to delete daily report');
        }
    };

    return {
        createDailyReport,
        updateDailyReport,
        deleteDailyReport,
    };
}
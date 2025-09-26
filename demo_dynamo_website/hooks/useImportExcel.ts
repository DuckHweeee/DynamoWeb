import { useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useImportExcel(endpoint: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const importExcel = async (file: File) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${url}/api/${endpoint}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Lỗi khi import file Excel");
                } catch (jsonError) {
                    throw new Error(`${response.status} ${response.statusText || "Lỗi khi import file Excel"}`);
                }
            }

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                return result;
            } else {
                return { success: true, message: "Import file Excel thành công!" };
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { importExcel, loading, error };
}
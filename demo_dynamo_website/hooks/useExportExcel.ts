import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const downloadFileDefault = (blob: Blob, filename: string) => {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
};

export function useExportExcel(endpoint: string | undefined, groupId: string | undefined, groupName: string | undefined, startDate: string | undefined, endDate: string | undefined) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportExcel = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${url}/api/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groupId,
                    startDate,
                    endDate
                }),
            });

            if (!response.ok) {
                throw new Error("Lỗi khi xuất file Excel");
            }

            const blob = await response.blob();

            const filename = `Thống kê nhóm máy_${groupName}_${startDate}_${endDate}.xlsx`;

            if ('showSaveFilePicker' in window) {
                try {
                    const fileHandle = await (window as any).showSaveFilePicker({
                        suggestedName: filename,
                        types: [{
                            description: 'Excel files',
                            accept: {
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
                            }
                        }]
                    });

                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                } catch (err: any) {
                    if (err.name !== 'AbortError') {
                        console.error('Save file error:', err);
                        downloadFileDefault(blob, filename);
                    }
                }
            } else {
                downloadFileDefault(blob, filename);
            }

        } catch (err: any) {
            console.error("Export Excel error:", err);
            setError(err.message || "Lỗi khi xuất file Excel");
        } finally {
            setLoading(false);
        }
    };

    return {
        exportExcel,
        loading,
        error
    };
}
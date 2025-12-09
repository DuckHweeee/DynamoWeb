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
      formData.append("file", file);

      const response = await fetch(`${url}/api/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      // ❌ Khi response không ok
      if (!response.ok) {
        let backendMessage = "Lỗi khi import file Excel";

        // Trường hợp backend trả JSON
        try {
          const errorData = await response.json();
          backendMessage = errorData.message || backendMessage;
        } catch {
          // Trường hợp backend không trả JSON
        }

        throw new Error(backendMessage);
      }

      // Nếu trả JSON
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        return result;
      }

      // Nếu không trả JSON
      return { success: true, message: "Import file Excel thành công!" };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi không xác định";
      setError(errorMessage);
      throw err; // để component bên ngoài có thể catch
    } finally {
      setLoading(false);
    }
  };

  return { importExcel, loading, error };
}

// import { useEffect, useState } from "react";
// import { OrderDetailStatusType } from "../lib/type";

// const url = process.env.NEXT_PUBLIC_BACKEND_URL;

// export function useOperatorStatus(groupId: string) {
//     const [data, setData] = useState<OperatorStatusType[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     useEffect(() => {  
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const res = await fetch(`${url}/api/current-status/staff/by-group/${groupId}`, {
//                     // const res = await fetch(`${url}/api/current-status/by-group/e714446b-a893-4549-ae81-100e95801f0b`, {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (!res.ok) {
//                     throw new Error("Lỗi mạng hoặc server");
//                 }

//                 const json: OperatorStatusType[] = await res.json();
//                 setData(json);
//                 setError(null);
//             } catch (err) {
//                 console.error("Fetch error:", err);
//                 setError("Lỗi khi tải dữ liệu");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (groupId) {
//             fetchData();
//         }
//     }, [groupId]);
//     return { data, loading, error };
// }

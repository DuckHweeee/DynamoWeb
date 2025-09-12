"use client"

import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroups } from "@/hooks/useGroup";
import { ReportTimeOperatorDetail } from "./components/ReportTimeOperatorDetail";
import { BarChartOperatorDetail } from "./components/BarChartOperatorDetail";
import TableOperatorDetail from "./components/TableOperatorDetail";
import DateRangeSelector from "../../components/DateRangeSelector";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DateRangeSelectorDetail from "./components/DateRangeSelectorDetail";

// Interface cho props (nếu muốn override behavior)
interface OperationDetailProps {
    allowDateChange?: boolean;
    allowGroupChange?: boolean;
    allowStaffChange?: boolean;
}

interface myStaff {
    staffFullName: string;
    staffId: string;
}

const myDataStaff: myStaff[] = [
    { staffFullName: "Nguyễn Văn Lợi", staffId: "S400" },
    { staffFullName: "Lê Văn Đức", staffId: "S700" },
    { staffFullName: "Đoàn Thi Trang", staffId: "S500" },
    { staffFullName: "Nguyễn Huy", staffId: "S650" },
    { staffFullName: "Nguyễn Thị Lan", staffId: "S550" },
];

export default function OperationDetail() {
    const searchParams = useSearchParams();

    // Lấy giá trị từ URL
    const startDateFromUrl = searchParams.get("startDate") || "";
    const endDateFromUrl = searchParams.get("endDate") || "";
    const groupIdFromUrl = searchParams.get("groupId") || "";
    const staffIdFromUrl = searchParams.get("staffId") || "";

    const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
    const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
    const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
    const [selectedStaff, setSelectedStaff] = useState<string>(staffIdFromUrl);
    console.log("StartDate:", startDateFromUrl);
    console.log("endDate:", endDateFromUrl);
    // Sync từ URL
    useEffect(() => {
        setSelectedStartDate(startDateFromUrl);
        setSelectedEndDate(endDateFromUrl);
        setSelectedGroup(groupIdFromUrl);
        setSelectedStaff(staffIdFromUrl);
    }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, staffIdFromUrl]);

    const queryParams = useMemo(() => {
        if (!selectedGroup || !selectedStartDate || !selectedEndDate) return null;
        return {
            group: selectedGroup,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
        };
    }, [selectedGroup, selectedStartDate, selectedEndDate]);

    // API staff list (mock data hiện tại)
    const staffList = myDataStaff;

    const { data: groupList = [] } = useGroups();

    const selectedStaffName = staffList?.find((st) => String(st.staffId) === selectedStaff)?.staffFullName;
    const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

    return (
        <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow">
            {/* Vùng chọn ngày và nhóm */}
            <div className="flex flex-wrap items-center justify-end mb-4">
                <div className="flex flex-wrap gap-4 items-center">

                    <DateRangeSelectorDetail
                        startDate={selectedStartDate}
                        endDate={selectedEndDate}
                        onChange={({ startDate, endDate }) => {
                            setSelectedStartDate(startDate);
                            setSelectedEndDate(endDate);
                        }}
                    />

                    <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
                        <SelectTrigger className="w-[180px] text-xl bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                            <SelectValue placeholder="Nhóm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {groupList.map((m) => (
                                    <SelectItem className="text-xl text-blue-950" key={m.groupId} value={String(m.groupId)}>
                                        {m.groupName}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Chọn nhân viên */}
            <div className="flex flex-row items-center justify-between mt-2">
                <p className="text-3xl font-semibold">Thống kê vận hành chi tiết</p>
                <Select value={selectedStaff} onValueChange={(val) => setSelectedStaff(val)}>
                    <SelectTrigger className="w-fit text-xl px-4 !py-5.5 rounded-md transition">
                        <SelectValue placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}>
                            {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {staffList?.map((st) => (
                                <SelectItem className="text-xl text-blue-950" key={st.staffId} value={String(st.staffId)}>
                                    {st.staffFullName}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Các component con */}
            <ReportTimeOperatorDetail />
            <BarChartOperatorDetail
                title="Tổng Thời Gian Thực PG Của Từng Máy Trong Nhóm (Giờ)"
                description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu"
            />
            <TableOperatorDetail title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" />
        </div>
    );
}











// "use client"

// import { Calendar } from "lucide-react";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useGroups } from "@/hooks/useGroup";
// import { ReportTimeOperatorDetail } from "./components/ReportTimeOperatorDetail";
// import { BarChartOperatorDetail } from "./components/BarChartOperatorDetail";
// import TableOperatorDetail from "./components/TableOperatorDetail";
// import DateRangeSelector from "../../components/DateRangeSelector";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";

// // Interface cho props (nếu muốn override behavior)
// interface OperationDetailProps {
//     allowDateChange?: boolean;
//     allowGroupChange?: boolean;
//     allowStaffChange?: boolean;
// }

// interface myStaff {
//     staffFullName: string;
//     staffId: string;
// }

// const myDataStaff: myStaff[] = [
//     { staffFullName: "Nguyễn Văn Lợi", staffId: "S400" },
//     { staffFullName: "Lê Văn Đức", staffId: "S700" },
//     { staffFullName: "Đoàn Thi Trang", staffId: "S500" },
//     { staffFullName: "Nguyễn Huy", staffId: "S650" },
//     { staffFullName: "Nguyễn Thị Lan", staffId: "S550" },
// ];

// export default function OperationDetail({
//     allowDateChange = false,
//     allowGroupChange = false,
//     allowStaffChange = false,
// }: OperationDetailProps) {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const pathname = usePathname();

//     // Lấy giá trị từ URL
//     const startDateFromUrl = searchParams.get("startDate") || "";
//     const endDateFromUrl = searchParams.get("endDate") || "";
//     const groupIdFromUrl = searchParams.get("groupId") || "";
//     const staffIdFromUrl = searchParams.get("staffId") || "";

//     const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
//     const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
//     const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
//     const [selectedStaff, setSelectedStaff] = useState<string>(staffIdFromUrl);

//     // Function to update URL parameters
//     const updateUrlParams = (params: Record<string, string>) => {
//         const newSearchParams = new URLSearchParams(searchParams.toString());

//         Object.entries(params).forEach(([key, value]) => {
//             if (value) {
//                 newSearchParams.set(key, value);
//             } else {
//                 newSearchParams.delete(key);
//             }
//         });

//         router.push(`${pathname}?${newSearchParams.toString()}`);
//     };

//     useEffect(() => {
//         setSelectedStartDate(startDateFromUrl);
//         setSelectedEndDate(endDateFromUrl);
//         setSelectedGroup(groupIdFromUrl);
//         setSelectedStaff(staffIdFromUrl);
//     }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, staffIdFromUrl]);

//     const queryParams = useMemo(() => {
//         if (!selectedGroup || !selectedStartDate || !selectedEndDate) return null;
//         return {
//             group: selectedGroup,
//             startDate: selectedStartDate,
//             endDate: selectedEndDate,
//         };
//     }, [selectedGroup, selectedStartDate, selectedEndDate]);

//     // API staff list (mock data hiện tại)
//     const staffList = myDataStaff;

//     const { data: groupList = [] } = useGroups();

//     const selectedStaffName = staffList?.find((st) => String(st.staffId) === selectedStaff)?.staffFullName;
//     const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

//     // Handlers for updating state and URL
//     const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
//         setSelectedStartDate(startDate);
//         setSelectedEndDate(endDate);
//         updateUrlParams({
//             startDate,
//             endDate,
//             groupId: selectedGroup,
//             staffId: selectedStaff,
//         });
//     };

//     const handleGroupChange = (groupId: string) => {
//         setSelectedGroup(groupId);
//         updateUrlParams({
//             startDate: selectedStartDate,
//             endDate: selectedEndDate,
//             groupId,
//             staffId: selectedStaff,
//         });
//     };

//     const handleStaffChange = (staffId: string) => {
//         setSelectedStaff(staffId);
//         updateUrlParams({
//             startDate: selectedStartDate,
//             endDate: selectedEndDate,
//             groupId: selectedGroup,
//             staffId,
//         });
//     };

//     return (
//         <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow">
//             {/* Vùng chọn ngày và nhóm */}
//             <div className="flex flex-wrap items-center justify-end mb-4">
//                 <div className="flex flex-wrap gap-4 items-center">
//                     {allowDateChange ? (
//                         <DateRangeSelector
//                             initialStartDate={selectedStartDate}
//                             initialEndDate={selectedEndDate}
//                             onChange={handleDateChange}
//                         />
//                     ) : (
//                         <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
//                             <Calendar className="w-4 h-4" />
//                             <span className="text-sm">
//                                 {selectedStartDate && selectedEndDate
//                                     ? `${selectedStartDate} - ${selectedEndDate}`
//                                     : "Chưa chọn ngày"}
//                             </span>
//                         </div>
//                     )}

//                     {allowGroupChange ? (
//                         <Select value={selectedGroup ?? ""} onValueChange={handleGroupChange}>
//                             <SelectTrigger className="w-[180px] text-xl bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
//                                 <SelectValue placeholder="Nhóm" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     {groupList.map((m) => (
//                                         <SelectItem className="text-xl text-blue-950" key={m.groupId} value={String(m.groupId)}>
//                                             {m.groupName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     ) : (
//                         <div className="px-4 py-2 bg-[#004799] text-white rounded-md">
//                             {selectedGroupName || "Nhóm không xác định"}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Chọn nhân viên */}
//             <div className="flex flex-row items-center justify-between mt-2">
//                 <p className="text-3xl font-semibold">Thống kê vận hành chi tiết</p>

//                 {allowStaffChange ? (
//                     <Select value={selectedStaff} onValueChange={handleStaffChange}>
//                         <SelectTrigger className="w-fit text-xl px-4 !py-5.5 rounded-md transition">
//                             <SelectValue placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}>
//                                 {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
//                             </SelectValue>
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectGroup>
//                                 {staffList?.map((st) => (
//                                     <SelectItem className="text-xl text-blue-950" key={st.staffId} value={String(st.staffId)}>
//                                         {st.staffFullName}
//                                     </SelectItem>
//                                 ))}
//                             </SelectGroup>
//                         </SelectContent>
//                     </Select>
//                 ) : (
//                     <div className="px-4 py-2 bg-gray-100 rounded-md">
//                         {selectedStaffName ? (
//                             <span className="text-xl font-medium text-[#074695]">{selectedStaffName}</span>
//                         ) : (
//                             <span className="text-xl">Tổng số: {staffList?.length || 0} nhân viên</span>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Các component con */}
//             <ReportTimeOperatorDetail />
//             <BarChartOperatorDetail
//                 title="Tổng Thời Gian Thực PG Của Từng Máy Trong Nhóm (Giờ)"
//                 description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu"
//             />
//             <TableOperatorDetail title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" />
//         </div>
//     );
// }
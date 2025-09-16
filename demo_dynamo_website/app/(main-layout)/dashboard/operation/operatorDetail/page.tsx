// "use client"
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useGroups } from "@/hooks/useGroup";
// import { ReportTimeOperatorDetail } from "./components/ReportTimeOperatorDetail";
// import { BarChartOperatorDetail } from "./components/BarChartOperatorDetail";
// import TableOperatorDetail from "./components/TableOperatorDetail";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import DateRangeSelectorDetail from "./components/DateRangeSelectorDetail";
// import { Button } from "@/components/ui/button";
// import { Download, UserRoundSearch, } from "lucide-react";
// import { useStaffStatisticWorking, useStaffStatisticWorkingDetail } from "./hook/useStaffStatisticDetail";
// import { id } from "date-fns/locale";
// import { ReportTimeOperator } from "./components/ReportTimeOperator";
// import DateRangeSelector from "./components/DateRangeSelector";
// import { StaffOverview, StaffStatistic } from "../lib/type";


// export default function OperationDetail() {
//     const searchParams = useSearchParams();
//     const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

//     // Lấy giá trị từ URL
//     const startDateFromUrl = searchParams.get("startDate") || "";
//     const endDateFromUrl = searchParams.get("endDate") || "";
//     const groupIdFromUrl = searchParams.get("groupId") || "";
//     const staffIdFromUrl = searchParams.get("staffId") || "";

//     const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
//     const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
//     const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
//     const [selectedStaff, setSelectedStaff] = useState<number>(Number(staffIdFromUrl));

//     // Sync từ URL
//     useEffect(() => {
//         setSelectedStartDate(startDateFromUrl);
//         setSelectedEndDate(endDateFromUrl);
//         setSelectedGroup(groupIdFromUrl);
//         setSelectedStaff(Number(staffIdFromUrl));
//     }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, staffIdFromUrl]);

//     const queryParams = useMemo(() => {
//         if (!selectedGroup || !selectedStartDate || !selectedEndDate) return null;
//         return {
//             group: selectedGroup,
//             startDate: selectedStartDate,
//             endDate: selectedEndDate,
//             id: selectedStaff,
//         };
//     }, [selectedGroup, selectedStartDate, selectedEndDate, selectedStaff]);

//     const { data: groupList = [] } = useGroups();
//     const { data: dataOverview } = useStaffStatisticWorking(
//         queryParams?.id ?? 0,
//         queryParams?.startDate ?? "",
//         queryParams?.endDate ?? ""
//     );
//     const { data: dataWorkingDetail } = useStaffStatisticWorkingDetail(
//         queryParams?.group ?? "",
//         queryParams?.id ?? 0,
//         queryParams?.startDate ?? "",
//         queryParams?.endDate ?? ""
//     );
//     const staffList = dataWorkingDetail?.staffDto;


//     const selectedStaffName = staffList?.find((st) => st.id === selectedStaff)?.staffName;
//     const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

//     const chartConfigs = [
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "manufacturingPointsGoal",
//             realKey: "manufacturingPoints",
//         },
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "pgTime",
//             realKey: "pgTimeGoal",
//         },
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "workingHours",
//             realKey: "workingHoursGoal",
//         },
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "ole",
//             realKey: "oleGoal",
//         },
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "kpiGoal",
//             realKey: "kpi",
//         },
//     ];
//     function transformData<T extends Record<string, StaffStatistic>>(staff: T, targetKey: keyof T, realKey: keyof T) {
//         if (!staff) {
//             return [];
//         }
//         if (Array.isArray(staff)) {
//             return staff.map((s) => ({
//                 target: s[targetKey],
//                 real: s[realKey],
//             }));
//         }
//         return [
//             {
//                 target: staff[targetKey],
//                 real: staff[realKey],
//             },
//         ];
//     }
//     return (
//         <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow">
//             <div className="">
//                 <div className="flex justify-between items-center mr-5">
//                     <p className="text-3xl font-semibold">Thống kê nhân viên vận hành</p>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-950 hover:bg-blue-650"
//                     >
//                         <Download className="h-4 w-4" />
//                     </Button>
//                 </div>
//                 <div className="flex flex-row py-3 gap-15 border-b justify-end">
//                     <DateRangeSelectorDetail
//                         startDate={selectedStartDate}
//                         endDate={selectedEndDate}
//                         onChange={({ startDate, endDate, timeType }) => {
//                             setSelectedStartDate(startDate);
//                             setSelectedEndDate(endDate);
//                             setSelectedTimeType(timeType);
//                         }}
//                     />
//                     <div className="space-y-1">
//                         <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label>
//                         <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
//                             <SelectTrigger className="w-[180px] text-lg ">
//                                 <SelectValue placeholder="Nhóm" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     {groupList.map((m) => (
//                                         <SelectItem className="text-lg text-blue-950" key={m.groupId} value={String(m.groupId)}>
//                                             {m.groupName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-1">
//                         <label className="text-sm font-medium text-gray-600 tracking-wide">Nhân hân viên</label>
//                         <Select value={String(selectedStaff)} onValueChange={(val) => setSelectedStaff(val ? Number(val) : 0)}>
//                             <SelectTrigger className="w-fit text-lg rounded-md transition">
//                                 <SelectValue placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}>
//                                     {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
//                                 </SelectValue>
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     {staffList?.map((st) => (
//                                         <SelectItem className="text-lg text-blue-950" key={st.id} value={String(st.id)}>
//                                             {st.staffName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div className="flex flex-col pt-6">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="cursor-pointer text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 h-9"
//                         >
//                             <UserRoundSearch className="h-4 w-4 mr-1" />
//                             Lọc nhân viên
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             {/* Các component con */}
//             {dataOverview && (
//                 <ReportTimeOperatorDetail type={selectedTimeType} data={dataOverview} />
//             )}

//             {/* <BarChartOperatorDetail
//                 title="Thống kê công việc người vận hành"
//                 description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu"
//             /> */}
//             {/* {chartConfigs.map((cfg, idx) => (
//                 <BarChartOperatorDetail
//                     key={idx}
//                     title={cfg.title}
//                     description={cfg.description}
//                     data={transformData(dataWorkingDetail, cfg.targetKey as keyof StaffOverview, cfg.realKey as keyof StaffOverview)}
//                 />
//             ))} */}
//             {chartConfigs.map((cfg, idx) => (
//                 <BarChartOperatorDetail
//                     key={idx}
//                     title={cfg.title}
//                     description={cfg.description}
//                     data={transformData(dataWorkingDetail, cfg.targetKey as keyof StaffStatistic, cfg.realKey as keyof StaffStatistic)}
//                 />
//             ))}
//             <TableOperatorDetail title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" />
//         </div>
//     );
// }






// Bản 2
// "use client"
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useGroups } from "@/hooks/useGroup";
// import { ReportTimeOperatorDetail } from "./components/ReportTimeOperatorDetail";
// import { BarChartOperatorDetail } from "./components/BarChartOperatorDetail";
// import TableOperatorDetail from "./components/TableOperatorDetail";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import DateRangeSelectorDetail from "./components/DateRangeSelectorDetail";
// import { Button } from "@/components/ui/button";
// import { Download, UserRoundSearch, } from "lucide-react";
// import { useStaffStatisticWorking, useStaffStatisticWorkingDetail } from "./hook/useStaffStatisticDetail";
// import { id } from "date-fns/locale";
// import { ReportTimeOperator } from "./components/ReportTimeOperator";
// import DateRangeSelector from "./components/DateRangeSelector";
// import { StaffOverview, StaffStatistic } from "../lib/type";


// export default function OperationDetail() {
//     const searchParams = useSearchParams();
//     const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

//     // Lấy giá trị từ URL
//     const startDateFromUrl = searchParams.get("startDate") || "";
//     const endDateFromUrl = searchParams.get("endDate") || "";
//     const groupIdFromUrl = searchParams.get("groupId") || "";
//     const staffIdFromUrl = searchParams.get("staffId") || "";

//     const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
//     const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
//     const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
//     const [selectedStaff, setSelectedStaff] = useState<number>(Number(staffIdFromUrl));

//     // Sync từ URL
//     useEffect(() => {
//         setSelectedStartDate(startDateFromUrl);
//         setSelectedEndDate(endDateFromUrl);
//         setSelectedGroup(groupIdFromUrl);
//         setSelectedStaff(Number(staffIdFromUrl));
//     }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, staffIdFromUrl]);

//     const queryParams = useMemo(() => {
//         if (!selectedGroup || !selectedStartDate || !selectedEndDate) return null;
//         return {
//             group: selectedGroup,
//             startDate: selectedStartDate,
//             endDate: selectedEndDate,
//             id: selectedStaff,
//         };
//     }, [selectedGroup, selectedStartDate, selectedEndDate, selectedStaff]);

//     const { data: groupList = [] } = useGroups();
//     const { data: dataOverview } = useStaffStatisticWorking(
//         queryParams?.id ?? 0,
//         queryParams?.startDate ?? "",
//         queryParams?.endDate ?? ""
//     );
//     const { data: dataWorkingDetail } = useStaffStatisticWorkingDetail(
//         queryParams?.group ?? "",
//         queryParams?.id ?? 0,
//         queryParams?.startDate ?? "",
//         queryParams?.endDate ?? ""
//     );
//     const staffList = dataWorkingDetail?.staffDto;


//     const selectedStaffName = staffList?.find((st) => st.id === selectedStaff)?.staffName;
//     const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

//     const chartConfigs = [
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",

//             targetKey: "manufacturingPointsGoal",
//             realKey: "manufacturingPoints",
//         },
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "pgTime",
//             realKey: "pgTimeGoal",
//         },
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "workingHours",
//             realKey: "workingHoursGoal",
//         },
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "ole",
//             realKey: "oleGoal",
//         },
//         {
//             title: "Thống kê công việc người vận hành",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "kpiGoal",
//             realKey: "kpi",
//         },
//     ];

//     // Fixed transformData function với null check và type-safe
//     function transformData(
//         staff: StaffStatistic | StaffStatistic[] | null,
//         targetKey: keyof StaffStatistic,
//         realKey: keyof StaffStatistic
//     ): { target: number; real: number }[] {
//         if (!staff) {
//             return [];
//         }

//         if (Array.isArray(staff)) {
//             return staff.map((s) => ({
//                 target: Number(s[targetKey]) || 0,
//                 real: Number(s[realKey]) || 0,
//             }));
//         }

//         return [
//             {
//                 target: Number(staff[targetKey]) || 0,
//                 real: Number(staff[realKey]) || 0,
//             },
//         ];
//     }

//     return (
//         <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow">
//             <div className="">
//                 <div className="flex justify-between items-center mr-5">
//                     <p className="text-3xl font-semibold">Thống kê nhân viên vận hành</p>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-950 hover:bg-blue-650"
//                     >
//                         <Download className="h-4 w-4" />
//                     </Button>
//                 </div>
//                 <div className="flex flex-row py-3 gap-15 border-b justify-end">
//                     <DateRangeSelectorDetail
//                         startDate={selectedStartDate}
//                         endDate={selectedEndDate}
//                         onChange={({ startDate, endDate, timeType }) => {
//                             setSelectedStartDate(startDate);
//                             setSelectedEndDate(endDate);
//                             setSelectedTimeType(timeType);
//                         }}
//                     />
//                     <div className="space-y-1">
//                         <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label>
//                         <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
//                             <SelectTrigger className="w-[180px] text-lg ">
//                                 <SelectValue placeholder="Nhóm" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     {groupList.map((m) => (
//                                         <SelectItem className="text-lg text-blue-950" key={m.groupId} value={String(m.groupId)}>
//                                             {m.groupName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-1">
//                         <label className="text-sm font-medium text-gray-600 tracking-wide">Nhân hân viên</label>
//                         <Select value={String(selectedStaff)} onValueChange={(val) => setSelectedStaff(val ? Number(val) : 0)}>
//                             <SelectTrigger className="w-fit text-lg rounded-md transition">
//                                 <SelectValue placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}>
//                                     {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
//                                 </SelectValue>
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     {staffList?.map((st) => (
//                                         <SelectItem className="text-lg text-blue-950" key={st.id} value={String(st.id)}>
//                                             {st.staffName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div className="flex flex-col pt-6">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="cursor-pointer text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 h-9"
//                         >
//                             <UserRoundSearch className="h-4 w-4 mr-1" />
//                             Lọc nhân viên
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             {/* Các component con */}
//             {dataOverview && (
//                 <ReportTimeOperatorDetail type={selectedTimeType} data={dataOverview} />
//             )}

//             {/* Render charts chỉ khi có data */}
//             {dataWorkingDetail && chartConfigs.map((cfg, idx) => (
//                 <BarChartOperatorDetail
//                     key={idx}
//                     title={cfg.title}
//                     description={cfg.description}
//                     data={transformData(dataWorkingDetail, cfg.targetKey as keyof StaffStatistic, cfg.realKey as keyof StaffStatistic)}
//                 />
//             ))}

//             <TableOperatorDetail title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" />
//         </div>
//     );
// }

// Bản 3
"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroups } from "@/hooks/useGroup";
import { ReportTimeOperatorDetail } from "./components/ReportTimeOperatorDetail";
import TableOperatorDetail from "./components/TableOperatorDetail";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DateRangeSelectorDetail from "./components/DateRangeSelectorDetail";
import { Button } from "@/components/ui/button";
import { Download, UserRoundSearch, } from "lucide-react";
import { useStaffStatisticWorking, useStaffStatisticWorkingDetail } from "./hook/useStaffStatisticDetail";
import { id } from "date-fns/locale";
import { ReportTimeOperator } from "./components/ReportTimeOperator";
import DateRangeSelector from "./components/DateRangeSelector";
import { StaffOverview, StaffStatistic } from "../lib/type";
import { BarChartOperatorDetail, } from "./components/BarChartOperatorDetail";


export default function OperationDetail() {
    const searchParams = useSearchParams();
    const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

    // Lấy giá trị từ URL
    const startDateFromUrl = searchParams.get("startDate") || "";
    const endDateFromUrl = searchParams.get("endDate") || "";
    const groupIdFromUrl = searchParams.get("groupId") || "";
    const staffIdFromUrl = searchParams.get("staffId") || "";

    const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
    const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
    const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
    const [selectedStaff, setSelectedStaff] = useState<number>(Number(staffIdFromUrl));

    // Sync từ URL
    useEffect(() => {
        setSelectedStartDate(startDateFromUrl);
        setSelectedEndDate(endDateFromUrl);
        setSelectedGroup(groupIdFromUrl);
        setSelectedStaff(Number(staffIdFromUrl));
    }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, staffIdFromUrl]);

    const queryParams = useMemo(() => {
        if (!selectedGroup || !selectedStartDate || !selectedEndDate) return null;
        return {
            group: selectedGroup,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            id: selectedStaff,
        };
    }, [selectedGroup, selectedStartDate, selectedEndDate, selectedStaff]);

    const { data: groupList = [] } = useGroups();
    const { data: dataOverview } = useStaffStatisticWorking(
        queryParams?.id ?? 0,
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );
    const { data: dataWorkingDetail } = useStaffStatisticWorkingDetail(
        queryParams?.group ?? "",
        queryParams?.id ?? 0,
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );
    const staffList = dataWorkingDetail?.staffDto;


    const selectedStaffName = staffList?.find((st) => st.id === selectedStaff)?.staffName;
    const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

    const chartConfigs = [
        {
            title: "Điểm sản xuất",
            description: "Điểm sản xuất thực tế so với mục tiêu",
            realKey: "manufacturingPoints" as keyof StaffStatistic,
            goalKey: "manufacturingPointsGoal" as keyof StaffStatistic,
            metricName: "Manufacturing Points",
        },
        {
            title: "Thời gian PG",
            description: "Thời gian PG thực tế so với mục tiêu",
            realKey: "pgTime" as keyof StaffStatistic,
            goalKey: "pgTimeGoal" as keyof StaffStatistic,
            metricName: "PG Time",
        },
        {
            title: "Giờ làm việc",
            description: "Giờ làm việc thực tế so với mục tiêu",
            realKey: "workingHours" as keyof StaffStatistic,
            goalKey: "workingHoursGoal" as keyof StaffStatistic,
            metricName: "Working Hours",
        },
        {
            title: "OLE",
            description: "OLE thực tế so với mục tiêu",
            realKey: "ole" as keyof StaffStatistic,
            goalKey: "oleGoal" as keyof StaffStatistic,
            metricName: "OLE",
        },
        {
            title: "KPI",
            description: "KPI thực tế so với mục tiêu",
            realKey: "kpi" as keyof StaffStatistic,
            goalKey: "kpiGoal" as keyof StaffStatistic,
            metricName: "KPI",
        },
    ];



    return (
        <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow">
            <div className="">
                <div className="flex justify-between items-center mr-5">
                    <p className="text-3xl font-semibold">Thống kê nhân viên vận hành</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-950 hover:bg-blue-650"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-row py-3 gap-15 border-b justify-end">
                    <DateRangeSelectorDetail
                        startDate={selectedStartDate}
                        endDate={selectedEndDate}
                        onChange={({ startDate, endDate, timeType }) => {
                            setSelectedStartDate(startDate);
                            setSelectedEndDate(endDate);
                            setSelectedTimeType(timeType);
                        }}
                    />
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label>
                        <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
                            <SelectTrigger className="w-[180px] text-lg ">
                                <SelectValue placeholder="Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {groupList.map((m) => (
                                        <SelectItem className="text-lg text-blue-950" key={m.groupId} value={String(m.groupId)}>
                                            {m.groupName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 tracking-wide">Nhân hân viên</label>
                        <Select value={String(selectedStaff)} onValueChange={(val) => setSelectedStaff(val ? Number(val) : 0)}>
                            <SelectTrigger className="w-fit text-lg rounded-md transition">
                                <SelectValue placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}>
                                    {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {staffList?.map((st) => (
                                        <SelectItem className="text-lg text-blue-950" key={st.id} value={String(st.id)}>
                                            {st.staffName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col pt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 h-9"
                        >
                            <UserRoundSearch className="h-4 w-4 mr-1" />
                            Lọc nhân viên
                        </Button>
                    </div>
                </div>
            </div>

            {/* Các component con */}
            {dataOverview && (
                <ReportTimeOperatorDetail type={selectedTimeType} data={dataOverview} />
            )}

            {/* Render charts chỉ khi có data */}
            {dataWorkingDetail && (
                <BarChartOperatorDetail
                    title="Thống kê công việc người vận hành"
                    description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu"
                    dataChart={dataWorkingDetail}
                />
            )}

            <TableOperatorDetail title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" />
        </div>
    );
}
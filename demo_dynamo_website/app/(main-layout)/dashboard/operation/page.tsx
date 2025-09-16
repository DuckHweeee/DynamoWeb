// "use client"
// import { StaffOverview } from "./lib/type";
// import { useEffect, useMemo, useState } from "react";
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { DivergingBarChart } from "./components/DivergingBarChart";
// import { ReportTimeOperator } from "./components/ReportTimeOperator";
// import { useGroups } from "@/hooks/useGroup";
// import StaffTable from "./components/StaffTable";
// import { useRouter } from 'next/navigation'; // hoặc 'next/router' nếu dùng Pages Router
// import { Button } from "@/components/ui/button";
// import { Download, UserRoundSearch, } from "lucide-react";
// import { useStaffStatistic } from "./hooks/useStaffStatistic";
// import DateRangeSelector from "./components/DateRangeSelector";
// import { useStaffOverview } from "./hooks/useStaffOverview";
// const myData = [
//     { name: "Phuc", target: 450, real: 600 },
//     { name: "An", target: 520, real: 320 },
//     { name: "Bình", target: 600, real: 750 },
//     { name: "An", target: 520, real: 920 },
//     { name: "Bình", target: 300, real: 550 },
// ]
// const myData2 = [
//     { name: "Lợi", target: 400, real: 380 },
//     { name: "Đức", target: 700, real: 720 },
//     { name: "Trang", target: 500, real: 450 },
//     { name: "Huy", target: 650, real: 800 },
//     { name: "Lan", target: 550, real: 500 },
// ]
// const myData3 = [
//     { name: "Lợi", target: 400, real: 380 },
//     { name: "Đức", target: 700, real: 720 },
//     { name: "Trang", target: 500, real: 450 },
//     { name: "Huy", target: 650, real: 800 },
//     { name: "Lan", target: 550, real: 500 },
// ]


// const myDataStaff: StaffOverview[] = [
//     {
//         "staffId": "3357ef2c-3991-4dcb-a31c-c47808d42ae0",
//         "staffIdNumber": 1004,
//         "staffFullName": "Van D",
//         "workingHourGoal": 8.8,
//         "totalWorkingHour": 2.0,
//         "manufacturingPointGoal": 95.0,
//         "totalManufacturingPoint": 10,
//         "totalOperationNumber": 1,
//         "oleGoal": 9.0,
//         "ole": 0.025,
//         "kpiGoal": 92.0,
//         "kpi": 0.33333334,
//         "machineTimeGoal": 9.1,
//         "machineTime": 2.0,
//         "pgTimeGoal": 8.2,
//         "pgTime": 189.0
//     },
//     {
//         "staffId": "4428ad4f-1e8d-44f0-9c42-54e5b12f9b01",
//         "staffIdNumber": 1005,
//         "staffFullName": "Nguyen A",
//         "workingHourGoal": 8.0,
//         "totalWorkingHour": 7.5,
//         "manufacturingPointGoal": 90.0,
//         "totalManufacturingPoint": 88,
//         "totalOperationNumber": 12,
//         "oleGoal": 9.0,
//         "ole": 8.7,
//         "kpiGoal": 91.0,
//         "kpi": 0.95,
//         "machineTimeGoal": 8.5,
//         "machineTime": 8.2,
//         "pgTimeGoal": 180.0,
//         "pgTime": 175.0
//     },
//     {
//         "staffId": "56c2db67-69fb-4a93-8e28-83e69eac2c77",
//         "staffIdNumber": 1006,
//         "staffFullName": "Tran B",
//         "workingHourGoal": 9.0,
//         "totalWorkingHour": 9.2,
//         "manufacturingPointGoal": 100.0,
//         "totalManufacturingPoint": 105,
//         "totalOperationNumber": 14,
//         "oleGoal": 9.5,
//         "ole": 9.8,
//         "kpiGoal": 93.0,
//         "kpi": 1.05,
//         "machineTimeGoal": 9.0,
//         "machineTime": 9.3,
//         "pgTimeGoal": 200.0,
//         "pgTime": 210.0
//     },
//     {
//         "staffId": "6f57b9db-74cf-4576-9e7d-0a97ff9a27a4",
//         "staffIdNumber": 1007,
//         "staffFullName": "Le C",
//         "workingHourGoal": 7.5,
//         "totalWorkingHour": 6.8,
//         "manufacturingPointGoal": 85.0,
//         "totalManufacturingPoint": 80,
//         "totalOperationNumber": 9,
//         "oleGoal": 8.0,
//         "ole": 7.6,
//         "kpiGoal": 89.0,
//         "kpi": 0.87,
//         "machineTimeGoal": 7.5,
//         "machineTime": 7.0,
//         "pgTimeGoal": 160.0,
//         "pgTime": 150.0
//     }
// ]

// export default function OperationChart() {
//     const router = useRouter();

//     const [selectedStartDate, setStartDate] = useState<string>()
//     const [selectedEndDate, setSelectedEndDate] = useState<string>()
//     const [selectedGroup, setSelectedGroup] = useState<string>()
//     const [selectedStaff, setSelectedStaff] = useState("");
//     const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

//     // Tạo queryParams để truyền vào hook useStaffStatistic
//     const queryParams = useMemo(() => {
//         if (!selectedGroup || !selectedStartDate || !selectedEndDate) {
//             return null;
//         }
//         return {
//             groupId: selectedGroup,
//             startDate: selectedStartDate,
//             endDate: selectedEndDate
//         };
//     }, [selectedGroup, selectedStartDate, selectedEndDate]);

//     // Gọi API lấy dữ liệu thống kê nhân viên Statistic
//     const { data: dataStatistic } = useStaffStatistic(
//         queryParams?.groupId ?? "",
//         queryParams?.startDate ?? "",
//         queryParams?.endDate ?? ""
//     );

//     // Gọi API lấy dữ liệu thống kê nhân viên Overview
//     // const { data: dataOverview } = useStaffOverview(
//     //     queryParams?.groupId ?? "",
//     //     queryParams?.startDate ?? "",
//     //     queryParams?.endDate ?? ""
//     // );

//     // Lấy danh sách nhân viên từ tất cả các nhóm
//     const staffList = dataStatistic?.staff;

//     // Lấy danh sách nhóm
//     const { data: groupList } = useGroups()

//     // Lấy nhóm đầu tiên làm nhóm mặc định khi load trang
//     useEffect(() => {
//         if (groupList.length > 0 && !selectedGroup) {
//             setSelectedGroup(String(groupList[0].groupId))
//         }
//     }, [groupList, selectedGroup])

//     // Lấy tên nhân viên và nhóm đã chọn để hiển thị
//     const selectedStaffName = staffList?.find(st => String(st?.staffId) === selectedStaff)?.staffName;
//     const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

//     // Handler chuyển đến trang chi tiết
//     const handleStaffSelection = (staffId: string) => {
//         setSelectedStaff(staffId);
//         // Tạo URL với query params để truyền thông tin filter hiện tại
//         const searchParams = new URLSearchParams();
//         if (selectedStartDate) searchParams.set('startDate', selectedStartDate);
//         if (selectedEndDate) searchParams.set('endDate', selectedEndDate);
//         if (selectedGroup) searchParams.set('groupId', selectedGroup);
//         searchParams.set('staffId', staffId);

//         // Chuyển đến trang operatorDetail với thông tin
//         router.push(`/dashboard/operation/operatorDetail?${searchParams.toString()}`);
//     };

//     // console.log("Staff Count:", dataStatistic?.workingRate);
//     return (
//         <>
//             <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
//                 <div className="">
//                     <div className="flex justify-between items-center mr-5">
//                         <p className="text-3xl font-semibold">Thống kê vận hành</p>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-900 hover:bg-blue-650"
//                         >
//                             <Download className="h-4 w-4" />
//                         </Button>
//                     </div>
//                     <div className="flex flex-row py-3 gap-15 justify-end">
//                         <DateRangeSelector
//                             onChange={({ startDate, endDate, timeType }) => {
//                                 setStartDate(startDate);
//                                 setSelectedEndDate(endDate);
//                                 setSelectedTimeType(timeType);
//                             }}
//                         />
//                         <div className="space-y-1">
//                             <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label>
//                             <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
//                                 <SelectTrigger className="w-[180px] text-lg ">
//                                     <SelectValue placeholder="Nhóm" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectGroup>
//                                         {groupList.map((m) => (
//                                             <SelectItem className="text-lg text-blue-950" key={m.groupId} value={String(m.groupId)}>
//                                                 {m.groupName}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectGroup>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div className="space-y-1">
//                             <label className="text-sm font-medium text-gray-600 tracking-wide">Nhân viên</label>
//                             <Select
//                                 value={selectedStaff}
//                                 onValueChange={handleStaffSelection}
//                             >
//                                 <SelectTrigger className="w-fit text-lg px-4 rounded-md  transition ">
//                                     <SelectValue
//                                         placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}
//                                     >
//                                         {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
//                                     </SelectValue>
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectGroup>
//                                         {staffList?.map((st) => (
//                                             <SelectItem
//                                                 className="text-xl text-blue-950"
//                                                 key={st.staffName}
//                                                 value={String(st.staffId)}
//                                             >
//                                                 {st.staffName}
//                                             </SelectItem>
//                                         )) || []}
//                                     </SelectGroup>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Cái này đang chạy */}
//                 <ReportTimeOperator timeType={selectedTimeType} staffCount={dataStatistic?.staffCount ?? 0}
//                     workingHours={dataStatistic?.workingHours ?? 0} workingRate={dataStatistic?.workingRate ?? -5}
//                     manufacturingPoints={dataStatistic?.manufacturingPoints ?? 0} mpRate={dataStatistic?.mpRate ?? 5}
//                     processCount={dataStatistic?.processCount ?? 0} processRate={dataStatistic?.processRate ?? -5}
//                     totalKpi={dataStatistic?.totalKpi ?? 0} kpiRate={dataStatistic?.kpiRate ?? 5} />

//                 {/* Chưa test:Cần test thử để không cần ghi thông tin chi tiết giống phía trên */}
//                 {/* {dataStatistic && (
//                     <ReportTimeOperator type={selectedTimeType} data={dataStatistic} />
//                     //     < ReportTimeOperator
//                     //     type={selectedTimeType}
//                     // data={dataStatistic ?? {
//                     //     staffCount: 0,
//                     //     workingHours: 0,
//                     //     workingRate: 0,
//                     //     manufacturingPoints: 0,
//                     //     mpRate: 0,
//                     //     processCount: 0,
//                     //     processRate: 0,
//                     //     totalKpi: 0,
//                     //     kpiRate: 0
//                     // }}
//                     // />
//                 )} */}

//                 <DivergingBarChart title={`Tổng điểm gia công trong ${selectedGroupName}`} description="Thống kê tổng điểm của từng nhân viên trong nhóm" data={myData} />
//                 <div className="grid grid-cols-2 gap-4 my-5">
//                     <DivergingBarChart title={`Tổng giờ PG trong ${selectedGroupName?.toLocaleLowerCase()}`} description="Thống kê tổng giờ PG của nhân viên trong nhóm" data={myData2} />
//                     <DivergingBarChart title={`Tổng giờ máy trong ${selectedGroupName}`} description="Tổng giờ máy của từng nhân viên trong nhóm" data={myData3} />
//                     <DivergingBarChart title={`OLE trong ${selectedGroupName}`} description="OLE của từng nhân viên trong nhóm" data={myData} />
//                     <DivergingBarChart title={`KPI trong ${selectedGroupName}`} description="KPI của từng nhân viên trong nhóm " data={myData} />
//                 </div>

//                 <StaffTable title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" staffList={myDataStaff} />
//             </div >
//         </>
//     )
// }



// Phiên bản 2 tránh nạp dư thừa dữ liệu

"use client"
import { useEffect, useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGroups } from "@/hooks/useGroup";
import { useRouter } from 'next/navigation'; // hoặc 'next/router' nếu dùng Pages Router
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useStaffStatistic } from "./hooks/useStaffStatistic";
import { useStaffOverview } from "./hooks/useStaffOverview";
import DateRangeSelector from "./components/DateRangeSelector";
import { ReportTimeOperator } from "./components/ReportTimeOperator";
import { DivergingBarChart } from "./components/DivergingBarChart";
import { StaffOverview } from "./lib/type";
import StaffTable from "./components/StaffTable";

const myDataStaff: StaffOverview[] = [
    {
        "staffId": "3357ef2c-3991-4dcb-a31c-c47808d42ae0",
        "staffIdNumber": 1004,
        "staffFullName": "Van D",
        "workingHourGoal": 8.8,
        "totalWorkingHour": 2.0,
        "manufacturingPointGoal": 95.0,
        "totalManufacturingPoint": 10,
        "totalOperationNumber": 1,
        "oleGoal": 9.0,
        "ole": 10,
        "kpiGoal": 92.0,
        "kpi": 55,
        "machineTimeGoal": 9.1,
        "machineTime": 5.0,
        "pgTimeGoal": 90.2,
        "pgTime": 53.0
    },
    {
        "staffId": "4428ad4f-1e8d-44f0-9c42-54e5b12f9b01",
        "staffIdNumber": 1005,
        "staffFullName": "Van A",
        "workingHourGoal": 8.0,
        "totalWorkingHour": 7.5,
        "manufacturingPointGoal": 90.0,
        "totalManufacturingPoint": 88,
        "totalOperationNumber": 12,
        "oleGoal": 9.0,
        "ole": 8.7,
        "kpiGoal": 91.0,
        "kpi": 95,
        "machineTimeGoal": 8.5,
        "machineTime": 8.2,
        "pgTimeGoal": 180.0,
        "pgTime": 175.0
    },
    {
        "staffId": "56c2db67-69fb-4a93-8e28-83e69eac2c77",
        "staffIdNumber": 1006,
        "staffFullName": "Tran B",
        "workingHourGoal": 9.0,
        "totalWorkingHour": 9.2,
        "manufacturingPointGoal": 100.0,
        "totalManufacturingPoint": 105,
        "totalOperationNumber": 14,
        "oleGoal": 9.5,
        "ole": 9.8,
        "kpiGoal": 93.0,
        "kpi": 59,
        "machineTimeGoal": 9.0,
        "machineTime": 9.3,
        "pgTimeGoal": 200.0,
        "pgTime": 210.0
    },
    {
        "staffId": "6f57b9db-74cf-4576-9e7d-0a97ff9a27a4",
        "staffIdNumber": 1007,
        "staffFullName": "Le C",
        "workingHourGoal": 7.5,
        "totalWorkingHour": 6.8,
        "manufacturingPointGoal": 85.0,
        "totalManufacturingPoint": 80,
        "totalOperationNumber": 9,
        "oleGoal": 8.0,
        "ole": 7.6,
        "kpiGoal": 89.0,
        "kpi": 87,
        "machineTimeGoal": 7.5,
        "machineTime": 7.0,
        "pgTimeGoal": 160.0,
        "pgTime": 150.0
    }
]

export default function OperationChart() {
    const router = useRouter();

    const [selectedStartDate, setStartDate] = useState<string>()
    const [selectedEndDate, setSelectedEndDate] = useState<string>()
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

    // Tạo queryParams để truyền vào hook useStaffStatistic
    const queryParams = useMemo(() => {
        if (!selectedGroup || !selectedStartDate || !selectedEndDate) {
            return null;
        }
        return {
            groupId: selectedGroup,
            startDate: selectedStartDate,
            endDate: selectedEndDate
        };
    }, [selectedGroup, selectedStartDate, selectedEndDate]);

    // Gọi API lấy dữ liệu thống kê nhân viên Statistic
    const { data: dataStatistic } = useStaffStatistic(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );

    // Gọi API lấy dữ liệu thống kê nhân viên Overview
    const { data: dataOverview } = useStaffOverview(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );
    // console.log("Data Overview:", dataOverview);
    // Lấy danh sách nhân viên từ tất cả các nhóm
    const staffList = dataStatistic?.staffDto;
    // Lấy danh sách nhóm
    const { data: groupList } = useGroups()

    // Lấy nhóm đầu tiên làm nhóm mặc định khi load trang
    useEffect(() => {
        if (groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId))
        }
    }, [groupList, selectedGroup])

    // Lấy tên nhân viên và nhóm đã chọn để hiển thị
    // const selectedStaffName = staffList?.find(st => String(st?.staffId) === selectedStaff)?.staffName;
    const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

    // Handler chuyển đến trang chi tiết
    const handleStaffSelection = (id: string) => {
        setSelectedStaff(id);
        // Tạo URL với query params để truyền thông tin filter hiện tại
        const searchParams = new URLSearchParams();
        if (selectedStartDate) searchParams.set('startDate', selectedStartDate);
        if (selectedEndDate) searchParams.set('endDate', selectedEndDate);
        if (selectedGroup) searchParams.set('groupId', selectedGroup);
        searchParams.set("staffId", id);
        // Chuyển đến trang operatorDetail với thông tin
        router.push(`/dashboard/operation/operatorDetail?${searchParams.toString()}`);
    };

    // Chuyển đổi dữ liệu từ StaffOverview sang định dạng dữ liệu biểu đồ
    function transformData<T extends Record<string, any>>(
        staffData: T[],
        targetKey: keyof T,
        realKey: keyof T
    ) {
        return staffData.map((s) => ({
            name: s.staffFullName,
            target: s[targetKey] as number,
            real: s[realKey] as number,
        }));
    }
    const chartConfigs = [
        {
            title: (groupName: string) => `Tổng giờ PG trong ${groupName}`,
            description: "Thống kê tổng giờ PG của nhân viên trong nhóm",
            targetKey: "pgTimeGoal",
            realKey: "pgTime",
        },
        {
            title: (groupName: string) => `Tổng giờ máy trong ${groupName}`,
            description: "Tổng giờ máy của từng nhân viên trong nhóm",
            targetKey: "machineTimeGoal",
            realKey: "machineTime",
        },
        {
            title: (groupName: string) => `Tổng giờ OLE trong ${groupName}`,
            description: "OLE của từng nhân viên trong nhóm",
            targetKey: "oleGoal",
            realKey: "ole",
        },
        {
            title: (groupName: string) => `Tổng KPI trong ${groupName}`,
            description: "KPI của từng nhân viên trong nhóm",
            targetKey: "kpiGoal",
            realKey: "kpi",
        },
    ];

    return (
        <>
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
                <div className="">
                    <div className="flex justify-between items-center mr-5">
                        <p className="text-3xl font-semibold">Thống kê vận hành</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-900 hover:bg-blue-650"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-row py-3 gap-15 justify-end">
                        <DateRangeSelector
                            onChange={({ startDate, endDate, timeType }) => {
                                setStartDate(startDate);
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
                            <label className="text-sm font-medium text-gray-600 tracking-wide">Nhân viên</label>
                            <Select
                                value={selectedStaff}
                                onValueChange={handleStaffSelection}
                            >
                                <SelectTrigger className="w-fit text-lg px-4 rounded-md  transition ">
                                    <SelectValue
                                        placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}
                                    >
                                        {/* {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`} */}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {staffList?.map((st) => (
                                            <SelectItem
                                                className="text-xl text-blue-950"
                                                key={st.staffName}
                                                value={String(st.id)}
                                            >
                                                {st.staffName}
                                            </SelectItem>
                                        )) || []}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                {dataStatistic && (
                    <ReportTimeOperator type={selectedTimeType} data={dataStatistic} />
                )}

                <DivergingBarChart
                    title={`Tổng điểm gia công trong ${selectedGroupName}`}
                    description="Thống kê tổng điểm của từng nhân viên trong nhóm"
                    data={transformData(dataOverview, "manufacturingPointGoal", "totalManufacturingPoint")}
                />
                <div className="grid grid-cols-2 gap-4 my-5">
                    {chartConfigs.map((cfg, idx) => (
                        <DivergingBarChart
                            key={idx}
                            title={cfg.title(selectedGroupName ?? "")}
                            description={cfg.description}
                            data={transformData(dataOverview, cfg.targetKey as keyof StaffOverview, cfg.realKey as keyof StaffOverview)}
                        />
                    ))}
                </div>
                <StaffTable title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" staffList={dataOverview} />
            </div >
        </>
    )
}
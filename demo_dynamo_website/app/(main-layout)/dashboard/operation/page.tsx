// "use client"
// import { MachineProcessBarChart } from "../components/machineProcessBarChart";
// import { ReportTime } from "../components/reporTime";

// import { Calendar } from "lucide-react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar as DatePicker } from "@/components/ui/calendar";
// import { cn } from "@/lib/utils";
// import { DateRange } from "react-day-picker"
// import { format } from "date-fns";
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
// import DateRangeSelector from "../components/DateRangeSelector";
// import { ReportTimeOperator } from "./components/ReportTimeOperator";
// import { useStaffOverview } from "./hook/useStaffOverview";
// import { useGroups } from "@/hooks/useGroup";
// import StaffTable from "./components/StaffTable";
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
//     { name: "Lợi", target: 400, real: 380 },   // real < target
//     { name: "Đức", target: 700, real: 720 },   // real > target
//     { name: "Trang", target: 500, real: 450 }, // real < target
//     { name: "Huy", target: 650, real: 800 },   // real > target
//     { name: "Lan", target: 550, real: 500 },
// ]

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
// ]


// export default function OperationChart() {

//     const [selectedStartDate, setStartDate] = useState<string>()
//     const [selectedEndDate, setSelectedEndDate] = useState<string>()
//     const [selectedGroup, setSelectedGroup] = useState<string>()

//     // Đang lấy dữ liệu nhân viên
//     // const { data: staffList } = useStaffOverview(
//     //     selectedGroup ?? "",
//     //     selectedStartDate ?? "",
//     //     selectedEndDate ?? ""
//     // )
//     const queryParams = useMemo(() => {
//         if (!selectedGroup || !selectedStartDate || !selectedEndDate) {
//             return null;
//         }
//         return {
//             group: selectedGroup,
//             startDate: selectedStartDate,
//             endDate: selectedEndDate
//         };
//     }, [selectedGroup, selectedStartDate, selectedEndDate]);

//     // const { data: staffList } = useStaffOverview(
//     //     queryParams?.group ?? "",
//     //     queryParams?.startDate ?? "",
//     //     queryParams?.endDate ?? "",
//     //     {
//     //         enabled: !!queryParams
//     //     }
//     // )
//     const staffList = myDataStaff;
//     console.log("staffData")
//     console.log(staffList)



//     const { data: groupList } = useGroups()

//     useEffect(() => {
//         if (groupList.length > 0 && !selectedGroup) {
//             setSelectedGroup(String(groupList[0].groupId))
//         }
//     }, [groupList, selectedGroup])


//     const [selectedStaff, setSelectedStaff] = useState("");
//     const selectedStaffName = staffList?.find(st => String(st.staffId) === selectedStaff)?.staffFullName;

//     return (
//         <>
//             {/* Thống kê vận hành */}
//             <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
//                 <div className="flex flex-wrap items-center justify-end mb-4">
//                     {/* Vùng chọn ngày */}
//                     <div className="flex flex-wrap gap-4 items-center">
//                         <DateRangeSelector
//                             onChange={({ startDate, endDate }) => {
//                                 setStartDate(startDate)
//                                 setSelectedEndDate(endDate)
//                                 console.log("Start:", selectedStartDate)
//                                 console.log("End:", selectedEndDate)
//                             }}
//                         />
//                         <Select
//                             value={selectedGroup ?? ""}
//                             onValueChange={(val) => setSelectedGroup(val)}
//                         >
//                             <SelectTrigger className="w-[180px] text-xl bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
//                                 <SelectValue placeholder="Nhóm" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     {groupList.map((m) => (
//                                         <SelectItem
//                                             className="text-xl text-blue-950"
//                                             key={m.groupName}
//                                             value={String(m.groupId)}
//                                         >
//                                             {m.groupName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>
//                 <div className="flex flex-row items-center justify-between mt-2">
//                     <p className="text-3xl font-semibold">Thống kê vận hành</p>

//                     {/* <div className="flex gap-15 flex-row items-center justify-between">
//                         <p className="text-xl font-medium">Tổng Số: </p>
//                         <p className="text-3xl font-bold text-[#074695]">12 người vận hành</p>
//                     </div> */}
//                     <Select
//                         value={selectedStaff}
//                         onValueChange={(val) => setSelectedStaff(val)}
//                     >
//                         <SelectTrigger className="w-fit text-xl px-4 !py-5.5 rounded-md  transition ">
//                             <SelectValue
//                                 placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}
//                             >
//                                 {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
//                             </SelectValue>
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectGroup>
//                                 {staffList?.map((st) => (
//                                     <SelectItem
//                                         className="text-xl text-blue-950"
//                                         key={st.staffFullName}
//                                         value={String(st.staffId)}
//                                     >
//                                         {st.staffFullName}
//                                     </SelectItem>
//                                 )) || []}
//                             </SelectGroup>
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <ReportTimeOperator />

//                 <div className="grid grid-cols-2 gap-4 my-5">
//                     <DivergingBarChart title="Tổng điểm gia công trong nhóm 1" description="Thống kê tổng điểm của từng nhân viên trong nhóm" data={myData} />
//                     <DivergingBarChart title="Tổng giờ PG trong nhóm 1" description="Thống kê tổng giờ PG của nhân viên trong nhóm" data={myData2} />
//                     <DivergingBarChart title="Tổng giờ máy trong nhóm 1" description="Tổng giờ máy của từng nhân viên trong nhóm" data={myData3} />
//                     <DivergingBarChart title="Nhân viên làm việc trong nhóm 1" description="Nhân viên làm việc" data={myData} />
//                     <DivergingBarChart title="OLE trong nhóm 1" description="OLE của từng nhân viên trong nhóm" data={myData} />
//                     <DivergingBarChart title="KPI trong nhóm 1" description="KPI của từng nhân viên trong nhóm " data={myData} />
//                 </div>

//                 {/* <StaffTable title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" staffList={staffList} /> */}
//             </div >
//         </>
//     )
// }



// Bản 2
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
// import DateRangeSelector from "../components/DateRangeSelector";
// import { ReportTimeOperator } from "./components/ReportTimeOperator";
// import { useGroups } from "@/hooks/useGroup";
// import StaffTable from "./components/StaffTable";
// import { useRouter } from 'next/navigation'; // hoặc 'next/router' nếu dùng Pages Router

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
//     { name: "Lợi", target: 400, real: 380 },   // real < target
//     { name: "Đức", target: 700, real: 720 },   // real > target
//     { name: "Trang", target: 500, real: 450 }, // real < target
//     { name: "Huy", target: 650, real: 800 },   // real > target
//     { name: "Lan", target: 550, real: 500 },
// ]


// const myDataStaff: StaffOverview[] = [
//     {
//         staffFullName: "Nguyễn Văn Lợi",
//         staffId: "S400",
//         staffIdNumber: 400,
//         totalWorkingHour: 4590,
//         totalManufacturingPoint: 100,
//         totalOperationNumber: 10,
//         oleGoal: 95,
//         ole: 88,
//         kpiGoal: 20,
//         kpi: 15,
//     },
//     {
//         staffFullName: "Lê Văn Đức",
//         staffId: "S700",
//         staffIdNumber: 700,
//         totalWorkingHour: 3488,
//         totalManufacturingPoint: 90,
//         totalOperationNumber: 9,
//         oleGoal: 59,
//         ole: 68,
//         kpiGoal: 50,
//         kpi: 125,
//     },
//     {
//         staffFullName: "Đoàn Thi Trang",
//         staffId: "S500",
//         staffIdNumber: 500,
//         totalWorkingHour: 4592,
//         totalManufacturingPoint: 150,
//         totalOperationNumber: 12,
//         oleGoal: 97,
//         ole: 90,
//         kpiGoal: 90,
//         kpi: 90
//     },
//     {
//         staffFullName: "Nguyễn Huy",
//         staffId: "S650",
//         staffIdNumber: 650,
//         totalWorkingHour: 3146,
//         totalManufacturingPoint: 85,
//         totalOperationNumber: 8,
//         oleGoal: 90,
//         ole: 80,
//         kpiGoal: 80,
//         kpi: 80
//     },
//     {
//         staffFullName: "Nguyễn Thị Lan",
//         staffId: "S550",
//         staffIdNumber: 550,
//         totalWorkingHour: 3539,
//         totalManufacturingPoint: 95,
//         totalOperationNumber: 11,
//         oleGoal: 50,
//         ole: 180,
//         kpiGoal: 40,
//         kpi: 60
//     }
// ]

// export default function OperationChart() {
//     const router = useRouter();

//     const [selectedStartDate, setStartDate] = useState<string>()
//     const [selectedEndDate, setSelectedEndDate] = useState<string>()
//     const [selectedGroup, setSelectedGroup] = useState<string>()

//     // Đang lấy dữ liệu nhân viên
//     // const { data: staffList } = useStaffOverview(
//     //     selectedGroup ?? "",
//     //     selectedStartDate ?? "",
//     //     selectedEndDate ?? ""
//     // )
//     const queryParams = useMemo(() => {
//         if (!selectedGroup || !selectedStartDate || !selectedEndDate) {
//             return null;
//         }
//         return {
//             group: selectedGroup,
//             startDate: selectedStartDate,
//             endDate: selectedEndDate
//         };
//     }, [selectedGroup, selectedStartDate, selectedEndDate]);
//     // Cái này đang chuẩn
//     // const { data: staffList } = useStaffOverview(
//     //     queryParams?.group ?? "",
//     //     queryParams?.startDate ?? "",
//     //     queryParams?.endDate ?? "",
//     //     {
//     //         enabled: !!queryParams
//     //     }
//     // )


//     const staffList = myDataStaff;
//     // console.log("staffData")
//     // console.log(staffList)

//     const { data: groupList } = useGroups()

//     useEffect(() => {
//         if (groupList.length > 0 && !selectedGroup) {
//             setSelectedGroup(String(groupList[0].groupId))
//         }
//     }, [groupList, selectedGroup])

//     const [selectedStaff, setSelectedStaff] = useState("");
//     const selectedStaffName = staffList?.find(st => String(st.staffId) === selectedStaff)?.staffFullName;

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

//     const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

//     return (
//         <>
//             {/* Thống kê vận hành */}
//             <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
//                 <div className="flex flex-wrap items-center justify-end mb-4">
//                     {/* Vùng chọn ngày */}
//                     <div className="flex flex-wrap gap-4 items-center">
//                         <DateRangeSelector
//                             onChange={({ startDate, endDate }) => {
//                                 setStartDate(startDate)
//                                 setSelectedEndDate(endDate)
//                             }}
//                         />
//                         <Select
//                             value={selectedGroup ?? ""}
//                             onValueChange={(val) => setSelectedGroup(val)}
//                         >
//                             <SelectTrigger className="w-[180px] text-xl bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
//                                 <SelectValue placeholder="Nhóm" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     {groupList.map((m) => (
//                                         <SelectItem
//                                             className="text-xl text-blue-950"
//                                             key={m.groupName}
//                                             value={String(m.groupId)}
//                                         >
//                                             {m.groupName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>
//                 <div className="flex flex-row items-center justify-between mt-2">
//                     <p className="text-3xl font-semibold">Thống kê vận hành</p>

//                     {/* Select với navigation */}
//                     <Select
//                         value={selectedStaff}
//                         onValueChange={handleStaffSelection}
//                     >
//                         <SelectTrigger className="w-fit text-xl px-4 !py-5.5 rounded-md  transition ">
//                             <SelectValue
//                                 placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}
//                             >
//                                 {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
//                             </SelectValue>
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectGroup>
//                                 {staffList?.map((st) => (
//                                     <SelectItem
//                                         className="text-xl text-blue-950"
//                                         key={st.staffFullName}
//                                         value={String(st.staffId)}
//                                     >
//                                         {st.staffFullName}
//                                     </SelectItem>
//                                 )) || []}
//                             </SelectGroup>
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <ReportTimeOperator />
//                 <DivergingBarChart title={`Tổng điểm gia công trong ${selectedGroupName}`} description="Thống kê tổng điểm của từng nhân viên trong nhóm" data={myData} />
//                 <div className="grid grid-cols-2 gap-4 my-5">
//                     <DivergingBarChart title={`Tổng giờ PG trong ${selectedGroupName?.toLocaleLowerCase()}`} description="Thống kê tổng giờ PG của nhân viên trong nhóm" data={myData2} />
//                     <DivergingBarChart title={`Tổng giờ máy trong ${selectedGroupName}`} description="Tổng giờ máy của từng nhân viên trong nhóm" data={myData3} />
//                     {/* <DivergingBarChart heightChart="fit" title="Nhân viên làm việc trong nhóm 1" description="Nhân viên làm việc" data={myData} /> */}
//                     <DivergingBarChart title={`OLE trong ${selectedGroupName}`} description="OLE của từng nhân viên trong nhóm" data={myData} />
//                     <DivergingBarChart title={`KPI trong ${selectedGroupName}`} description="KPI của từng nhân viên trong nhóm " data={myData} />
//                 </div>

//                 <StaffTable title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" staffList={myDataStaff} />
//             </div >
//         </>
//     )
// }




"use client"
import { StaffOverview } from "./lib/type";
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
import { DivergingBarChart } from "./components/DivergingBarChart";
import DateRangeSelector from "../components/DateRangeSelector";
import { ReportTimeOperator } from "./components/ReportTimeOperator";
import { useGroups } from "@/hooks/useGroup";
import StaffTable from "./components/StaffTable";
import { useRouter } from 'next/navigation'; // hoặc 'next/router' nếu dùng Pages Router
import { Button } from "@/components/ui/button";
import { Download, UserRoundSearch, } from "lucide-react";
const myData = [
    { name: "Phuc", target: 450, real: 600 },
    { name: "An", target: 520, real: 320 },
    { name: "Bình", target: 600, real: 750 },
    { name: "An", target: 520, real: 920 },
    { name: "Bình", target: 300, real: 550 },
]
const myData2 = [
    { name: "Lợi", target: 400, real: 380 },
    { name: "Đức", target: 700, real: 720 },
    { name: "Trang", target: 500, real: 450 },
    { name: "Huy", target: 650, real: 800 },
    { name: "Lan", target: 550, real: 500 },
]
const myData3 = [
    { name: "Lợi", target: 400, real: 380 },   // real < target
    { name: "Đức", target: 700, real: 720 },   // real > target
    { name: "Trang", target: 500, real: 450 }, // real < target
    { name: "Huy", target: 650, real: 800 },   // real > target
    { name: "Lan", target: 550, real: 500 },
]


const myDataStaff: StaffOverview[] = [
    {
        staffFullName: "Nguyễn Văn Lợi",
        staffId: "S400",
        staffIdNumber: 400,
        totalWorkingHour: 4590,
        totalManufacturingPoint: 100,
        totalOperationNumber: 10,
        oleGoal: 95,
        ole: 88,
        kpiGoal: 20,
        kpi: 15,
    },
    {
        staffFullName: "Lê Văn Đức",
        staffId: "S700",
        staffIdNumber: 700,
        totalWorkingHour: 3488,
        totalManufacturingPoint: 90,
        totalOperationNumber: 9,
        oleGoal: 59,
        ole: 68,
        kpiGoal: 50,
        kpi: 125,
    },
    {
        staffFullName: "Đoàn Thi Trang",
        staffId: "S500",
        staffIdNumber: 500,
        totalWorkingHour: 4592,
        totalManufacturingPoint: 150,
        totalOperationNumber: 12,
        oleGoal: 97,
        ole: 90,
        kpiGoal: 90,
        kpi: 90
    },
    {
        staffFullName: "Nguyễn Huy",
        staffId: "S650",
        staffIdNumber: 650,
        totalWorkingHour: 3146,
        totalManufacturingPoint: 85,
        totalOperationNumber: 8,
        oleGoal: 90,
        ole: 80,
        kpiGoal: 80,
        kpi: 80
    },
    {
        staffFullName: "Nguyễn Thị Lan",
        staffId: "S550",
        staffIdNumber: 550,
        totalWorkingHour: 3539,
        totalManufacturingPoint: 95,
        totalOperationNumber: 11,
        oleGoal: 50,
        ole: 180,
        kpiGoal: 40,
        kpi: 60
    }
]

export default function OperationChart() {
    const router = useRouter();

    const [selectedStartDate, setStartDate] = useState<string>()
    const [selectedEndDate, setSelectedEndDate] = useState<string>()
    const [selectedGroup, setSelectedGroup] = useState<string>()

    // Đang lấy dữ liệu nhân viên
    // const { data: staffList } = useStaffOverview(
    //     selectedGroup ?? "",
    //     selectedStartDate ?? "",
    //     selectedEndDate ?? ""
    // )
    const queryParams = useMemo(() => {
        if (!selectedGroup || !selectedStartDate || !selectedEndDate) {
            return null;
        }
        return {
            group: selectedGroup,
            startDate: selectedStartDate,
            endDate: selectedEndDate
        };
    }, [selectedGroup, selectedStartDate, selectedEndDate]);
    // Cái này đang chuẩn
    // const { data: staffList } = useStaffOverview(
    //     queryParams?.group ?? "",
    //     queryParams?.startDate ?? "",
    //     queryParams?.endDate ?? "",
    //     {
    //         enabled: !!queryParams
    //     }
    // )


    const staffList = myDataStaff;
    // console.log("staffData")
    // console.log(staffList)

    const { data: groupList } = useGroups()

    useEffect(() => {
        if (groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId))
        }
    }, [groupList, selectedGroup])

    const [selectedStaff, setSelectedStaff] = useState("");
    const selectedStaffName = staffList?.find(st => String(st.staffId) === selectedStaff)?.staffFullName;

    // Handler chuyển đến trang chi tiết
    const handleStaffSelection = (staffId: string) => {
        setSelectedStaff(staffId);

        // Tạo URL với query params để truyền thông tin filter hiện tại
        const searchParams = new URLSearchParams();
        if (selectedStartDate) searchParams.set('startDate', selectedStartDate);
        if (selectedEndDate) searchParams.set('endDate', selectedEndDate);
        if (selectedGroup) searchParams.set('groupId', selectedGroup);
        searchParams.set('staffId', staffId);

        // Chuyển đến trang operatorDetail với thông tin
        router.push(`/dashboard/operation/operatorDetail?${searchParams.toString()}`);
    };

    const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

    return (
        <>
            {/* Thống kê vận hành */}
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >




                <div className="">
                    <div className="flex justify-between items-center mr-5">
                        <p className="text-3xl font-semibold">Thống kê vận hành chi tiết</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-950 hover:bg-blue-650"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-row py-3 gap-15 border-b justify-end">
                        <DateRangeSelector
                            onChange={({ startDate, endDate }) => {
                                setStartDate(startDate)
                                setSelectedEndDate(endDate)
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
                                        {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {staffList?.map((st) => (
                                            <SelectItem
                                                className="text-xl text-blue-950"
                                                key={st.staffFullName}
                                                value={String(st.staffId)}
                                            >
                                                {st.staffFullName}
                                            </SelectItem>
                                        )) || []}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <ReportTimeOperator />
                <DivergingBarChart title={`Tổng điểm gia công trong ${selectedGroupName}`} description="Thống kê tổng điểm của từng nhân viên trong nhóm" data={myData} />
                <div className="grid grid-cols-2 gap-4 my-5">
                    <DivergingBarChart title={`Tổng giờ PG trong ${selectedGroupName?.toLocaleLowerCase()}`} description="Thống kê tổng giờ PG của nhân viên trong nhóm" data={myData2} />
                    <DivergingBarChart title={`Tổng giờ máy trong ${selectedGroupName}`} description="Tổng giờ máy của từng nhân viên trong nhóm" data={myData3} />
                    {/* <DivergingBarChart heightChart="fit" title="Nhân viên làm việc trong nhóm 1" description="Nhân viên làm việc" data={myData} /> */}
                    <DivergingBarChart title={`OLE trong ${selectedGroupName}`} description="OLE của từng nhân viên trong nhóm" data={myData} />
                    <DivergingBarChart title={`KPI trong ${selectedGroupName}`} description="KPI của từng nhân viên trong nhóm " data={myData} />
                </div>

                <StaffTable title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" staffList={myDataStaff} />
            </div >
        </>
    )
}
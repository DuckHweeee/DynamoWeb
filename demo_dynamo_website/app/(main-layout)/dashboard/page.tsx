"use client"

import { MonitorDot, TrendingDown, TrendingUp, Download } from "lucide-react"
import MachineRunBarChart from "./components/machineRunBarChart"
import MachineRunBarChart2 from "./components/machineRunBarChart2"
import { MachineRunPieChart } from "./components/machineRunPieChart"
import { MachinePieChart } from "./components/machinePieChart"
import { SumRealTime } from "./components/sumRealTime"
import { MachineProcessBarChart } from "./components/machineProcessBarChart"
import MachineTable from "./components/machineTable"
import { ReportTime } from "./components/reporTime"
import DrawingCodeTable from "./components/drawingTable"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react"
import DateRangeSelector from "./components/DateRangeSelector"
import { MachineTopProcessChart } from "./components/machineTopProcessChart"
import { DivergingBarChart } from "./operation/components/DivergingBarChart"
import { ReportTimeMachine } from "./machine/components/ReportTimeMachine"
import { ReportTimeOperator } from "./operation/components/ReportTimeOperator"
import { SumRealTimeMachine } from "./machine/components/SumRealTimeMachine"

const chartItems = [
    { label: "Tổn thất Offset", value: 90 },
    { label: "Tổn thất NG/khác", value: 36 },
    { label: "Hiệu suất khai thác máy", value: 78 },
    { label: "Hiệu suất giá trị", value: 64 },
    { label: "Hiệu suất PG", value: 58 },
    { label: "OEE", value: 34 },
]
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
export default function Dashboard() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedGroup, setSelectedGroup] = useState<string>("")
    const [selectedStaff, setSelectedStaff] = useState<string>("")
    const [selectedStaffName, setSelectedStaffName] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("")
    const [selectedEndDate, setSelectedEndDate] = useState<string>("")

    // Mock data for groups and staff - replace with actual API data
    const groupList = [
        { groupId: 1, groupName: "Nhóm CNC" },
        { groupId: 2, groupName: "Nhóm Phay" },
        { groupId: 3, groupName: "Nhóm Tiện" },
        { groupId: 4, groupName: "Nhóm Khoan" },
        { groupId: 5, groupName: "Nhóm Mài" },
    ];

    const staffList = [
        { staffId: 1, staffFullName: "Nguyễn Văn A" },
        { staffId: 2, staffFullName: "Trần Thị B" },
        { staffId: 3, staffFullName: "Lê Văn C" },
        { staffId: 4, staffFullName: "Phạm Thị D" },
        { staffId: 5, staffFullName: "Hoàng Văn E" },
        { staffId: 6, staffFullName: "Vũ Thị F" },
    ];

    const handleStaffSelection = (staffId: string) => {
        const staff = staffList.find(s => s.staffId === parseInt(staffId));
        if (staff) {
            setSelectedStaff(staffId);
            setSelectedStaffName(staff.staffFullName);
        }
    };
    return (
        <div>
            <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow" >
                <div className="flex flex-row items-center justify-end mb-4">
                    {/* Vùng chọn ngày */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <DateRangeSelector />

                        {/* Bộ lọc nhóm */}
                        <Select>
                            <SelectTrigger className="w-[180px] text-xl bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                                <SelectValue placeholder="Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {/* <SelectLabel>Fruits</SelectLabel> */}
                                    <SelectItem value="apple" className="text-lg">Nhóm 1</SelectItem>
                                    <SelectItem value="banana" className="text-lg">Nhóm 2</SelectItem>
                                    <SelectItem value="blueberry" className="text-lg">Nhóm 3</SelectItem>
                                    <SelectItem value="grapes" className="text-lg">Nhóm 4</SelectItem>
                                    <SelectItem value="pineapple" className="text-lg">Nhóm 5</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <ReportTimeMachine />
                <div className="my-5 grid grid-cols-2 gap-3">
                    {/* <MachineRunBarChart /> */}
                    <MachineRunBarChart2 title="Tổng Giờ Chạy Trong Tháng Nhóm 1" description="Tổng thời gian hoạt động của nhóm này." />
                    <div className="grid grid-cols-3 gap-3 h-fit">
                        {chartItems.map((item, index) => (
                            <MachinePieChart key={index} data={item} />
                        ))}
                    </div>
                </div>
                <SumRealTimeMachine title="Tổng Thời Gian Thực Của Từng Máy Trong Nhóm (Giờ)" description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu" />
                <div className="flex gap-5 justify-between my-5">
                    {/* <MachineRunBarChart /> */}
                    <MachineProcessBarChart title="Tổng số gia công từng máy trong nhóm đã chạy xong" description="Thống kê số lượng gia công chi tiết đã được thực thi" />
                    <MachineTopProcessChart title="Top 5 máy chạy trong nhóm" description="Thống kê top 5 máy chạy nhiều nhất" />
                </div>
                <MachineTable title="Danh sách Thống kê Máy móc" description="Tất cả các máy" />
            </div >

            {/* Thống kê vận hành */}
            <div className="m-2 my-5 px-4 py-5 bg-white rounded-[10px] shadow" >
                {/* <ReportTimeOperator /> */}
                <div className="grid grid-cols-2 gap-5 my-5">
                    {/* <MachineRunBarChart /> */}
                    <DivergingBarChart title="Tổng điểm gia công trong nhóm 1" description="Thống kê tổng điểm của từng nhân viên trong nhóm" data={myData} />
                    <DivergingBarChart title="Tổng giờ PG trong nhóm 1" description="Thống kê tổng giờ PG của nhân viên trong nhóm" data={myData2} />
                    <DivergingBarChart title="Tổng giờ máy trong nhóm 1" description="Tổng giờ máy của từng nhân viên trong nhóm" data={myData3} />
                    <DivergingBarChart title="Nhân viên làm việc trong nhóm 1" description="Nhân viên làm việc" data={myData} />
                    <DivergingBarChart title="OLE trong nhóm 1" description="OLE của từng nhân viên trong nhóm" data={myData} />
                    <DivergingBarChart title="KPI trong nhóm 1" description="KPI của từng nhân viên trong nhóm " data={myData} />
                </div>
                {/* <OperatorTable title="Danh sách người vận hành" description="Tất cả các máy" /> */}
            </div >

            {/* Thống kê bản vẽ */}
            <div className="m-2 my-5 px-4 py-5 bg-white rounded-[10px] shadow" >
                <ReportTime title={"Thống kê bản vẽ"} description={"12 bản vẽ"} />
                <SumRealTime title="Tổng Thời Gian Thực / Dự kiến" description="PG Dự Kiến Của Từng Máy Trong Nhóm" />
                <div className="mt-5">
                    <DrawingCodeTable title="Danh sách bản vẽ" description="Tất cả các máy" />
                </div>
            </div >

            {/* Thống kê Process */}
            <div className="m-2 my-5 px-4 py-5 bg-white rounded-[10px] shadow" >
                <ReportTime title={"Thống kê nguyên công "} description={"12 nguyên công"} />
                {/* <OperatorTable title={""} description={""} staffList={[]} /> */}
            </div >
        </div >
    )
}

"use client"
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker"
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReportTime } from "../components/reporTime";
import MachineRunBarChart2 from "../components/machineRunBarChart2";
import { MachinePieChart } from "../components/machinePieChart";
import { SumRealTime } from "../components/sumRealTime";
import { MachineProcessBarChart } from "../components/machineProcessBarChart";
import MachineTable from "../components/machineTable";
import { useState } from "react";
import DateRangeSelector from "../components/DateRangeSelector";
import { ReportTimeMachine } from "./components/ReportTimeMachine";
const chartItems = [
    { label: "Tổn thất Offset", value: 90 },
    { label: "Tổn thất NG/khác", value: 36 },
    { label: "Hiệu suất khai thác máy", value: 78 },
    { label: "Hiệu suất giá trị", value: 64 },
    { label: "Hiệu suất PG", value: 58 },
    { label: "OEE", value: 34 },
]
export default function MachineChart() {
    const [date, setDate] = useState<DateRange | undefined>();
    return (
        <>
            <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow" >
                <div className="flex flex-wrap items-center justify-end mb-4">
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
                <ReportTimeMachine title={"Thống kê máy móc"} description={"12 máy"} />
                <div className="my-5 grid grid-cols-2 gap-3">
                    {/* <MachineRunBarChart /> */}
                    <MachineRunBarChart2 title="Tổng Giờ Chạy Trong Tháng Nhóm 1" description="Tổng thời gian hoạt động của nhóm này." />
                    <div className="grid grid-cols-3 gap-3">
                        {chartItems.map((item, index) => (
                            <MachinePieChart key={index} data={item} />
                        ))}
                    </div>
                </div>

                {/* <div className="my-5 flex gap-3 justify-between">
                <div className="w-1/2 h-[300px]">
                    <MachineRunBarChart />
                </div>

                <div className="w-1/2 h-[300px] grid grid-cols-2 gap-4">
                    {chartItems.map((item, index) => (
                        <MachinePieChart key={index} data={item} />
                    ))}
                </div>
                </div> */}

                <SumRealTime title="Tổng Thời Gian Thực Của Từng Máy Trong Nhóm (Giờ)" description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu" />
                <div className="flex gap-5 justify-between my-5">
                    {/* <MachineRunBarChart /> */}
                    <MachineProcessBarChart title="Tổng số gia công từng máy trong nhóm đã chạy xong" description="Thống kê số lượng gia công chi tiết đã được thực thi" />
                    <MachineProcessBarChart title="Top 5 máy chạy nhiều nhất trong nhóm" description="Thống kê top 5 máy chạy nhiều nhất" />
                </div>
                <MachineTable title="Danh sách Thống kê Máy móc" description="Tất cả các máy" />
            </div >
        </>
    )

}
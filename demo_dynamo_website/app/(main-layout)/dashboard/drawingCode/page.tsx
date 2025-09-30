"use client"
import { DateRange } from "react-day-picker"
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
import { SumRealTime } from "../components/sumRealTime";
import { useState } from "react";
import DrawingCodeTable from "../components/drawingTable";
import DateRangeSelector from "../components/DateRangeSelector";
const chartItems = [
    { label: "Máy Đang Chạy", value: 12, fill: "#0ea5e9" },     // blue
    { label: "Máy Dừng", value: 3, fill: "#facc15" },           // yellow
    { label: "Máy Lỗi", value: 1, fill: "#ef4444" },            // red
    { label: "Bảo Trì", value: 2, fill: "#8b5cf6" },            // purple
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
                {/* Thống kê bản vẽ */}
                {/* <div className="m-2 my-5 px-4 py-5 bg-white rounded-[10px] shadow" > */}
                <ReportTime title={"Thống kê bản vẽ"} description={"12 bản vẽ"} />
                <SumRealTime title="Tổng Thời Gian Thực / Dự kiến" description="PG Dự Kiến Của Từng Máy Trong Nhóm" />
                <div className="mt-5">
                    <DrawingCodeTable title="Danh sách bản vẽ" description="Tất cả các máy" />
                </div>
                {/* </div > */}
            </div >
        </>
    )

}
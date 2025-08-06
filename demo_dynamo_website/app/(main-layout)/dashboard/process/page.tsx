"use client"
import OperatorTable from "../component/operatorTable";
import { ReportTime } from "../component/reporTime";

import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker"
import { format } from "date-fns";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
export default function ProcessChart() {
    const [date, setDate] = useState<DateRange | undefined>();
    return (
        <>
            {/* Thống kê Process */}
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
                <div className="flex flex-wrap items-center justify-end mb-4">
                    {/* Vùng chọn ngày */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "flex items-center gap-2 bg-[#004799] text-white px-4 py-3 rounded-md hover:bg-[#003b80] transition"
                                    )}
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm">
                                        {date?.from ? format(date.from, "dd/MM/yyyy") : "Ngày bắt đầu"} -{" "}
                                        {date?.to ? format(date.to, "dd/MM/yyyy") : "Ngày kết thúc"}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="flex gap-4 p-4 !w-full" align="start">
                                <DatePicker
                                    mode="range"
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Bộ lọc 1 */}
                        <Select>
                            <SelectTrigger className="w-[180px] bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                                <SelectValue placeholder="Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {/* <SelectLabel>Fruits</SelectLabel> */}
                                    <SelectItem value="apple">Nhóm 1</SelectItem>
                                    <SelectItem value="banana">Nhóm 2</SelectItem>
                                    <SelectItem value="blueberry">Nhóm 3</SelectItem>
                                    <SelectItem value="grapes">Nhóm 4</SelectItem>
                                    <SelectItem value="pineapple">Nhóm 5</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <ReportTime title={"Thống kê Process "} description={"12 nguyên công"} />
                <OperatorTable title="Danh sách thống kê nhân viên" description="Tất cả các máy" />
            </div >
        </>
    )

}
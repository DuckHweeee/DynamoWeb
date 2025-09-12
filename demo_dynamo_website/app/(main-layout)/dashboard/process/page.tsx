"use client"
import OperatorTable from "../operation/components/StaffTable";
import { ReportTime } from "../components/reporTime";

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
import DateRangeSelector from "../components/DateRangeSelector";
export default function ProcessChart() {
    const [date, setDate] = useState<DateRange | undefined>();
    return (
        <>
            {/* Thống kê Process */}
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
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
                                    <SelectGroup>
                                        {/* <SelectLabel>Fruits</SelectLabel> */}
                                        <SelectItem value="apple" className="text-lg">Nhóm 1</SelectItem>
                                        <SelectItem value="banana" className="text-lg">Nhóm 2</SelectItem>
                                        <SelectItem value="blueberry" className="text-lg">Nhóm 3</SelectItem>
                                        <SelectItem value="grapes" className="text-lg">Nhóm 4</SelectItem>
                                        <SelectItem value="pineapple" className="text-lg">Nhóm 5</SelectItem>
                                    </SelectGroup>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <ReportTime title={"Thống kê Process "} description={"12 nguyên công"} />
                {/* <OperatorTable title="Danh sách thống kê nhân viên" description="Tất cả các máy" /> */}
            </div >
        </>
    )

}
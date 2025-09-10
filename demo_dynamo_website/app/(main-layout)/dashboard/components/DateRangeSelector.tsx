"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear"
import isLeapYear from "dayjs/plugin/isLeapYear"   // ✅ thêm plugin này
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

dayjs.extend(isoWeek)
dayjs.extend(isoWeeksInYear)
dayjs.extend(isLeapYear)   // ✅ kích hoạt

type Mode = "day" | "week" | "month" | "year"

export default function DateRangeSelector() {
    const [mode, setMode] = useState<Mode>("day")
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
    const [selectedYear, setSelectedYear] = useState<number | null>(null)

    const getWeeksOfYear = (year: number) => {
        const weeks: { week: number; start: string; end: string }[] = []
        const totalWeeks = dayjs(`${year}-01-01`).isoWeeksInYear()

        for (let i = 1; i <= totalWeeks; i++) {
            const start = dayjs().year(year).isoWeek(i).startOf("isoWeek").format("DD/MM") // ✅ đầu tuần là Thứ 2
            const end = dayjs().year(year).isoWeek(i).endOf("isoWeek").format("DD/MM")     // ✅ cuối tuần là Chủ nhật
            weeks.push({ week: i, start, end })
        }
        return weeks
    }

    const weeks = getWeeksOfYear(dayjs().year())
    const months = Array.from({ length: 12 }, (_, i) => i + 1)

    return (
        <div className="flex gap-2">
            <Select value={mode} onValueChange={(val) => setMode(val as "day" | "week" | "month" | "year")}>
                <SelectTrigger className="w-[150px] bg-[#004799] px-4 !py-5.5 text-xl text-white cursor-pointer [&>svg]:!text-white">
                    <SelectValue placeholder="Chọn chế độ" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="day" className="text-lg">Ngày</SelectItem>
                    <SelectItem value="week" className="text-lg">Tuần</SelectItem>
                    <SelectItem value="month" className="text-lg">Tháng</SelectItem>
                    <SelectItem value="year" className="text-lg">Năm</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex-1">
                {mode === "day" && (
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer w-auto justify-start text-right text-xl font-normal bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white text-white "
                                >
                                    {selectedDate
                                        ? dayjs(selectedDate).format("DD/MM/YYYY")
                                        : "Chọn ngày"}
                                    <CalendarIcon className="h-5 w-5 opacity-90" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 ">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate ?? undefined}
                                    onSelect={(date) => setSelectedDate(date ?? null)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                {mode === "week" && (
                    <div className="w-full">
                        <Select onValueChange={(val) => setSelectedWeek(Number(val))}>
                            <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5  hover:text-white !text-white [&>svg]:!text-white">
                                <SelectValue placeholder="Chọn tuần" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {weeks.map((w) => (
                                    <SelectItem key={w.week} value={String(w.week)} className="text-lg">
                                        Tuần {w.week}: {w.start} - {w.end}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {mode === "month" && (
                    <div className="w-full">
                        <Select onValueChange={(val) => setSelectedMonth(Number(val))}>
                            <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white !text-white [&>svg]:!text-white">
                                <SelectValue placeholder="Chọn tháng" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {months.map((m) => (
                                    <SelectItem key={m} value={String(m)} className="text-lg">
                                        Tháng {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {mode === "year" && (
                    <div className="w-full">
                        <Select onValueChange={(val) => setSelectedYear(Number(val))}>
                            <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white !text-white [&>svg]:!text-white">
                                <SelectValue placeholder="Chọn năm" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {Array.from({ length: 3 }, (_, i) => dayjs().year() - (2 - i)).map((year) => (
                                    <SelectItem key={year} value={String(year)} className="text-lg">
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
        </div>
    )
}

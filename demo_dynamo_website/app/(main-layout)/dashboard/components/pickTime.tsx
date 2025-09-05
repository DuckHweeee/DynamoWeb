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

type Mode = "day" | "week" | "month"

export default function DateRangeSelector() {
    const [mode, setMode] = useState<Mode>("day")
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

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
            <Select value={mode} onValueChange={(val) => setMode(val as "day" | "week" | "month")}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Chọn chế độ" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="day">Ngày</SelectItem>
                    <SelectItem value="week">Tuần</SelectItem>
                    <SelectItem value="month">Tháng</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex-1">
                {mode === "day" && (
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-auto justify-start text-right font-normal text-xl"
                                >
                                    {selectedDate
                                        ? dayjs(selectedDate).format("DD/MM/YYYY")
                                        : "Chọn ngày"}
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
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
                        {/* <div className="border p-3 rounded-lg w-[300px]"> */}
                        <Select onValueChange={(val) => setSelectedWeek(Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tuần" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {weeks.map((w) => (
                                    <SelectItem key={w.week} value={String(w.week)}>
                                        Tuần {w.week}: {w.start} - {w.end}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* {selectedWeek && (
                            <p className="mt-3 text-lg font-semibold">
                                Tuần đã chọn: Tuần {selectedWeek} (
                                {weeks.find((w) => w.week === selectedWeek)?.start} -{" "}
                                {weeks.find((w) => w.week === selectedWeek)?.end})
                            </p>
                        )} */}
                    </div>
                )}

                {mode === "month" && (
                    // <div className="grid grid-cols-3 gap-2 border p-3 rounded-lg">
                    <div className="w-full">
                        <Select onValueChange={(val) => setSelectedMonth(Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tháng" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {months.map((m) => (
                                    <SelectItem key={m} value={String(m)}>
                                        Tháng {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* {selectedMonth && (
                            <p className="col-span-3 mt-3 text-lg font-semibold">
                                Tháng đã chọn: {selectedMonth}/{dayjs().year()}
                            </p>
                        )} */}
                    </div>
                )}
            </div>
        </div>
    )
}

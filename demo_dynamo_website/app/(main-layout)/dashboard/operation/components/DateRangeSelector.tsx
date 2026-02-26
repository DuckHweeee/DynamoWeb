"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear"
import isLeapYear from "dayjs/plugin/isLeapYear"
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
dayjs.extend(isLeapYear)

type Mode = "day" | "week" | "month" | "year"
type ShiftCode = "FULL" | "CA_NGAY" | "CA_DEM"

interface Props {
    onChange?: (range: { startDate: string; endDate: string; timeType: Mode; shiftCode: ShiftCode }) => void;
}

export default function DateRangeSelector({ onChange }: Props) {
    const [mode, setMode] = useState<Mode>("day")
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [selectedWeek, setSelectedWeek] = useState<number | null>(dayjs().isoWeek())
    const [selectedMonth, setSelectedMonth] = useState<number | null>(dayjs().month() + 1)
    const [selectedYear, setSelectedYear] = useState<number | null>(dayjs().year())
    const [shiftCode, setShiftType] = useState<ShiftCode>("FULL")

    const getWeeksOfYear = (year: number) => {
        const weeks: { week: number; start: string; end: string }[] = []
        const totalWeeks = dayjs(`${year}-01-01`).isoWeeksInYear()
        for (let i = 1; i <= totalWeeks; i++) {
            const start = dayjs().year(year).isoWeek(i).startOf("isoWeek").format("DD/MM")
            const end = dayjs().year(year).isoWeek(i).endOf("isoWeek").format("DD/MM")
            weeks.push({ week: i, start, end })
        }
        return weeks
    }

    const weeks = getWeeksOfYear(dayjs().year())
    const months = Array.from({ length: 12 }, (_, i) => i + 1)

    useEffect(() => {
        let startDate = "";
        let endDate = "";

        if (mode === "day" && selectedDate) {
            startDate = dayjs(selectedDate).format("YYYY-MM-DD");
            endDate = startDate;
        }

        if (mode === "week" && selectedWeek && selectedYear) {
            const start = dayjs().year(selectedYear).isoWeek(selectedWeek).startOf("isoWeek");
            const end = dayjs().year(selectedYear).isoWeek(selectedWeek).endOf("isoWeek");
            startDate = start.format("YYYY-MM-DD");
            endDate = end.format("YYYY-MM-DD");
        }

        if (mode === "month" && selectedMonth && selectedYear) {
            const start = dayjs().year(selectedYear).month(selectedMonth - 1).startOf("month");
            const end = dayjs().year(selectedYear).month(selectedMonth - 1).endOf("month");
            startDate = start.format("YYYY-MM-DD");
            endDate = end.format("YYYY-MM-DD");
        }

        if (mode === "year" && selectedYear) {
            const start = dayjs().year(selectedYear).startOf("year");
            const end = dayjs().year(selectedYear).endOf("year");
            startDate = start.format("YYYY-MM-DD");
            endDate = end.format("YYYY-MM-DD");
        }

        if (startDate && endDate) {
            const payload = {
                startDate,
                endDate,
                timeType: mode,
                shiftCode: shiftCode,
            }

            console.log("📤 DateRangeSelector payload:", payload)

            onChange?.(payload)
        }
    }, [mode, selectedDate, selectedWeek, selectedMonth, selectedYear, shiftCode])

    return (
        <div className="flex gap-3">
            <div className="space-y-1">
                <Select value={mode} onValueChange={(val) => setMode(val as Mode)}>
                    <SelectTrigger className="w-[175px] text-base cursor-pointer p-5 bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow text-white">
                        <SelectValue placeholder="Chọn chế độ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="day" className="text-lg cursor-pointer">Ngày</SelectItem>
                        <SelectItem value="week" className="text-lg cursor-pointer">Tuần</SelectItem>
                        <SelectItem value="month" className="text-lg cursor-pointer">Tháng</SelectItem>
                        <SelectItem value="year" className="text-lg cursor-pointer">Năm</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 flex-col gap-2">
                {mode === "day" && (
                    <div className="flex flex-col gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-[175px] text-base cursor-pointer p-5 bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow text-white justify-between text-right font-normal "                            >
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
                    <Select value={String(selectedWeek ?? "")} onValueChange={(val) => setSelectedWeek(Number(val))}>
                        <SelectTrigger className="w-auto text-base cursor-pointer p-5 bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow text-white">
                            <SelectValue placeholder="Chọn tuần" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {weeks.map((w) => (
                                <SelectItem
                                    key={w.week}
                                    value={String(w.week)}
                                    className={`text-lg cursor-pointer ${selectedWeek === w.week ? "bg-blue-100 text-blue-900" : ""}`}
                                >
                                    Tuần {w.week}: {w.start} - {w.end}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}


                {mode === "month" && (
                    <Select
                        value={String(selectedMonth ?? "")}
                        onValueChange={(val) => setSelectedMonth(Number(val))}
                    >
                        <SelectTrigger className="w-[175px] text-base cursor-pointer p-5 bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow text-white">
                            <SelectValue placeholder="Chọn tháng" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {months.map((m) => (
                                <SelectItem
                                    key={m}
                                    value={String(m)}
                                    className={`text-lg cursor-pointer ${selectedMonth === m ? "bg-blue-100 text-blue-900" : ""}`}
                                >
                                    Tháng {m}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {mode === "year" && (
                    <Select
                        value={String(selectedYear ?? "")}
                        onValueChange={(val) => setSelectedYear(Number(val))}
                    >
                        <SelectTrigger className="w-[175px] text-base cursor-pointer p-5 bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow text-white">
                            <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        {/* <SelectContent className="max-h-[300px]">
                            {Array.from({ length: 3 }, (_, i) => dayjs().year() - (2 - i)).map((year) => (
                                <SelectItem
                                    key={year}
                                    value={String(year)}
                                    className={`text-lg ${selectedYear === year ? "bg-blue-100 text-blue-900" : ""}`}
                                >
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent> */}
                        <SelectContent className="max-h-[300px]">
                            {Array.from({ length: 3 }, (_, i) => dayjs().year() - 2 + i).map((year) => (
                                <SelectItem key={year} value={String(year)} className="text-lg cursor-pointer">
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
            {/* <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 tracking-wide">Ca</label>
                <Select
                    value={shiftCode}
                    onValueChange={(val) => setShiftType(val as ShiftCode)}
                >
                    <SelectTrigger className="w-[150px] text-lg cursor-pointer">
                        <SelectValue placeholder="Chọn ca" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="FULL" className="text-lg cursor-pointer">
                            Cả ngày
                        </SelectItem>
                        <SelectItem value="CA_NGAY" className="text-lg cursor-pointer">
                            Ca ngày
                        </SelectItem>
                        <SelectItem value="CA_DEM" className="text-lg cursor-pointer">
                            Ca đêm
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div> */}
        </div>
    )
}


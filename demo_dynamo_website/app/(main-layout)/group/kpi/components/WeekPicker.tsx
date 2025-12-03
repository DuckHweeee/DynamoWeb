"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"

dayjs.extend(isoWeek)

interface WeekPickerProps {
    value?: number | null
    year?: number | null
    onSelect: (week: number) => void
    placeholder?: string
    disabled?: boolean
}

interface WeekInfo {
    weekNumber: number
    startDate: Date
    endDate: Date
    displayText: string
}

// ✅ Hàm tính số tuần ISO trong một năm
function getIsoWeeksInYear(year: number): number {
    const dec28 = dayjs(`${year}-12-28`) // Ngày 28/12 luôn nằm trong tuần cuối cùng của năm ISO
    return dec28.isoWeek()
}

export default function WeekPicker({
    value,
    year,
    onSelect,
    placeholder = "Chọn tuần...",
    disabled = false,
}: WeekPickerProps) {
    const [open, setOpen] = useState(false)
    const currentYear = year || new Date().getFullYear()

    // Lấy thông tin tuần dựa theo ISO
    const getWeekInfo = (weekNumber: number, year: number): WeekInfo => {
        const startDate = dayjs().year(year).isoWeek(weekNumber).startOf("isoWeek")
        const endDate = startDate.endOf("isoWeek")

        const formatDate = (date: dayjs.Dayjs) => date.format("DD/MM")

        return {
            weekNumber,
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            displayText: `Tuần ${weekNumber}: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        }
    }

    // ✅ Số tuần trong năm
    const weeksInYear = getIsoWeeksInYear(currentYear)
    const weeks = Array.from({ length: weeksInYear }, (_, i) => {
        const weekNumber = i + 1
        return getWeekInfo(weekNumber, currentYear)
    })

    const selectedWeek = value ? getWeekInfo(value, currentYear) : null

    const handleWeekSelect = (weekInfo: WeekInfo) => {
        onSelect(weekInfo.weekNumber)
        setOpen(false)
    }

    // Tuần hiện tại (ISO)
    const now = dayjs()
    const currentWeek = now.isoWeek()
    const isCurrentYear = currentYear === now.isoWeekYear()

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-9"
                        disabled={disabled}
                    >
                        {selectedWeek ? selectedWeek.displayText : placeholder}
                        <Calendar className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Chọn tuần cho năm {currentYear}</h4>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {isCurrentYear && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleWeekSelect(getWeekInfo(currentWeek, currentYear))}
                                    className="text-xs"
                                >
                                    Tuần hiện tại ({currentWeek})
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleWeekSelect(getWeekInfo(1, currentYear))}
                                className="text-xs"
                            >
                                Tuần đầu năm
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleWeekSelect(getWeekInfo(weeksInYear, currentYear))}
                                className="text-xs"
                            >
                                Tuần cuối năm
                            </Button>
                        </div>

                        {/* Week Grid */}
                        <div className="max-h-64 overflow-y-auto">
                            <div className="grid gap-1">
                                {weeks.map((weekInfo) => {
                                    const isSelected = value === weekInfo.weekNumber
                                    const isCurrent = isCurrentYear && currentWeek === weekInfo.weekNumber

                                    return (
                                        <Button
                                            key={weekInfo.weekNumber}
                                            variant={isSelected ? "default" : "ghost"}
                                            className={`w-full justify-start text-sm h-8 px-2 ${isCurrent && !isSelected ? "bg-blue-50 border-blue-200" : ""
                                                }`}
                                            onClick={() => handleWeekSelect(weekInfo)}
                                        >
                                            <span className={`font-medium mr-2 ${isCurrent ? "text-blue-600" : ""}`}>
                                                T{weekInfo.weekNumber}
                                                {isCurrent && " (hiện tại)"}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {weekInfo.displayText.split(": ")[1]}
                                            </span>
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                Tổng cộng {weeksInYear} tuần trong năm {currentYear}
                            </p>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

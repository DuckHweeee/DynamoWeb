"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
    value?: { day: number | null; month: number | null } | null
    year?: number | null
    onSelect: (day: number, month: number) => void
    placeholder?: string
    disabled?: boolean
}

export default function DatePicker({
    value,
    year,
    onSelect,
    placeholder = "Chọn ngày...",
    disabled = false
}: DatePickerProps) {
    const [open, setOpen] = useState(false)
    const currentYear = year || new Date().getFullYear()
    const currentDate = new Date()

    // Get days in month
    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate()
    }

    // Get month information
    const months = [
        { value: 1, label: "Tháng 1" },
        { value: 2, label: "Tháng 2" },
        { value: 3, label: "Tháng 3" },
        { value: 4, label: "Tháng 4" },
        { value: 5, label: "Tháng 5" },
        { value: 6, label: "Tháng 6" },
        { value: 7, label: "Tháng 7" },
        { value: 8, label: "Tháng 8" },
        { value: 9, label: "Tháng 9" },
        { value: 10, label: "Tháng 10" },
        { value: 11, label: "Tháng 11" },
        { value: 12, label: "Tháng 12" },
    ]

    const [selectedMonth, setSelectedMonth] = useState(value?.month || currentDate.getMonth() + 1)

    const handleDateSelect = (day: number, month: number) => {
        onSelect(day, month)
        setOpen(false)
    }

    const handleMonthChange = (month: number) => {
        setSelectedMonth(month)
    }

    // Quick actions
    const handleToday = () => {
        if (currentYear === currentDate.getFullYear()) {
            const today = currentDate.getDate()
            const currentMonth = currentDate.getMonth() + 1
            setSelectedMonth(currentMonth)
            handleDateSelect(today, currentMonth)
        }
    }

    // const formatDisplayValue = () => {
    //     if (value?.day && value?.month) {
    //         const monthName = months.find(m => m.value === value.month)?.short || value.month
    //         return `${value.day}/${monthName}/${currentYear}`
    //     }
    //     return null
    // }

    const formatDisplayValue = () => {
        if (value?.day && value?.month) {
            return `${String(value.day).padStart(2, "0")}/${String(value.month).padStart(2, "0")}/${currentYear}`
        }
        return null
    }

    // Generate calendar days
    const generateCalendarDays = (month: number, year: number) => {
        const daysInMonth = getDaysInMonth(month, year)
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Monday = 0

        const days = []

        // Add empty cells for days before month starts
        for (let i = 0; i < startDay; i++) {
            days.push(null)
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day)
        }

        return days
    }

    const calendarDays = generateCalendarDays(selectedMonth, currentYear)
    const isCurrentYear = currentYear === currentDate.getFullYear()
    const isCurrentMonth = selectedMonth === currentDate.getMonth() + 1
    const currentDay = currentDate.getDate()

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
                        {formatDisplayValue() || placeholder}
                        <Calendar className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                    <div className="p-4">
                        {/* Header with month navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMonthChange(selectedMonth === 1 ? 12 : selectedMonth - 1)}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h4 className="font-semibold">
                                {months.find(m => m.value === selectedMonth)?.label} {currentYear}
                            </h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMonthChange(selectedMonth === 12 ? 1 : selectedMonth + 1)}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Quick Actions */}
                        {isCurrentYear && (
                            <div className="mb-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleToday}
                                    className="text-xs w-full"
                                >
                                    Hôm nay ({currentDate.getDate()}/{currentDate.getMonth() + 1})
                                </Button>
                            </div>
                        )}

                        {/* Calendar Grid */}
                        <div className="space-y-2">
                            {/* Day headers */}
                            <div className="grid grid-cols-7 gap-1">
                                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                                    <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar days */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((day, index) => {
                                    if (day === null) {
                                        return <div key={index} className="p-2" />
                                    }

                                    const isSelected = value?.day === day && value?.month === selectedMonth
                                    const isToday = isCurrentYear && isCurrentMonth && day === currentDay

                                    return (
                                        <Button
                                            key={day}
                                            variant={isSelected ? "default" : "ghost"}
                                            size="sm"
                                            className={cn(
                                                "h-8 w-8 p-0 font-normal",
                                                isToday && !isSelected && "bg-blue-50 border-blue-200 text-blue-600"
                                            )}
                                            onClick={() => handleDateSelect(day, selectedMonth)}
                                        >
                                            {day}
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                Chọn ngày trong {months.find(m => m.value === selectedMonth)?.label} {currentYear}
                            </p>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

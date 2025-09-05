"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getWeeksInYear } from "../lib/utils"

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

export default function WeekPicker({ 
    value, 
    year, 
    onSelect, 
    placeholder = "Chọn tuần...",
    disabled = false 
}: WeekPickerProps) {
    const [open, setOpen] = useState(false)
    const currentYear = year || new Date().getFullYear()
    
    // Get week information for the selected year
    const getWeekInfo = (weekNumber: number, year: number): WeekInfo => {
        // Calculate the start date of the week (Monday)
        const firstDayOfYear = new Date(year, 0, 1)
        const firstMonday = new Date(firstDayOfYear)
        
        // Find the first Monday of the year
        const dayOfWeek = firstDayOfYear.getDay()
        const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek
        firstMonday.setDate(firstDayOfYear.getDate() + daysToMonday)
        
        // Calculate the start date of the requested week
        const startDate = new Date(firstMonday)
        startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7)
        
        // Calculate the end date (Sunday)
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        
        const formatDate = (date: Date) => {
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
        }
        
        const displayText = `Tuần ${weekNumber}: ${formatDate(startDate)} - ${formatDate(endDate)}`
        
        return {
            weekNumber,
            startDate,
            endDate,
            displayText
        }
    }
    
    const weeksInYear = getWeeksInYear(currentYear)
    const weeks = Array.from({ length: weeksInYear }, (_, i) => {
        const weekNumber = i + 1
        return getWeekInfo(weekNumber, currentYear)
    })
    
    const selectedWeek = value ? getWeekInfo(value, currentYear) : null
    
    const handleWeekSelect = (weekInfo: WeekInfo) => {
        onSelect(weekInfo.weekNumber)
        setOpen(false)
    }
    
        // Quick selection for current week and common periods
        const getCurrentWeek = () => {
            const now = new Date()
            if (now.getFullYear() !== currentYear) {
                return 1 // Default to week 1 if different year
            }
            const startOfYear = new Date(currentYear, 0, 1)
            const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
            return Math.ceil((dayOfYear + startOfYear.getDay()) / 7)
        }
        
        const currentWeek = getCurrentWeek()
        const isCurrentYear = currentYear === new Date().getFullYear()
        
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
                            {!isCurrentYear && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleWeekSelect(getWeekInfo(weeksInYear, currentYear))}
                                    className="text-xs"
                                >
                                    Tuần cuối năm
                                </Button>
                            )}
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
                                            className={`w-full justify-start text-sm h-8 px-2 ${
                                                isCurrent && !isSelected ? "bg-blue-50 border-blue-200" : ""
                                            }`}
                                            onClick={() => handleWeekSelect(weekInfo)}
                                        >
                                            <span className={`font-medium mr-2 ${isCurrent ? "text-blue-600" : ""}`}>
                                                T{weekInfo.weekNumber}:
                                                {isCurrent && " (hiện tại)"}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {weekInfo.displayText.split(': ')[1]}
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

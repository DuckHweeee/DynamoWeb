"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectYearProps {
    value?: string
    onChange: (value: string) => void
    startYear?: number // năm bắt đầu, mặc định là năm hiện tại
    totalYears?: number // tổng số năm
    placeholder?: string
}

export function SelectYear({
    value,
    onChange,
    startYear,
    totalYears = 6,
    placeholder = "Chọn năm",
}: SelectYearProps) {
    const baseYear = startYear || new Date().getFullYear()
    const years = Array.from({ length: totalYears }, (_, i) => (baseYear + i).toString())

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full text-lg [&>span]:text-[16px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year} className="text-lg">
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

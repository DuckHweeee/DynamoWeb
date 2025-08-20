"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectMonthProps {
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    showAllOption?: boolean // nếu muốn thêm "Tất cả"
}

const monthLabels = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
]

export function SelectMonth({
    value,
    onChange,
    placeholder = "Chọn tháng",
    // showAllOption = false,
}: SelectMonthProps) {
    const months = Array.from({ length: 12 }, (_, i) => ({
        label: monthLabels[i],
        value: (i + 1).toString(), // "1" đến "12" thay vì "01"
    }))

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full text-lg [&>span]:text-[16px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {/* {showAllOption && (
                    <SelectItem value="all">Tất cả các tháng</SelectItem>
                )} */}
                {months.map((month) => (
                    <SelectItem className="text-lg" key={month.value} value={month.value}>
                        {month.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

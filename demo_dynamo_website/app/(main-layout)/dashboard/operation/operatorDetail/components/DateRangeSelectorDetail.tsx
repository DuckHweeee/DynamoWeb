// "use client"

// import { useState, useEffect } from "react"
// import { Calendar } from "@/components/ui/calendar"
// import { Button } from "@/components/ui/button"
// import dayjs from "dayjs"
// import isoWeek from "dayjs/plugin/isoWeek"
// import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear"
// import isLeapYear from "dayjs/plugin/isLeapYear"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { CalendarIcon } from "lucide-react"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

// dayjs.extend(isoWeek)
// dayjs.extend(isoWeeksInYear)
// dayjs.extend(isLeapYear)

// type Mode = "day" | "week" | "month" | "year"

// interface Props {
//     startDate?: string
//     endDate?: string
//     onChange?: (range: { startDate: string; endDate: string }) => void
// }

// export default function DateRangeSelectorDetail({ startDate, endDate, onChange }: Props) {
//     const [mode, setMode] = useState<Mode>("day")

//     // sync state từ props
//     const [selectedDate, setSelectedDate] = useState<Date | null>(null)
//     const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
//     const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
//     const [selectedYear, setSelectedYear] = useState<number | null>(null)

//     const getWeeksOfYear = (year: number) => {
//         const weeks: { week: number; start: string; end: string }[] = []
//         const totalWeeks = dayjs(`${year}-01-01`).isoWeeksInYear()
//         for (let i = 1; i <= totalWeeks; i++) {
//             const start = dayjs().year(year).isoWeek(i).startOf("isoWeek").format("DD/MM")
//             const end = dayjs().year(year).isoWeek(i).endOf("isoWeek").format("DD/MM")
//             weeks.push({ week: i, start, end })
//         }
//         return weeks
//     }

//     const months = Array.from({ length: 12 }, (_, i) => i + 1)

//     // đồng bộ khi cha truyền props
//     useEffect(() => {
//         if (startDate && endDate) {
//             const start = dayjs(startDate)
//             const end = dayjs(endDate)

//             if (start.isSame(end, "day")) {
//                 setMode("day")
//                 setSelectedDate(start.toDate())
//             } else if (
//                 start.isSame(start.startOf("week"), "day") &&
//                 end.isSame(start.endOf("week"), "day")
//             ) {
//                 setMode("week")
//                 setSelectedYear(start.year())
//                 setSelectedWeek(start.isoWeek())
//             } else if (
//                 start.isSame(start.startOf("month"), "day") &&
//                 end.isSame(start.endOf("month"), "day")
//             ) {
//                 setMode("month")
//                 setSelectedYear(start.year())
//                 setSelectedMonth(start.month() + 1)
//             } else if (
//                 start.isSame(start.startOf("year"), "day") &&
//                 end.isSame(start.endOf("year"), "day")
//             ) {
//                 setMode("year")
//                 setSelectedYear(start.year())
//             }
//         }
//     }, [startDate, endDate])

//     // gọi onChange khi chọn lại
//     useEffect(() => {
//         let s = ""
//         let e = ""

//         if (mode === "day" && selectedDate) {
//             s = dayjs(selectedDate).format("YYYY-MM-DD")
//             e = s
//         }

//         if (mode === "week" && selectedWeek && selectedYear) {
//             const start = dayjs().year(selectedYear).isoWeek(selectedWeek).startOf("isoWeek")
//             const end = dayjs().year(selectedYear).isoWeek(selectedWeek).endOf("isoWeek")
//             s = start.format("YYYY-MM-DD")
//             e = end.format("YYYY-MM-DD")
//         }

//         if (mode === "month" && selectedMonth && selectedYear) {
//             const start = dayjs().year(selectedYear).month(selectedMonth - 1).startOf("month")
//             const end = dayjs().year(selectedYear).month(selectedMonth - 1).endOf("month")
//             s = start.format("YYYY-MM-DD")
//             e = end.format("YYYY-MM-DD")
//         }

//         if (mode === "year" && selectedYear) {
//             const start = dayjs().year(selectedYear).startOf("year")
//             const end = dayjs().year(selectedYear).endOf("year")
//             s = start.format("YYYY-MM-DD")
//             e = end.format("YYYY-MM-DD")
//         }

//         if (s && e && onChange) {
//             onChange({ startDate: s, endDate: e })
//         }
//     }, [mode, selectedDate, selectedWeek, selectedMonth, selectedYear, onChange])

//     const weeks = getWeeksOfYear(selectedYear ?? dayjs().year())

//     return (
//         <div className="flex gap-2">
//             <Select value={mode} onValueChange={(val) => setMode(val as Mode)}>
//                 <SelectTrigger className="w-[150px] bg-[#004799] px-4 !py-5.5 text-xl text-white cursor-pointer [&>svg]:!text-white">
//                     <SelectValue placeholder="Chọn chế độ" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="day" className="text-lg">Ngày</SelectItem>
//                     <SelectItem value="week" className="text-lg">Tuần</SelectItem>
//                     <SelectItem value="month" className="text-lg">Tháng</SelectItem>
//                     <SelectItem value="year" className="text-lg">Năm</SelectItem>
//                 </SelectContent>
//             </Select>

//             <div className="flex-1">
//                 {mode === "day" && (
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 className="cursor-pointer w-auto justify-start text-right text-xl font-normal bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white text-white "
//                             >
//                                 {selectedDate
//                                     ? dayjs(selectedDate).format("DD/MM/YYYY")
//                                     : "Chọn ngày"}
//                                 <CalendarIcon className="h-5 w-5 opacity-90" />
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0 ">
//                             <Calendar
//                                 mode="single"
//                                 selected={selectedDate ?? undefined}
//                                 onSelect={(date) => setSelectedDate(date ?? null)}
//                                 initialFocus
//                             />
//                         </PopoverContent>
//                     </Popover>
//                 )}

//                 {mode === "week" && (
//                     <Select
//                         value={selectedWeek ? String(selectedWeek) : undefined}
//                         onValueChange={(val) => setSelectedWeek(Number(val))}
//                     >
//                         <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5  hover:text-white !text-white [&>svg]:!text-white">
//                             <SelectValue placeholder="Chọn tuần" />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-[300px]">
//                             {weeks.map((w) => (
//                                 <SelectItem key={w.week} value={String(w.week)} className="text-lg">
//                                     Tuần {w.week}: {w.start} - {w.end}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 )}

//                 {mode === "month" && (
//                     <Select
//                         value={selectedMonth ? String(selectedMonth) : undefined}
//                         onValueChange={(val) => setSelectedMonth(Number(val))}
//                     >
//                         <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white !text-white [&>svg]:!text-white">
//                             <SelectValue placeholder="Chọn tháng" />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-[300px]">
//                             {months.map((m) => (
//                                 <SelectItem key={m} value={String(m)} className="text-lg">
//                                     Tháng {m}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 )}

//                 {mode === "year" && (
//                     <Select
//                         value={selectedYear ? String(selectedYear) : undefined}
//                         onValueChange={(val) => setSelectedYear(Number(val))}
//                     >
//                         <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white !text-white [&>svg]:!text-white">
//                             <SelectValue placeholder="Chọn năm" />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-[300px]">
//                             {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((year) => (
//                                 <SelectItem key={year} value={String(year)} className="text-lg">
//                                     {year}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 )}
//             </div>
//         </div>
//     )
// }


// Bản 2
// "use client"

// import { useState, useEffect } from "react"
// import { Calendar } from "@/components/ui/calendar"
// import { Button } from "@/components/ui/button"
// import dayjs from "dayjs"
// import isoWeek from "dayjs/plugin/isoWeek"
// import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear"
// import isLeapYear from "dayjs/plugin/isLeapYear"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { CalendarIcon } from "lucide-react"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

// dayjs.extend(isoWeek)
// dayjs.extend(isoWeeksInYear)
// dayjs.extend(isLeapYear)

// type Mode = "day" | "week" | "month" | "year"

// interface Props {
//     onChange?: (range: { startDate: string; endDate: string }) => void
// }

// export default function DateRangeSelectorDetail({ onChange }: Props) {
//     const [mode, setMode] = useState<Mode>("day")

//     const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
//     const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
//     const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
//     const [selectedYear, setSelectedYear] = useState<number | null>(dayjs().year())

//     const getWeeksOfYear = (year: number) => {
//         const weeks: { week: number; start: string; end: string }[] = []
//         const totalWeeks = dayjs(`${year}-01-01`).isoWeeksInYear()
//         for (let i = 1; i <= totalWeeks; i++) {
//             const start = dayjs().year(year).isoWeek(i).startOf("isoWeek").format("DD/MM")
//             const end = dayjs().year(year).isoWeek(i).endOf("isoWeek").format("DD/MM")
//             weeks.push({ week: i, start, end })
//         }
//         return weeks
//     }

//     const weeks = getWeeksOfYear(dayjs().year())
//     const months = Array.from({ length: 12 }, (_, i) => i + 1)

//     useEffect(() => {
//         let startDate = ""
//         let endDate = ""

//         if (mode === "day" && selectedDate) {
//             startDate = dayjs(selectedDate).format("YYYY-MM-DD")
//             endDate = startDate
//         }

//         if (mode === "week" && selectedWeek && selectedYear) {
//             const start = dayjs().year(selectedYear).isoWeek(selectedWeek).startOf("isoWeek")
//             const end = dayjs().year(selectedYear).isoWeek(selectedWeek).endOf("isoWeek")
//             startDate = start.format("YYYY-MM-DD")
//             endDate = end.format("YYYY-MM-DD")
//         }

//         if (mode === "month" && selectedMonth && selectedYear) {
//             const start = dayjs().year(selectedYear).month(selectedMonth - 1).startOf("month")
//             const end = dayjs().year(selectedYear).month(selectedMonth - 1).endOf("month")
//             startDate = start.format("YYYY-MM-DD")
//             endDate = end.format("YYYY-MM-DD")
//         }

//         if (mode === "year" && selectedYear) {
//             const start = dayjs().year(selectedYear).startOf("year")
//             const end = dayjs().year(selectedYear).endOf("year")
//             startDate = start.format("YYYY-MM-DD")
//             endDate = end.format("YYYY-MM-DD")
//         }

//         if (startDate && endDate && onChange) {
//             onChange({ startDate, endDate })
//         }
//     }, [mode, selectedDate, selectedWeek, selectedMonth, selectedYear, onChange])

//     return (
//         <div className="flex gap-2">
//             <Select value={mode} onValueChange={(val) => setMode(val as Mode)}>
//                 <SelectTrigger className="w-[150px] bg-[#004799] px-4 !py-5.5 text-xl text-white cursor-pointer [&>svg]:!text-white">
//                     <SelectValue placeholder="Chọn chế độ" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="day" className="text-lg">Ngày</SelectItem>
//                     <SelectItem value="week" className="text-lg">Tuần</SelectItem>
//                     <SelectItem value="month" className="text-lg">Tháng</SelectItem>
//                     <SelectItem value="year" className="text-lg">Năm</SelectItem>
//                 </SelectContent>
//             </Select>

//             <div className="flex-1">
//                 {mode === "day" && (
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 className="cursor-pointer w-auto justify-start text-right text-xl font-normal bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white text-white "
//                             >
//                                 {selectedDate
//                                     ? dayjs(selectedDate).format("DD/MM/YYYY")
//                                     : "Chọn ngày"}
//                                 <CalendarIcon className="h-5 w-5 opacity-90" />
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0 ">
//                             <Calendar
//                                 mode="single"
//                                 selected={selectedDate ?? undefined}
//                                 onSelect={(date) => setSelectedDate(date ?? null)}
//                                 initialFocus
//                             />
//                         </PopoverContent>
//                     </Popover>
//                 )}

//                 {mode === "week" && (
//                     <Select onValueChange={(val) => setSelectedWeek(Number(val))}>
//                         <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5  hover:text-white !text-white [&>svg]:!text-white">
//                             <SelectValue placeholder="Chọn tuần" />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-[300px]">
//                             {weeks.map((w) => (
//                                 <SelectItem key={w.week} value={String(w.week)} className="text-lg">
//                                     Tuần {w.week}: {w.start} - {w.end}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 )}

//                 {mode === "month" && (
//                     <Select onValueChange={(val) => setSelectedMonth(Number(val))}>
//                         <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white !text-white [&>svg]:!text-white">
//                             <SelectValue placeholder="Chọn tháng" />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-[300px]">
//                             {months.map((m) => (
//                                 <SelectItem key={m} value={String(m)} className="text-lg">
//                                     Tháng {m}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 )}

//                 {mode === "year" && (
//                     <Select onValueChange={(val) => setSelectedYear(Number(val))}>
//                         <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white !text-white [&>svg]:!text-white">
//                             <SelectValue placeholder="Chọn năm" />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-[300px]">
//                             {Array.from({ length: 3 }, (_, i) => dayjs().year() - (2 - i)).map((year) => (
//                                 <SelectItem key={year} value={String(year)} className="text-lg">
//                                     {year}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 )}
//             </div>
//         </div>
//     )
// }


// Bản 3
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

interface Props {
    startDate?: string
    endDate?: string
    onChange?: (range: { startDate: string; endDate: string }) => void
}

export default function DateRangeSelectorDetail({ startDate, endDate, onChange }: Props) {
    const [mode, setMode] = useState<Mode>("day")

    // Khởi tạo state với giá trị từ props hoặc mặc định
    const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
        startDate ? dayjs(startDate).toDate() : null
    );
    const [selectedWeek, setSelectedWeek] = useState<number | null>(() =>
        startDate ? dayjs(startDate).isoWeek() : null
    );
    const [selectedMonth, setSelectedMonth] = useState<number | null>(() =>
        startDate ? dayjs(startDate).month() + 1 : null
    );
    const [selectedYear, setSelectedYear] = useState<number | null>(() =>
        startDate ? dayjs(startDate).year() : null
    );

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

    const months = Array.from({ length: 12 }, (_, i) => i + 1)

    // đồng bộ khi cha truyền props
    useEffect(() => {
        if (startDate && endDate) {
            const start = dayjs(startDate);
            const end = dayjs(endDate);

            // Kiểm tra ngày
            if (start.isSame(end, 'day')) {
                setMode('day');
                setSelectedDate(start.toDate());
                return;
            }

            // Kiểm tra tuần
            const weekStart = start.startOf('isoWeek');
            const weekEnd = start.endOf('isoWeek');
            if (start.isSame(weekStart, 'day') && end.isSame(weekEnd, 'day')) {
                setMode('week');
                setSelectedYear(start.year());
                setSelectedWeek(start.isoWeek());
                return;
            }

            // Kiểm tra tháng
            const monthStart = start.startOf('month');
            const monthEnd = start.endOf('month');
            if (start.isSame(monthStart, 'day') && end.isSame(monthEnd, 'day')) {
                setMode('month');
                setSelectedYear(start.year());
                setSelectedMonth(start.month() + 1);
                return;
            }

            // Kiểm tra năm
            const yearStart = start.startOf('year');
            const yearEnd = start.endOf('year');
            if (start.isSame(yearStart, 'day') && end.isSame(yearEnd, 'day')) {
                setMode('year');
                setSelectedYear(start.year());
            }
        }
    }, [startDate, endDate])

    // gọi onChange khi chọn lại
    useEffect(() => {
        let s = ""
        let e = ""

        if (mode === "day" && selectedDate) {
            s = dayjs(selectedDate).format("YYYY-MM-DD")
            e = s
        }

        if (mode === "week" && selectedWeek && selectedYear) {
            const start = dayjs().year(selectedYear).isoWeek(selectedWeek).startOf("isoWeek")
            const end = dayjs().year(selectedYear).isoWeek(selectedWeek).endOf("isoWeek")
            s = start.format("YYYY-MM-DD")
            e = end.format("YYYY-MM-DD")
        }

        if (mode === "month" && selectedMonth && selectedYear) {
            const start = dayjs().year(selectedYear).month(selectedMonth - 1).startOf("month")
            const end = dayjs().year(selectedYear).month(selectedMonth - 1).endOf("month")
            s = start.format("YYYY-MM-DD")
            e = end.format("YYYY-MM-DD")
        }

        if (mode === "year" && selectedYear) {
            const start = dayjs().year(selectedYear).startOf("year")
            const end = dayjs().year(selectedYear).endOf("year")
            s = start.format("YYYY-MM-DD")
            e = end.format("YYYY-MM-DD")
        }

        if (s && e && onChange) {
            onChange({ startDate: s, endDate: e })
        }
    }, [mode, selectedDate, selectedWeek, selectedMonth, selectedYear, onChange])

    const weeks = getWeeksOfYear(selectedYear ?? dayjs().year())

    return (
        <div className="flex gap-2">
            <Select value={mode} onValueChange={(val) => setMode(val as Mode)}>
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
                )}

                {mode === "week" && (
                    <Select
                        value={selectedWeek ? String(selectedWeek) : undefined}
                        onValueChange={(val) => setSelectedWeek(Number(val))}
                    >
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
                )}

                {mode === "month" && (
                    <Select
                        value={selectedMonth ? String(selectedMonth) : undefined}
                        onValueChange={(val) => setSelectedMonth(Number(val))}
                    >
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
                )}

                {mode === "year" && (
                    <Select
                        value={selectedYear ? String(selectedYear) : undefined}
                        onValueChange={(val) => setSelectedYear(Number(val))}
                    >
                        <SelectTrigger className="cursor-pointer text-xl bg-[#004799] hover:bg-[#004799] px-4 !py-5.5 hover:text-white !text-white [&>svg]:!text-white">
                            <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((year) => (
                                <SelectItem key={year} value={String(year)} className="text-lg">
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    )
}

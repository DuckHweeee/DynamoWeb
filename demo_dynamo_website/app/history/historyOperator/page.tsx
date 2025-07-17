'use client';

import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

export default function DateRangePicker() {
    const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
        from: new Date(2025, 5, 13), // tháng 6
        to: new Date(2025, 6, 15),   // tháng 7
    });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "flex items-center space-x-2 bg-[#004799] text-white px-4 py-2 rounded-full hover:bg-[#003b80] transition"
                    )}
                >
                    <Calendar className="w-5 h-5" />
                    {/* <Calendar
                        mode="single"
                        defaultMonth={date}
                        numberOfMonths={2}
                        selected={date}
                        onSelect={setDate}
                        className="rounded-lg border shadow-sm"
                    /> */}
                    <span>
                        {date?.from ? format(date.from, "MMM dd, yyyy") : "Start"} -{" "}
                        {date?.to ? format(date.to, "MMM dd, yyyy") : "End"}
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="flex gap-4 p-4 !w-full" align="start">
                <DatePicker
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}

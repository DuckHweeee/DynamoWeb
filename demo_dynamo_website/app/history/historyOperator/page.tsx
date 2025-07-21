'use client';

import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import OperatorTable from "./component/operatorTable";

export default function DateRangePicker() {
    return (
        <div className="mx-2 bg-white p-4 rounded-md shadow-sm">
            <OperatorTable title={"Lịch sử vận hành"} description={""} />
        </div>

    );
}

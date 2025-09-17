"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MonitorDot, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ReportTimeMachine({ title, description }: { title: string; description: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedMachine, setSelectedMachine] = useState<string>("");
    const [selectedMachineName, setSelectedMachineName] = useState<string>("");

    // Mock machine list data - replace with actual data from your API
    const machineList = [
        { id: 1, name: "Máy CNC" },
        { id: 4, name: "Máy Phay" },
        { id: 6, name: "Máy Tiện" },
        { id: 8, name: "Máy Khoan" },
        { id: 10, name: "Máy Mài" },
        { id: 12, name: "Máy Ép" }
    ];

    // Get current filter values from URL params
    const selectedStartDate = searchParams.get('startDate');
    const selectedEndDate = searchParams.get('endDate');
    const selectedGroup = searchParams.get('groupId');
    const selectedMode = searchParams.get('mode');
    const selectedWeek = searchParams.get('week');
    const selectedMonth = searchParams.get('month');
    const selectedYear = searchParams.get('year');

    const handleMachineSelection = (machineId: string) => {
        const machine = machineList.find(m => m.id === parseInt(machineId));
        if (machine) {
            setSelectedMachine(machineId);
            setSelectedMachineName(machine.name);

            // Create URL with current filter params
            const newSearchParams = new URLSearchParams();
            
            // Preserve existing filter parameters
            if (selectedStartDate) newSearchParams.set('startDate', selectedStartDate);
            if (selectedEndDate) newSearchParams.set('endDate', selectedEndDate);
            if (selectedGroup) newSearchParams.set('groupId', selectedGroup);
            if (selectedMode) newSearchParams.set('mode', selectedMode);
            if (selectedWeek) newSearchParams.set('week', selectedWeek);
            if (selectedMonth) newSearchParams.set('month', selectedMonth);
            if (selectedYear) newSearchParams.set('year', selectedYear);
            
            // Add machine-specific parameters
            newSearchParams.set('machineId', machineId);
            newSearchParams.set('machineName', machine.name);

            // Navigate to individual machine dashboard
            router.push(`/dashboard/machine/${machineId}?${newSearchParams.toString()}`);
        }
    };
    return (
        <>
            <div className="flex flex-row items-center justify-between mt-2">
                <p className="text-3xl font-semibold">{title}</p>
                <Select
                    value={selectedMachine}
                    onValueChange={handleMachineSelection}
                >
                    <SelectTrigger className="w-fit text-xl px-4 !py-5.5 rounded-md  transition ">
                        <SelectValue
                            placeholder={`Tổng số: ${machineList?.length || 0} máy`}
                        >
                            {selectedMachineName || `Tổng số: ${machineList?.length || 0} máy`}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {machineList?.map((machine) => (
                                <SelectItem
                                    className="text-xl text-blue-950"
                                    key={machine.id}
                                    value={String(machine.id)}
                                >
                                    {machine.name}
                                </SelectItem>
                            )) || []}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="my-5 flex gap-3 items-center justify-between">
                <div className="inline-block rounded-sm bg-white px-5 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-red-500 text-lg font-medium">-3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">2h 30m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Chạy Tháng
                            <TrendingDown size={14} className="ml-1 text-red-500" />
                        </p>
                        <p className="text-sm text-gray-400">30 phút / máy</p>
                    </div>
                </div>

                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-red-500 text-lg font-medium">-3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">5h 35m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Dừng Tháng
                            <TrendingDown size={14} className="ml-1 text-red-500" />
                        </p>
                        <p className="text-sm text-gray-400">45 phút / máy</p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-lg font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">6h 45m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Lỗi Tháng
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        <p className="text-sm text-gray-400">1 giờ / máy</p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-lg font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">8h 30m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ PG Tháng
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        <p className="text-sm text-gray-400">1 giờ 15 phút / máy</p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-lg font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">36</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Số Gia Công Tháng
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        <p className="text-sm text-gray-400">3 số gia công / máy</p>
                    </div>
                </div>

            </div>
        </>
    )
}
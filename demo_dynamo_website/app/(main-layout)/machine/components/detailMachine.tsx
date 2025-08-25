"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Machine2 } from "@/lib/type"
import { SelectYear } from "./SelectYear"
import { SelectMonth } from "./SelectMonth"
import { KPI } from "../lib/type"
import { useMachineKPI } from "../hooks/useMachine"

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type DetailMachineFormProps = {
    onCancel: () => void
    machine: Machine2
}
export default function DetailMachineForm({
    onCancel,
    machine
}: DetailMachineFormProps) {
    const { data: machineKPI } = useMachineKPI()
    const machineId = machine.machineId;

    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [displayKPI, setDisplayKPI] = useState<KPI | null>(null);

    // Lấy năm và tháng lần đầu load
    useEffect(() => {
        if (machine.machineKpiDtos && !selectedYear && !selectedMonth) {
            setSelectedYear(String(machine.machineKpiDtos.year));
            setSelectedMonth(String(machine.machineKpiDtos.month));
        }
    }, [machine, selectedYear, selectedMonth]);

    // Dữ liệu ban đầu
    useEffect(() => {
        if (machine.machineKpiDtos) {
            setDisplayKPI({
                machineName: String(machine.machineName),
                machineId: Number(machine.machineId),
                groupId: String(machine.machineKpiDtos.groupId),
                groupName: String(machine.machineKpiDtos.groupName),
                year: Number(machine.machineKpiDtos.year),
                month: Number(machine.machineKpiDtos.month),
                machineMiningTarget: Number(machine.machineKpiDtos.machineMiningTarget),
                oee: Number(machine.machineKpiDtos.oee),
                createdDate: machine.machineKpiDtos.createdDate,
                updatedDate: machine.machineKpiDtos.updatedDate,
                id: Number(machine.machineKpiDtos.id)
            });
        }
    }, [machine]);

    // Cập nhật thông khi chọn tháng/năm
    useEffect(() => {
        if (selectedYear && selectedMonth) {
            const kpiFound = machineKPI.find(
                (item) =>
                    item.year.toString() === selectedYear &&
                    item.month.toString() === selectedMonth &&
                    item.machineId === machineId
            );
            setDisplayKPI(kpiFound || null);
        } else {
            setDisplayKPI(null);
        }
    }, [selectedYear, selectedMonth, machineKPI, machineId]);

    return (
        <>
            {/* Màng hinh nhỏ bằng laptop */}
            <div className="hidden max-[1550px]:block">
                <div className="grid gap-3 w-full pb-5">
                    <div className="grid gap-7">
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin máy</div>
                            <div className="grid gap-4 grid-cols-2">
                                <div className="grid">
                                    <Label htmlFor="name" className="text-lg !font-normal">Tên máy</Label>
                                    <Input
                                        id="name"
                                        value={String(machine.machineName) ?? ""}
                                        readOnly
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="machineOffice" className="text-lg !font-normal">Phòng quản lý</Label>
                                    <Input
                                        id="machineOffice"
                                        value={String(machine.machineOffice) ?? ""}
                                        readOnly
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="machineType" className="text-lg !font-normal">Loại máy</Label>
                                    <Input
                                        id="machineType"
                                        readOnly
                                        value={machine?.machineType ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="machineWork" className="text-lg !font-normal">Công việc</Label>
                                    <Input
                                        id="machineWork"
                                        readOnly
                                        value={machine.machineWork?.toLowerCase() ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mục tiêu máy */}
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu máy</div>
                            <div className="grid gap-4 grid-cols-3 pb-3">
                                <div className="grid">
                                    <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                    <Input
                                        id="nhom"
                                        readOnly
                                        value={displayKPI?.groupName ?? ""}
                                        className="!text-lg placeholder:text-[16px] capitalize"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="year" className="text-lg !font-normal">
                                        Năm
                                    </Label>
                                    <SelectYear
                                        value={selectedYear}
                                        onChange={(value) => setSelectedYear(value)}
                                        totalYears={5}
                                        placeholder="Chọn năm"
                                    />

                                </div>
                                <div className="grid">
                                    <Label htmlFor="month" className="text-lg !font-normal">Tháng</Label>
                                    <SelectMonth
                                        value={selectedMonth}
                                        onChange={(value) => setSelectedMonth(value)}
                                    // showAllOption={true}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 grid-cols-2">
                                <div className="grid">
                                    <Label htmlFor="kpi" className="text-lg !font-normal">Mục tiêu khai thác máy</Label>
                                    <Input
                                        id="kpi"
                                        placeholder=""
                                        type="number"
                                        inputMode="numeric"
                                        value={displayKPI?.machineMiningTarget ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="workGoal" className="text-lg !font-normal">OEE</Label>
                                    <Input
                                        id="kpi"
                                        placeholder=""
                                        type="number"
                                        inputMode="numeric"
                                        value={displayKPI?.oee ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Màng hinh lớn hơn laptop */}
            <div className="hidden min-[1550px]:block">
                <div className="grid gap-3 w-full pb-8">
                    <div className="grid gap-7">
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin máy</div>
                            <div className="grid gap-4 grid-cols-2">
                                <div className="grid">
                                    <Label htmlFor="name" className="text-lg !font-normal">Tên máy</Label>
                                    <Input
                                        id="name"
                                        value={String(machine.machineName) ?? ""}
                                        readOnly
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="machineOffice" className="text-lg !font-normal">Phòng quản lý</Label>
                                    <Input
                                        id="machineOffice"
                                        value={String(machine.machineOffice) ?? ""}
                                        readOnly
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="machineType" className="text-lg !font-normal">Loại máy</Label>
                                    <Input
                                        id="machineType"
                                        readOnly
                                        value={machine?.machineType ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="machineWork" className="text-lg !font-normal">Công việc</Label>
                                    <Input
                                        id="machineWork"
                                        readOnly
                                        value={machine.machineWork?.toLowerCase() ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mục tiêu máy */}
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu máy</div>
                            <div className="grid gap-4 grid-cols-3 pb-3">
                                <div className="grid">
                                    <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                    <Input
                                        id="nhom"
                                        readOnly
                                        value={displayKPI?.groupName ?? ""}
                                        className="!text-lg placeholder:text-[16px] capitalize"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="year" className="text-lg !font-normal">
                                        Năm
                                    </Label>
                                    <SelectYear
                                        value={selectedYear}
                                        onChange={(value) => setSelectedYear(value)}
                                        totalYears={5}
                                        placeholder="Chọn năm"
                                    />

                                </div>
                                <div className="grid">
                                    <Label htmlFor="month" className="text-lg !font-normal">Tháng</Label>
                                    <SelectMonth
                                        value={selectedMonth}
                                        onChange={(value) => setSelectedMonth(value)}
                                    // showAllOption={true}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 grid-cols-2">
                                <div className="grid">
                                    <Label htmlFor="kpi" className="text-lg !font-normal">Mục tiêu khai thác máy</Label>
                                    <Input
                                        id="kpi"
                                        placeholder=""
                                        type="number"
                                        inputMode="numeric"
                                        value={displayKPI?.machineMiningTarget ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="workGoal" className="text-lg !font-normal">OEE</Label>
                                    <Input
                                        id="kpi"
                                        placeholder=""
                                        type="number"
                                        inputMode="numeric"
                                        value={displayKPI?.oee ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

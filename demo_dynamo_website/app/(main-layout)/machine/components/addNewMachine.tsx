"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { Machine2 } from "@/lib/type"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectYear } from "./SelectYear"
import { SelectMonth } from "./SelectMonth"
import { useGroup } from "../hooks/useMachine"
import { officeList } from "../lib/data"
import { NewMachine } from "../lib/type"

type AddMachineFormProps = {
    onAdd: (machine: Machine2) => void
    onCancel: () => void
}
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AddMachineForm({ onAdd, onCancel }: AddMachineFormProps) {
    const { data: group, loading, error } = useGroup()
    const [newMachine, setNewMachine] = useState<NewMachine>({
        machineName: "",
        machineType: "",
        machineWork: "",
        machineOffice: "",
        groupId: "",
        groupName: "",
        year: null,
        month: null,
        machineMiningTarget: null,
        oee: null
    })

    const handleSubmit = async () => {
        // Kiểm tra thông tin bắt buộc
        if (
            !newMachine.machineName.trim() ||
            !newMachine.machineOffice ||
            !newMachine.machineType.trim() ||
            !newMachine.machineWork.trim()
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin máy.");
            return;
        }
        // Kiểm tra thông tin bắt buộc
        if (
            newMachine.groupId === null ||
            newMachine.year === null ||
            newMachine.month === null ||
            newMachine.machineMiningTarget === null ||
            newMachine.oee === null
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin mục tiêu máy.");
            return;
        }
        try {
            const response = await fetch(
                `${urlLink}/api/machine`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        machineName: newMachine.machineName,
                        machineType: newMachine.machineType,
                        machineWork: newMachine.machineWork,
                        machineOffice: newMachine.machineOffice,
                        groupId: newMachine.groupId,
                        year: newMachine.year,
                        month: newMachine.month,
                        machineMiningTarget: newMachine.machineMiningTarget,
                        oee: newMachine.oee
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Thêm máy thành công!");
            location.reload()
            onCancel();
            setNewMachine({
                machineName: "",
                machineType: "",
                machineWork: "",
                machineOffice: "",
                groupId: "",
                groupName: "",
                year: null,
                month: null,
                machineMiningTarget: null,
                oee: null
            });
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    return (
        <div className="grid gap-3 w-full h-full">
            <div className="grid gap-7">
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin máy</div>
                    <div className="grid gap-4 grid-cols-2">
                        <div className="grid">
                            <Label htmlFor="name" className="text-lg !font-normal">Tên máy</Label>
                            <Input
                                id="name"
                                placeholder="Tên máy"
                                value={newMachine.machineName}
                                onChange={(e) => setNewMachine({ ...newMachine, machineName: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="nhom" className="text-lg !font-normal">Phòng quản lý</Label>
                            <Select
                                value={newMachine.machineOffice?.toString() ?? ""}
                                onValueChange={(value) => setNewMachine({ ...newMachine, machineOffice: value })}
                            >
                                <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
                                    <SelectValue placeholder="Chọn phòng quản lý" />
                                </SelectTrigger>
                                <SelectContent id="nhom">
                                    <SelectGroup>
                                        {officeList.map((g) => (
                                            <SelectItem className="text-lg" key={g.name} value={g.name.toString()}>
                                                {g.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid">
                            <Label htmlFor="shortName" className="text-lg !font-normal">Loại máy</Label>
                            <Input
                                id="shortName"
                                placeholder="Loại máy"
                                value={newMachine.machineType}
                                onChange={(e) => setNewMachine({ ...newMachine, machineType: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="phong_ban" className="text-lg !font-normal">Công Việc</Label>
                            <Input
                                id="phong_ban"
                                placeholder="Công Việc"
                                value={newMachine.machineWork}
                                onChange={(e) => setNewMachine({ ...newMachine, machineWork: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                    </div>
                </div>

                {/* Mục tiêu nhân viên */}
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu</div>
                    <div className="grid gap-4 grid-cols-3 pb-3">
                        <div className="grid">
                            <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                            <Select
                                value={newMachine.groupId?.toString() ?? ""}
                                onValueChange={(value) => setNewMachine({ ...newMachine, groupId: value })}
                            >
                                <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent id="nhom">
                                    <SelectGroup>
                                        {group.map((g) => (
                                            <SelectItem className="text-lg" key={g.groupId} value={g.groupId.toString()}>
                                                {g.groupName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid">
                            <Label htmlFor="year" className="text-lg !font-normal">Năm</Label>
                            <SelectYear
                                value={newMachine.year?.toString() ?? undefined}
                                onChange={(value) =>
                                    setNewMachine({ ...newMachine, year: Number(value) })
                                }
                                totalYears={5}
                                placeholder="Chọn năm"
                            />
                        </div>
                        <div className="grid">
                            <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                            <SelectMonth
                                value={newMachine.month?.toString() ?? undefined}
                                onChange={(value) =>
                                    setNewMachine({ ...newMachine, month: Number(value) })
                                }
                            // showAllOption={true}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                        <div className="grid">
                            <Label htmlFor="kpi" className="text-lg !font-normal">Mục tiêu khai thác máy</Label>
                            <Input
                                id="kpi"
                                placeholder="Mục tiêu khai thác máy"
                                type="number"
                                inputMode="numeric"
                                value={newMachine.machineMiningTarget !== null ? newMachine.machineMiningTarget.toString() : ""}
                                onChange={(e) =>
                                    setNewMachine({
                                        ...newMachine,
                                        machineMiningTarget: e.target.value === "" ? null : Number(e.target.value),
                                    })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="workGoal" className="text-lg !font-normal">OEE</Label>
                            <Input
                                id="kpi"
                                placeholder="OEE"
                                type="number"
                                inputMode="numeric"
                                value={newMachine.oee !== null ? newMachine.oee.toString() : ""}
                                onChange={(e) =>
                                    setNewMachine({
                                        ...newMachine,
                                        oee: e.target.value === "" ? null : Number(e.target.value),
                                    })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-2 justify-end">
                <Button
                    className="text-xl py-6 px-10 cursor-pointer"
                    variant="outline"
                    onClick={onCancel}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer">
                    Lưu
                </Button>
            </div>
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Machine2 } from "@/lib/type"
import { useGroup, useMachineById } from "../../../../hooks/useMachine"
import { UpdateMachine } from "../lib/type"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { officeList } from "../lib/data"
import { toast } from "sonner"
type EditMachineFormProps = {
    onUpdate: (updated: Machine2) => void
    onCancel: () => void
    machineId: number
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function EditMachineForm({
    onUpdate,
    onCancel,
    machineId,
}: EditMachineFormProps) {
    const { data: machineWithKPI } = useMachineById(machineId)
    const [updateMachine, setUpdateMachine] = useState<UpdateMachine>({
        machineName: "",
        machineType: "",
        machineWork: "",
        machineOffice: "",
        year: null,
        month: null,
        groupId: "",
        groupName: "",
        machineMiningTarget: null,
        oee: null
    })
    useEffect(() => {
        if (machineWithKPI) {
            setUpdateMachine({
                machineName: machineWithKPI.machineName ?? "",
                machineType: machineWithKPI.machineType ?? "",
                machineWork: machineWithKPI.machineWork ?? "",
                machineOffice: machineWithKPI.machineOffice ?? "",
                year: machineWithKPI.machineKpiDtos.year ?? null,
                month: machineWithKPI.machineKpiDtos.month ?? null,
                groupId: machineWithKPI.machineKpiDtos.groupId ?? null,
                groupName: machineWithKPI.machineKpiDtos.groupName ?? null,
                machineMiningTarget: machineWithKPI.machineKpiDtos.machineMiningTarget ?? null,
                oee: machineWithKPI.machineKpiDtos.oee ?? null
            })
        }
    }, [machineWithKPI])

    const handleUpdate = async () => {
        // Kiểm tra thông tin bắt buộc
        if (
            !updateMachine.machineName.trim() ||
            !updateMachine.machineOffice ||
            !updateMachine.machineType.trim() ||
            !updateMachine.machineWork.trim()
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin máy.");
            return;
        }


        // Kiểm tra thông tin bắt buộc
        if (
            updateMachine.groupId === null ||
            updateMachine.year === null ||
            updateMachine.month === null ||
            updateMachine.machineMiningTarget === null ||
            updateMachine.oee === null
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin mục tiêu máy.");
            return;
        }

        try {
            const response = await fetch(
                `${url}/api/machine/${machineId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        machineName: updateMachine.machineName,
                        machineType: updateMachine.machineType,
                        machineWork: updateMachine.machineWork,
                        machineOffice: updateMachine.machineOffice,
                        groupId: updateMachine.groupId,
                        year: updateMachine.year,
                        month: updateMachine.month,
                        machineMiningTarget: updateMachine.machineMiningTarget,
                        oee: updateMachine.oee
                    }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Chỉnh sửa thành công!");
            location.reload()
            onCancel();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    }

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
                                value={updateMachine.machineName}
                                onChange={(e) => setUpdateMachine({ ...updateMachine, machineName: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="cong_viec" className="text-lg !font-normal">Phòng quản lý</Label>
                            <Select
                                value={updateMachine.machineOffice?.toLowerCase() ?? ""}
                                onValueChange={(value) =>
                                    setUpdateMachine({ ...updateMachine, machineOffice: value })
                                }
                            >
                                <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent id="nhom">
                                    <SelectGroup>
                                        {officeList.map((g) => (
                                            <SelectItem
                                                className="text-lg"
                                                key={g.name}
                                                value={g.name.toLowerCase()}
                                            >
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
                                value={updateMachine.machineType}
                                onChange={(e) => setUpdateMachine({ ...updateMachine, machineType: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="phong_ban" className="text-lg !font-normal">Công Việc</Label>
                            <Input
                                id="phong_ban"
                                placeholder="Công Việc"
                                value={updateMachine.machineWork}
                                onChange={(e) => setUpdateMachine({ ...updateMachine, machineWork: e.target.value })}
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
                            <Input
                                value={updateMachine.groupName?.toString() ?? ""}
                                readOnly
                                className="!text-lg placeholder:text-[16px]"
                            >
                            </Input>
                        </div>
                        <div className="grid">
                            <Label htmlFor="year" className="text-lg !font-normal">Năm</Label>
                            <Input
                                value={updateMachine.year?.toString() ?? ""}
                                readOnly
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>
                        <div className="grid">
                            <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                            <Input
                                value={updateMachine.month?.toString() ?? ""}
                                readOnly
                                className="!text-lg placeholder:text-[16px]"
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
                                value={updateMachine.machineMiningTarget !== null ? updateMachine.machineMiningTarget.toString() : ""}
                                onChange={(e) =>
                                    setUpdateMachine({
                                        ...updateMachine,
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
                                value={updateMachine.oee !== null ? updateMachine.oee.toString() : ""}
                                onChange={(e) =>
                                    setUpdateMachine({
                                        ...updateMachine,
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
                    onClick={handleUpdate}
                    className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer">
                    Lưu
                </Button>
                <Button
                    className="text-xl py-6 px-10 cursor-pointer"
                    variant="outline"
                    onClick={onCancel}>
                    Hủy
                </Button>
            </div>
        </div>
    )
}

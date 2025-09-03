"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Staff } from "@/lib/type"
import { KPI } from "../../lib/type"

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type EditKPIMachineFormProps = {
    onUpdate: (updated: Staff) => void
    onCancel: () => void
    inforKPI: KPI
}
interface EditKPIMachine {
    year: number | null,
    month: number | null,
    oee: number | null,
    machineMiningTarget: number | null,
    machineId: number | null,
    groupId: string
}
export default function EditKPIMachineForm({
    onUpdate,
    onCancel,
    inforKPI,
}: EditKPIMachineFormProps) {
    const [updateMachine, setUpdateMachine] = useState<EditKPIMachine>({
        year: null,
        month: null,
        oee: null,
        machineMiningTarget: null,
        machineId: null,
        groupId: ""
    })

    useEffect(() => {
        if (inforKPI) {
            setUpdateMachine({
                machineId: inforKPI.machineId ?? "",
                year: inforKPI.year ?? null,
                month: inforKPI.month ?? null,
                oee: inforKPI.oee ?? null,
                machineMiningTarget: inforKPI.machineMiningTarget ?? null,
                groupId: inforKPI.groupId?.toString() ?? "",
            })
        }
    }, [inforKPI])

    const handleUpdate = async () => {
        // Kiểm tra thông tin bắt buộc của Staff
        if (
            !updateMachine.year ||
            !updateMachine.month ||
            !updateMachine.oee ||
            !updateMachine.machineMiningTarget ||
            !updateMachine.machineId ||
            !updateMachine.groupId
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            console.log("updateStaff")
            console.log(updateMachine)
            alert("ahihi")
            const response = await fetch(
                `${urlLink}/api/machine-kpi/${inforKPI.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        year: updateMachine.year,
                        month: updateMachine.month,
                        oee: updateMachine.oee,
                        machineMiningTarget: updateMachine.machineMiningTarget,
                        machineId: updateMachine.machineId,
                        machineStatus: 0,
                        groupId: updateMachine.groupId,
                    }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại");
            }
            toast.success("Chỉnh sửa thành công!");
            location.reload()
            onCancel();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    }


    return (
        <>
            {/* Màng hinh nhỏ bằng laptop */}
            <div className="hidden max-[1550px]:block">
                <div className="grid gap-3 w-full">
                    <div className="grid gap-3 px-3 relative rounded-sm border-2 pt-5 pb-6">
                        <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2 ml-2">Thông tin máy</div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="grid">
                                <Label htmlFor="staffName" className="text-lg !font-normal">Tên máy</Label>
                                <Input
                                    id="staffName"
                                    placeholder="Tên nhân viên"
                                    readOnly
                                    value={inforKPI.machineName?.toString() ?? ""}
                                    className="!text-lg placeholder:text-[16px]"
                                />
                            </div>

                            <div className="grid">
                                <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                <Input
                                    id="nhom"
                                    placeholder="Nhóm"
                                    readOnly
                                    value={inforKPI.groupName?.toString() ?? ""}
                                    className="!text-lg placeholder:text-[16px]"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-2 pb-3">
                            <div className="grid">
                                <Label htmlFor="name" className="text-lg !font-normal">
                                    Năm
                                </Label>
                                <Input
                                    type="number"
                                    value={inforKPI.year ?? ""}
                                    placeholder="Năm"
                                    readOnly
                                    className="placeholder:text-[10px] !text-xl"
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                <Input
                                    type="number"
                                    value={inforKPI.month ?? ""}
                                    readOnly
                                    placeholder="Tháng"
                                    className="placeholder:text-[10px] !text-lg"
                                />
                            </div>
                        </div>
                        <div className="grid gap-5 grid-cols-2">
                            <div className="grid">
                                <Label htmlFor="kpi" className="text-lg !font-normal">Mục tiêu khai thác máy</Label>
                                <Input
                                    id="kpi"
                                    className="!text-lg"
                                    placeholder="Mục tiêu khai thác máy"
                                    type="number"
                                    inputMode="numeric"
                                    value={updateMachine.machineMiningTarget ?? ""}
                                    onChange={(e) =>
                                        setUpdateMachine({ ...updateMachine, machineMiningTarget: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="workGoal" className="text-lg !font-normal">OEE</Label>
                                <Input
                                    id="workGoal"
                                    placeholder="OEE"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateMachine.oee ?? ""}
                                    onChange={(e) =>
                                        setUpdateMachine({ ...updateMachine, oee: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {/* Nút */}
                    <div className="flex justify-end ">
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                                Hủy
                            </Button>
                            <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-7 cursor-pointer">
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Màng hinh lớn hơn laptop */}
            <div className="hidden min-[1550px]:block">
                <div className="grid gap-3 w-full">
                    <div className="grid gap-3 px-3 relative rounded-sm border-2 pt-5 pb-6">
                        <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2 ml-2">Thông tin máy</div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="grid">
                                <Label htmlFor="staffName" className="text-lg !font-normal">Tên máy</Label>
                                <Input
                                    id="staffName"
                                    placeholder="Tên nhân viên"
                                    readOnly
                                    value={inforKPI.machineName?.toString() ?? ""}
                                    className="!text-lg placeholder:text-[16px]"
                                />
                            </div>

                            <div className="grid">
                                <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                <Input
                                    id="nhom"
                                    placeholder="Nhóm"
                                    readOnly
                                    value={inforKPI.groupName?.toString() ?? ""}
                                    className="!text-lg placeholder:text-[16px]"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-2 pb-3">
                            <div className="grid">
                                <Label htmlFor="name" className="text-lg !font-normal">
                                    Năm
                                </Label>
                                <Input
                                    type="number"
                                    value={inforKPI.year ?? ""}
                                    placeholder="Năm"
                                    readOnly
                                    className="placeholder:text-[10px] !text-xl"
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                <Input
                                    type="number"
                                    value={inforKPI.month ?? ""}
                                    readOnly
                                    placeholder="Tháng"
                                    className="placeholder:text-[10px] !text-lg"
                                />
                            </div>
                        </div>
                        <div className="grid gap-5 grid-cols-2">
                            <div className="grid">
                                <Label htmlFor="kpi" className="text-lg !font-normal">Mục tiêu khai thác máy</Label>
                                <Input
                                    id="kpi"
                                    className="!text-lg"
                                    placeholder="Mục tiêu khai thác máy"
                                    type="number"
                                    inputMode="numeric"
                                    value={updateMachine.machineMiningTarget ?? ""}
                                    onChange={(e) =>
                                        setUpdateMachine({ ...updateMachine, machineMiningTarget: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="workGoal" className="text-lg !font-normal">OEE</Label>
                                <Input
                                    id="workGoal"
                                    placeholder="OEE"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateMachine.oee ?? ""}
                                    onChange={(e) =>
                                        setUpdateMachine({ ...updateMachine, oee: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {/* Nút */}
                    <div className="flex justify-end ">
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                                Hủy
                            </Button>
                            <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-7 cursor-pointer">
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

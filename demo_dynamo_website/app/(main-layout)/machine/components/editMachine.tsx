"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Machine2 } from "@/lib/type"
import { useMachineById } from "../../../../hooks/useMachine"
import { UpdateMachine } from "../lib/type"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { officeList } from "../lib/data"
import { toast } from "sonner"
import { 
    validateEditMachine, 
    EditMachineFormData,
    validateMachineName,
    validateMachineType,
    validateMachineWork,
    validateMachineOffice,
    validateMachineGroupId,
    validateMachineYear,
    validateMachineMonth,
    validateMachineMiningTarget,
    validateMachineOEE
} from "../lib/validation"
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

    // Validation errors state
    const [errors, setErrors] = useState<{[key: string]: string | null}>({})

    // Function to update field and validate
    const updateField = (field: keyof UpdateMachine, value: any) => {
        setUpdateMachine(prev => ({ ...prev, [field]: value }))
        
        // Validate field immediately
        let error: string | null = null
        switch (field) {
            case 'machineName':
                error = validateMachineName(value)
                break
            case 'machineType':
                error = validateMachineType(value)
                break
            case 'machineWork':
                error = validateMachineWork(value)
                break
            case 'machineOffice':
                error = validateMachineOffice(value)
                break
            case 'groupId':
                error = validateMachineGroupId(value)
                break
            case 'year':
                error = validateMachineYear(value)
                break
            case 'month':
                error = validateMachineMonth(value)
                break
            case 'machineMiningTarget':
                error = validateMachineMiningTarget(value)
                break
            case 'oee':
                error = validateMachineOEE(value)
                break
        }
        
        setErrors(prev => ({ ...prev, [field]: error }))
    }
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
        // Validate all fields individually first
        const fieldValidations = {
            machineName: validateMachineName(updateMachine.machineName),
            machineType: validateMachineType(updateMachine.machineType),
            machineWork: validateMachineWork(updateMachine.machineWork),
            machineOffice: validateMachineOffice(updateMachine.machineOffice),
            machineMiningTarget: validateMachineMiningTarget(updateMachine.machineMiningTarget),
            oee: validateMachineOEE(updateMachine.oee),
        }

        // Check for any validation errors
        const hasErrors = Object.values(fieldValidations).some(error => error !== null)
        
        if (hasErrors) {
            // Update errors state with all validation results
            setErrors(fieldValidations)
            return
        }

        // All fields validated - now prepare data for submission
        // Since validation passed, we know all required fields have valid values
        const dataToSubmit = {
            machineName: updateMachine.machineName.trim(),
            machineType: updateMachine.machineType.trim(),
            machineWork: updateMachine.machineWork.trim(),
            machineOffice: updateMachine.machineOffice,
            groupId: updateMachine.groupId,
            year: updateMachine.year!,
            month: updateMachine.month!,
            machineMiningTarget: updateMachine.machineMiningTarget!,
            oee: updateMachine.oee!
        }

        try {
            const response = await fetch(
                `${url}/api/machine/${machineId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSubmit),
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
                                onChange={(e) => updateField('machineName', e.target.value)}
                                className={`!text-lg placeholder:text-[16px] ${errors.machineName ? 'border-red-500' : ''}`}
                            />
                            {errors.machineName && (
                                <span className="text-red-500 text-sm">{errors.machineName}</span>
                            )}
                        </div>

                        <div className="grid">
                            <Label htmlFor="cong_viec" className="text-lg !font-normal">Phòng quản lý</Label>
                            <Select
                                value={updateMachine.machineOffice?.toLowerCase() ?? ""}
                                onValueChange={(value) => updateField('machineOffice', value)}
                            >
                                <SelectTrigger className={`w-auto text-lg [&>span]:text-[16px] ${errors.machineOffice ? 'border-red-500' : ''}`}>
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
                            {errors.machineOffice && (
                                <span className="text-red-500 text-sm">{errors.machineOffice}</span>
                            )}
                        </div>

                        <div className="grid">
                            <Label htmlFor="shortName" className="text-lg !font-normal">Loại máy</Label>
                            <Input
                                id="shortName"
                                placeholder="Loại máy"
                                value={updateMachine.machineType}
                                onChange={(e) => updateField('machineType', e.target.value)}
                                className={`!text-lg placeholder:text-[16px] ${errors.machineType ? 'border-red-500' : ''}`}
                            />
                            {errors.machineType && (
                                <span className="text-red-500 text-sm">{errors.machineType}</span>
                            )}
                        </div>

                        <div className="grid">
                            <Label htmlFor="phong_ban" className="text-lg !font-normal">Công Việc</Label>
                            <Input
                                id="phong_ban"
                                placeholder="Công Việc"
                                value={updateMachine.machineWork}
                                onChange={(e) => updateField('machineWork', e.target.value)}
                                className={`!text-lg placeholder:text-[16px] ${errors.machineWork ? 'border-red-500' : ''}`}
                            />
                            {errors.machineWork && (
                                <span className="text-red-500 text-sm">{errors.machineWork}</span>
                            )}
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
                                onChange={(e) => updateField('machineMiningTarget', e.target.value === "" ? null : Number(e.target.value))}
                                className={`!text-lg placeholder:text-[16px] ${errors.machineMiningTarget ? 'border-red-500' : ''}`}
                            />
                            {errors.machineMiningTarget && (
                                <span className="text-red-500 text-sm">{errors.machineMiningTarget}</span>
                            )}
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="workGoal" className="text-lg !font-normal">OEE</Label>
                            <Input
                                id="kpi"
                                placeholder="OEE"
                                type="number"
                                inputMode="numeric"
                                value={updateMachine.oee !== null ? updateMachine.oee.toString() : ""}
                                onChange={(e) => updateField('oee', e.target.value === "" ? null : Number(e.target.value))}
                                className={`!text-lg placeholder:text-[16px] ${errors.oee ? 'border-red-500' : ''}`}
                            />
                            {errors.oee && (
                                <span className="text-red-500 text-sm">{errors.oee}</span>
                            )}
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

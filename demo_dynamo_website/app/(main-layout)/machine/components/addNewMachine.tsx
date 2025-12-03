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
import { useGroup } from "../../../../hooks/useMachine"
import { officeList } from "../lib/data"
import { NewMachine } from "../lib/type"
import { 
    validateNewMachine, 
    NewMachineFormData,
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

    // Validation errors state
    const [errors, setErrors] = useState<{[key: string]: string | null}>({})

    // Function to update field and validate
    const updateField = (field: keyof NewMachine, value: any) => {
        setNewMachine(prev => ({ ...prev, [field]: value }))
        
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

    const handleSubmit = async () => {
        // Validate all fields individually first
        const fieldValidations = {
            machineName: validateMachineName(newMachine.machineName),
            machineType: validateMachineType(newMachine.machineType),
            machineWork: validateMachineWork(newMachine.machineWork),
            machineOffice: validateMachineOffice(newMachine.machineOffice),
            groupId: validateMachineGroupId(newMachine.groupId),
            year: validateMachineYear(newMachine.year),
            month: validateMachineMonth(newMachine.month),
            machineMiningTarget: validateMachineMiningTarget(newMachine.machineMiningTarget),
            oee: validateMachineOEE(newMachine.oee),
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
            machineName: newMachine.machineName.trim(),
            machineType: newMachine.machineType.trim(),
            machineWork: newMachine.machineWork.trim(),
            machineOffice: newMachine.machineOffice,
            groupId: newMachine.groupId,
            year: newMachine.year!,
            month: newMachine.month!,
            machineMiningTarget: newMachine.machineMiningTarget!,
            oee: newMachine.oee!
        }

        try {
            const response = await fetch(
                `${urlLink}/api/machine`,
                {
                    method: "POST",
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
            setErrors({})
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
                                onChange={(e) => updateField('machineName', e.target.value)}
                                className={`!text-lg placeholder:text-[16px] ${errors.machineName ? 'border-red-500' : ''}`}
                            />
                            {errors.machineName && (
                                <span className="text-red-500 text-sm">{errors.machineName}</span>
                            )}
                        </div>

                        <div className="grid">
                            <Label htmlFor="nhom" className="text-lg !font-normal">Phòng quản lý</Label>
                            <Select
                                value={newMachine.machineOffice?.toString() ?? ""}
                                onValueChange={(value) => updateField('machineOffice', value)}
                            >
                                <SelectTrigger className={`w-auto text-lg [&>span]:text-[16px] ${errors.machineOffice ? 'border-red-500' : ''}`}>
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
                            {errors.machineOffice && (
                                <span className="text-red-500 text-sm">{errors.machineOffice}</span>
                            )}
                        </div>

                        <div className="grid">
                            <Label htmlFor="shortName" className="text-lg !font-normal">Loại máy</Label>
                            <Input
                                id="shortName"
                                placeholder="Loại máy"
                                value={newMachine.machineType}
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
                                value={newMachine.machineWork}
                                onChange={(e) => updateField('machineWork', e.target.value)}
                                className={`!text-lg placeholder:text-[16px] ${errors.machineWork ? 'border-red-500' : ''}`}
                            />
                            {errors.machineWork && (
                                <span className="text-red-500 text-sm">{errors.machineWork}</span>
                            )}
                        </div>

                    </div>
                </div>

                {/* Mục tiêu Máy */}
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu máy</div>
                    <div className="grid gap-4 grid-cols-3 pb-3">
                        <div className="grid">
                            <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                            <Select
                                value={newMachine.groupId?.toString() ?? ""}
                                onValueChange={(value) => updateField('groupId', value)}
                            >
                                <SelectTrigger className={`w-auto text-lg [&>span]:text-[16px] ${errors.groupId ? 'border-red-500' : ''}`}>
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
                            {errors.groupId && (
                                <span className="text-red-500 text-sm">{errors.groupId}</span>
                            )}
                        </div>
                        <div className="grid">
                            <Label htmlFor="year" className="text-lg !font-normal">Năm</Label>
                            <SelectYear
                                value={newMachine.year?.toString() ?? undefined}
                                onChange={(value) => updateField('year', Number(value))}
                                totalYears={5}
                                placeholder="Chọn năm"
                            />
                            {errors.year && (
                                <span className="text-red-500 text-sm">{errors.year}</span>
                            )}
                        </div>
                        <div className="grid">
                            <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                            <SelectMonth
                                value={newMachine.month?.toString() ?? undefined}
                                onChange={(value) => updateField('month', Number(value))}
                            // showAllOption={true}
                            />
                            {errors.month && (
                                <span className="text-red-500 text-sm">{errors.month}</span>
                            )}
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
                                value={newMachine.oee !== null ? newMachine.oee.toString() : ""}
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

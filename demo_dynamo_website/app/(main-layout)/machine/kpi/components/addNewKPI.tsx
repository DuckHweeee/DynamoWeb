"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { SelectYear } from "../../components/SelectYear"
import { SelectMonth } from "../../components/SelectMonth"
import { FlexibleCombobox } from "./FlexibleCombobox"
import { useGroup, useMachine } from "../../../../../hooks/useMachine"
import { KPI } from "../../lib/type"
import { 
    validateMachineKPIYear, 
    validateMachineKPIMonth, 
    validateMachineKPIOEE, 
    validateMachineKPIMachineMiningTarget, 
    validateMachineKPIMachineId, 
    validateMachineKPIGroupId,
    machineKPISchema 
} from "../lib/validation"
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type AddKPIMachineFormProps = {
    onAdd: (staff: KPI) => void
    onCancel: () => void
}
interface NewKPIMachine {
    year: number | null,
    month: number | null,
    oee: number | null,
    machineMiningTarget: number | null,
    machineId: number | null,
    groupId: string
}

export default function AddNewKPI({ onAdd, onCancel }: AddKPIMachineFormProps) {
    const [newKPIMachine, setNewKPIMachine] = useState<NewKPIMachine>({
        year: null,
        month: null,
        oee: null,
        machineMiningTarget: null,
        machineId: null,
        groupId: ""
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const updateField = (field: keyof NewKPIMachine, value: any) => {
        setNewKPIMachine(prev => ({ ...prev, [field]: value }))
        
        // Validate field immediately
        let fieldError = ""
        switch (field) {
            case 'year':
                fieldError = validateMachineKPIYear(value) || ""
                break
            case 'month':
                fieldError = validateMachineKPIMonth(value) || ""
                break
            case 'oee':
                fieldError = validateMachineKPIOEE(value) || ""
                break
            case 'machineMiningTarget':
                fieldError = validateMachineKPIMachineMiningTarget(value) || ""
                break
            case 'machineId':
                fieldError = validateMachineKPIMachineId(value) || ""
                break
            case 'groupId':
                fieldError = validateMachineKPIGroupId(value) || ""
                break
        }
        
        setErrors(prev => ({
            ...prev,
            [field]: fieldError
        }))
    }
    const handleSubmit = async () => {
        // Validate all fields before submission
        const validationErrors: Record<string, string> = {}
        
        const yearError = validateMachineKPIYear(newKPIMachine.year)
        if (yearError) validationErrors.year = yearError
        
        const monthError = validateMachineKPIMonth(newKPIMachine.month)
        if (monthError) validationErrors.month = monthError
        
        const oeeError = validateMachineKPIOEE(newKPIMachine.oee)
        if (oeeError) validationErrors.oee = oeeError
        
        const machineMiningTargetError = validateMachineKPIMachineMiningTarget(newKPIMachine.machineMiningTarget)
        if (machineMiningTargetError) validationErrors.machineMiningTarget = machineMiningTargetError
        
        const machineIdError = validateMachineKPIMachineId(newKPIMachine.machineId)
        if (machineIdError) validationErrors.machineId = machineIdError
        
        const groupIdError = validateMachineKPIGroupId(newKPIMachine.groupId)
        if (groupIdError) validationErrors.groupId = groupIdError

        // If there are validation errors, set them and return
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            toast.error("Vui lòng kiểm tra và sửa các lỗi trong biểu mẫu")
            return
        }

        // Final schema validation
        try {
            machineKPISchema.parse(newKPIMachine)
        } catch (error) {
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.")
            return
        }

        try {
            const response = await fetch(
                `${urlLink}/api/machine-kpi`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        year: newKPIMachine.year,
                        month: newKPIMachine.month,
                        oee: newKPIMachine.oee,
                        machineMiningTarget: newKPIMachine.machineMiningTarget,
                        machineId: newKPIMachine.machineId,
                        machineStatus: 0,
                        groupId: newKPIMachine.groupId,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Thêm KPI thành công!");
            location.reload()
            onCancel();
            setNewKPIMachine({
                year: null,
                month: null,
                oee: null,
                machineMiningTarget: null,
                machineId: null,
                groupId: "",
            });
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    const { data: group } = useGroup()
    const { data: machine } = useMachine()

    return (
        <div className="grid gap-3 w-full">
            {/* <div className="grid gap-8"> */}
            <div className="grid gap-2 px-3 relative rounded-sm border-2 pt-5 pb-6 ">
                <div className="text-2xl pb-1 font-medium !top-[-20] absolute bg-white px-1 ml-2">Thông tin mục tiêu</div>
                <div className="grid gap-4 grid-cols-2">
                    <div className="grid">
                        <Label htmlFor="machineId" className="text-lg !font-normal">Tên Máy</Label>
                        <FlexibleCombobox
                            options={machine || []}
                            value={newKPIMachine.machineId ? String(newKPIMachine.machineId) : ""}
                            onChange={(val) => updateField('machineId', Number(val))}
                            displayField="machineName"
                            valueField="machineId"
                            placeholder="Chọn máy"
                            allowCustom={false}
                        />
                        {errors.machineId && (
                            <span className="text-red-500 text-sm">{errors.machineId}</span>
                        )}
                    </div>

                    <div className="grid">
                        <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                        <Select
                            value={newKPIMachine.groupId?.toString() ?? ""}
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
                </div>
                <div className="grid gap-4 grid-cols-2 pb-3">
                    <div className="grid">
                        <Label htmlFor="year" className="text-lg !font-normal">Năm</Label>
                        <SelectYear
                            value={newKPIMachine.year?.toString() ?? undefined}
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
                            value={newKPIMachine.month?.toString() ?? undefined}
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
                        <Label htmlFor="machineMiningTarget" className="text-lg !font-normal">Mục tiêu khai thác máy</Label>
                        <Input
                            id="machineMiningTarget"
                            placeholder="Mục tiêu khai thác máy"
                            type="number"
                            inputMode="numeric"
                            value={newKPIMachine.machineMiningTarget !== null ? newKPIMachine.machineMiningTarget.toString() : ""}
                            onChange={(e) => updateField('machineMiningTarget', e.target.value === "" ? null : Number(e.target.value))}
                            className={`!text-lg placeholder:text-[16px] ${errors.machineMiningTarget ? 'border-red-500' : ''}`}
                        />
                        {errors.machineMiningTarget && (
                            <span className="text-red-500 text-sm">{errors.machineMiningTarget}</span>
                        )}
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="oee" className="text-lg !font-normal">OEE</Label>
                        <Input
                            className={`!text-lg placeholder:text-[16px] ${errors.oee ? 'border-red-500' : ''}`}
                            id="oee"
                            placeholder="OEE"
                            type="number"
                            inputMode="numeric"
                            value={newKPIMachine.oee !== null ? newKPIMachine.oee.toString() : ""}
                            onChange={(e) => updateField('oee', e.target.value === "" ? null : Number(e.target.value))}
                        />
                        {errors.oee && (
                            <span className="text-red-500 text-sm">{errors.oee}</span>
                        )}
                    </div>
                </div>
            </div>
            {/* </div> */}
            <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} className="text-xl bg-[#074695] hover:bg-[#0754B4] py-6 px-10 cursor-pointer">
                    Lưu
                </Button>

            </div>
        </div>
    )
}






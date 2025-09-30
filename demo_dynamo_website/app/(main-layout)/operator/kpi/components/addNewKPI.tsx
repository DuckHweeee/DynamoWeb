"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Staff } from "@/lib/type"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useGroup } from "../../hooks/useStaff"
import { SelectYear } from "../../components/SelectYear"
import { SelectMonth } from "../../components/SelectMonth"
import { officeList } from "../../lib/data"
import { KPI } from "../lib/type"
import { FlexibleCombobox } from "./FlexibleCombobox"
import { useStaff } from "../hooks/useStaff"
import {
    validateStaffKPI,
    StaffKPIFormData,
    validateStaffKPIStaffId,
    validateStaffKPIGroupId,
    validateStaffKPIYear,
    validateStaffKPIMonth,
    validateStaffKPIKPI,
    validateStaffKPIWorkGoal,
    validateStaffKPIPgTimeGoal,
    validateStaffKPIMachineTimeGoal,
    validateStaffKPIManufacturingPoint,
    validateStaffKPIOleGoal
} from "../lib/validation"
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type AddKPIStaffFormProps = {
    onAdd: (staff: KPI) => void
    onCancel: () => void
}
interface NewKPIStaff {
    year: number | null,
    month: number | null,
    pgTimeGoal: number | null,
    machineTimeGoal: number | null,
    manufacturingPoint: number | null,
    oleGoal: number | null,
    workGoal: number | null,
    kpi: number | null,
    groupId: string
    staffId: string,
}

export default function AddNewKPI({ onAdd, onCancel }: AddKPIStaffFormProps) {
    const [newKPIStaff, setNewKPIStaff] = useState<NewKPIStaff>({
        staffId: "",
        kpi: null,
        year: null,
        month: null,
        workGoal: null,
        pgTimeGoal: null,
        machineTimeGoal: null,
        manufacturingPoint: null,
        oleGoal: null,
        groupId: ""
    })

    // Validation errors state
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({})

    // Function to update field and validate
    const updateField = (field: keyof NewKPIStaff, value: any) => {
        setNewKPIStaff(prev => ({ ...prev, [field]: value }))

        // Validate field immediately
        let error: string | null = null
        switch (field) {
            case 'staffId':
                error = validateStaffKPIStaffId(value)
                break
            case 'groupId':
                error = validateStaffKPIGroupId(value)
                break
            case 'year':
                error = validateStaffKPIYear(value)
                break
            case 'month':
                error = validateStaffKPIMonth(value)
                break
            case 'kpi':
                error = validateStaffKPIKPI(value)
                break
            case 'workGoal':
                error = validateStaffKPIWorkGoal(value)
                break
            case 'pgTimeGoal':
                error = validateStaffKPIPgTimeGoal(value)
                break
            case 'machineTimeGoal':
                error = validateStaffKPIMachineTimeGoal(value)
                break
            case 'manufacturingPoint':
                error = validateStaffKPIManufacturingPoint(value)
                break
            case 'oleGoal':
                error = validateStaffKPIOleGoal(value)
                break
        }

        setErrors(prev => ({ ...prev, [field]: error }))
    }
    const handleSubmit = async () => {
        // Validate all fields individually first
        const fieldValidations = {
            staffId: validateStaffKPIStaffId(newKPIStaff.staffId),
            groupId: validateStaffKPIGroupId(newKPIStaff.groupId),
            year: validateStaffKPIYear(newKPIStaff.year),
            month: validateStaffKPIMonth(newKPIStaff.month),
            kpi: validateStaffKPIKPI(newKPIStaff.kpi),
            workGoal: validateStaffKPIWorkGoal(newKPIStaff.workGoal),
            pgTimeGoal: validateStaffKPIPgTimeGoal(newKPIStaff.pgTimeGoal),
            machineTimeGoal: validateStaffKPIMachineTimeGoal(newKPIStaff.machineTimeGoal),
            manufacturingPoint: validateStaffKPIManufacturingPoint(newKPIStaff.manufacturingPoint),
            oleGoal: validateStaffKPIOleGoal(newKPIStaff.oleGoal),
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
            staffId: newKPIStaff.staffId,
            kpi: newKPIStaff.kpi!,
            year: newKPIStaff.year!,
            month: newKPIStaff.month!,
            workGoal: newKPIStaff.workGoal!,
            pgTimeGoal: newKPIStaff.pgTimeGoal!,
            machineTimeGoal: newKPIStaff.machineTimeGoal!,
            manufacturingPoint: newKPIStaff.manufacturingPoint!,
            oleGoal: newKPIStaff.oleGoal!,
            groupId: newKPIStaff.groupId,
        }

        try {

            const response = await fetch(
                `${urlLink}/api/staff-kpi`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSubmit),
                }
            );

            if (!response.ok) {
                let errorMessage = "Gửi thất bại.";

                try {
                    const errorData = await response.json();
                    // Use the backend message directly
                    errorMessage = errorData.message || errorData.error || "Gửi thất bại.";
                } catch (parseError) {
                    // If JSON parsing fails, use status text
                    errorMessage = response.statusText || `Lỗi ${response.status}`;
                }
                if (errorMessage === "Goal of this staff is already set") {
                    toast.error("Nhân viên này đã có KPI!");
                }
                return; // Don't proceed further
            }
            toast.success("Thêm nhân viên và KPI thành công!");
            location.reload()
            onCancel();
            setNewKPIStaff({
                staffId: "",
                kpi: null,
                year: null,
                month: null,
                workGoal: null,
                pgTimeGoal: null,
                machineTimeGoal: null,
                manufacturingPoint: null,
                oleGoal: null,
                groupId: "",
            });
            setErrors({})
        } catch (error) {
            console.error("Network or unexpected error:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    const { data: group, loading, error } = useGroup()
    const { data: staff } = useStaff()

    return (
        <div className="grid gap-3 w-full">
            {/* <div className="grid gap-8"> */}
            <div className="grid gap-2 px-3 relative rounded-sm border-2 pt-5 pb-6 ">
                <div className="text-2xl pb-1 font-medium !top-[-20] absolute bg-white px-1 ml-2">Thông tin mục tiêu</div>
                <div className="grid gap-4 grid-cols-2">
                    <div className="grid">
                        <Label htmlFor="staffId" className="text-lg !font-normal">Tên nhân viên</Label>
                        <FlexibleCombobox
                            options={staff || []}
                            value={newKPIStaff.staffId}
                            onChange={(val) => updateField('staffId', val)}
                            displayField="staffName"
                            valueField="id"
                            placeholder="Tên nhân viên"
                            allowCustom={false}
                        />
                        {errors.staffId && (
                            <span className="text-red-500 text-sm">{errors.staffId}</span>
                        )}
                    </div>

                    <div className="grid">
                        <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                        <Select
                            value={newKPIStaff.groupId?.toString() ?? ""}
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
                            value={newKPIStaff.year?.toString() ?? undefined}
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
                            value={newKPIStaff.month?.toString() ?? undefined}
                            onChange={(value) => updateField('month', Number(value))}
                        // showAllOption={true}
                        />
                        {errors.month && (
                            <span className="text-red-500 text-sm">{errors.month}</span>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 grid-cols-3">
                    <div className="grid">
                        <Label htmlFor="kpi" className="text-lg !font-normal">KPI</Label>
                        <Input
                            id="kpi"
                            placeholder="KPI"
                            type="number"
                            inputMode="numeric"
                            value={newKPIStaff.kpi !== null ? newKPIStaff.kpi.toString() : ""}
                            onChange={(e) => updateField('kpi', e.target.value === "" ? null : Number(e.target.value))}
                            className={`!text-lg placeholder:text-[16px] ${errors.kpi ? 'border-red-500' : ''}`}
                        />
                        {errors.kpi && (
                            <span className="text-red-500 text-sm">{errors.kpi}</span>
                        )}
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="workGoal" className="text-lg !font-normal">Mục tiêu nhân viên làm việc</Label>
                        <Input
                            className={`!text-lg placeholder:text-[16px] ${errors.workGoal ? 'border-red-500' : ''}`}
                            id="workGoal"
                            placeholder="Mục tiêu làm việc"
                            type="number"
                            inputMode="numeric"
                            value={newKPIStaff.workGoal !== null ? newKPIStaff.workGoal.toString() : ""}
                            onChange={(e) => updateField('workGoal', e.target.value === "" ? null : Number(e.target.value))}
                        />
                        {errors.workGoal && (
                            <span className="text-red-500 text-sm">{errors.workGoal}</span>
                        )}
                    </div>

                    <div className="grid">
                        <Label htmlFor="pgTimeGoal" className="text-lg !font-normal">Mục tiêu giờ PG</Label>
                        <Input
                            id="pgTimeGoal"
                            placeholder="Mục tiêu giờ PG"
                            type="number"
                            inputMode="numeric"
                            className={`!text-lg placeholder:text-[16px] ${errors.pgTimeGoal ? 'border-red-500' : ''}`}
                            value={newKPIStaff.pgTimeGoal !== null ? newKPIStaff.pgTimeGoal.toString() : ""}
                            onChange={(e) => updateField('pgTimeGoal', e.target.value === "" ? null : Number(e.target.value))}
                        />
                        {errors.pgTimeGoal && (
                            <span className="text-red-500 text-sm">{errors.pgTimeGoal}</span>
                        )}
                    </div>
                    <div className="grid">
                        <Label htmlFor="machineTimeGoal" className="text-lg !font-normal">Mục tiêu giờ máy</Label>
                        <Input
                            id="machineTimeGoal"
                            placeholder="Mục tiêu giờ máy"
                            type="number"
                            inputMode="numeric"
                            className={`!text-lg placeholder:text-[16px] ${errors.machineTimeGoal ? 'border-red-500' : ''}`}
                            value={newKPIStaff.machineTimeGoal !== null ? newKPIStaff.machineTimeGoal.toString() : ""}
                            onChange={(e) => updateField('machineTimeGoal', e.target.value === "" ? null : Number(e.target.value))}
                        />
                        {errors.machineTimeGoal && (
                            <span className="text-red-500 text-sm">{errors.machineTimeGoal}</span>
                        )}
                    </div>
                    <div className="grid">
                        <Label htmlFor="manufacturingPoint" className="text-lg !font-normal">Mục tiêu điểm gia công</Label>
                        <Input
                            id="manufacturingPoint"
                            placeholder="Mục tiêu điểm gia công"
                            type="number"
                            inputMode="numeric"
                            className={`!text-lg placeholder:text-[16px] ${errors.manufacturingPoint ? 'border-red-500' : ''}`}
                            value={newKPIStaff.manufacturingPoint !== null ? newKPIStaff.manufacturingPoint.toString() : ""}
                            onChange={(e) => updateField('manufacturingPoint', e.target.value === "" ? null : Number(e.target.value))}
                        />
                        {errors.manufacturingPoint && (
                            <span className="text-red-500 text-sm">{errors.manufacturingPoint}</span>
                        )}
                    </div>
                    <div className="grid">
                        <Label htmlFor="oleGoal" className="text-lg !font-normal">Mục tiêu Ole</Label>
                        <Input
                            id="oleGoal"
                            placeholder="Mục tiêu Ole"
                            type="number"
                            inputMode="numeric"
                            className="!text-lg placeholder:text-[16px]"
                            value={newKPIStaff.oleGoal !== null ? newKPIStaff.oleGoal.toString() : ""}
                            onChange={(e) =>
                                setNewKPIStaff({ ...newKPIStaff, oleGoal: Number(e.target.value) })
                            }
                        />
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






"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Staff } from "@/lib/type"
import { Label } from "@/components/ui/label"
import { useGroup } from "../hooks/useStaff"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectYear } from "./SelectYear"
import { SelectMonth } from "./SelectMonth"
import { toast } from "sonner"
import { officeList } from "../lib/data"
import { 
    validateNewStaff, 
    NewStaffFormData, 
    validateStaffId,
    validateStaffName,
    validateShortName,
    validateStaffOffice,
    validateStaffSection,
    validateGroupId,
    validateKPIField,
    validateYear,
    validateMonth,
    validateWorkGoal,
    validatePgTimeGoal,
    validateMachineTimeGoal,
    validateManufacturingPoint,
    validateOleGoal
} from "../lib/validation"
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type AddStaffFormProps = {
    onAdd: (staff: Staff) => void
    onCancel: () => void
}
interface NewStaff {
    staffId: number | null,
    staffName: string,
    shortName: string,
    staffOffice: string,
    staffSection: string,
    kpi: number | null,
    year: number | null,
    month: number | null,
    workGoal: number | null,
    pgTimeGoal: number | null,
    machineTimeGoal: number | null,
    manufacturingPoint: number | null,
    oleGoal: number | null,
    groupId: string
}

export default function AddOperatorForm({ onAdd, onCancel }: AddStaffFormProps) {
    const [newStaff, setNewStaff] = useState<NewStaff>({
        staffId: null,
        staffName: "",
        shortName: "",
        staffOffice: "",
        staffSection: "",
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
    const [errors, setErrors] = useState<{[key: string]: string | null}>({})

    // Function to update field and validate
    const updateField = (field: keyof NewStaff, value: any) => {
        setNewStaff(prev => ({ ...prev, [field]: value }))
        
        // Validate field immediately
        let error: string | null = null
        switch (field) {
            case 'staffId':
                error = validateStaffId(value)
                break
            case 'staffName':
                error = validateStaffName(value)
                break
            case 'shortName':
                error = validateShortName(value)
                break
            case 'staffOffice':
                error = validateStaffOffice(value)
                break
            case 'staffSection':
                error = validateStaffSection(value)
                break
            case 'groupId':
                error = validateGroupId(value)
                break
            case 'kpi':
                error = validateKPIField(value)
                break
            case 'year':
                error = validateYear(value)
                break
            case 'month':
                error = validateMonth(value)
                break
            case 'workGoal':
                error = validateWorkGoal(value)
                break
            case 'pgTimeGoal':
                error = validatePgTimeGoal(value)
                break
            case 'machineTimeGoal':
                error = validateMachineTimeGoal(value)
                break
            case 'manufacturingPoint':
                error = validateManufacturingPoint(value)
                break
            case 'oleGoal':
                error = validateOleGoal(value)
                break
        }
        
        setErrors(prev => ({ ...prev, [field]: error }))
    }
    const handleSubmit = async () => {
        // Validate all fields individually first
        const fieldValidations = {
            staffId: validateStaffId(newStaff.staffId),
            staffName: validateStaffName(newStaff.staffName),
            shortName: validateShortName(newStaff.shortName),
            staffOffice: validateStaffOffice(newStaff.staffOffice),
            staffSection: validateStaffSection(newStaff.staffSection),
            groupId: validateGroupId(newStaff.groupId),
            kpi: validateKPIField(newStaff.kpi),
            year: validateYear(newStaff.year),
            month: validateMonth(newStaff.month),
            workGoal: validateWorkGoal(newStaff.workGoal),
            pgTimeGoal: validatePgTimeGoal(newStaff.pgTimeGoal),
            machineTimeGoal: validateMachineTimeGoal(newStaff.machineTimeGoal),
            manufacturingPoint: validateManufacturingPoint(newStaff.manufacturingPoint),
            oleGoal: validateOleGoal(newStaff.oleGoal),
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
            staffId: newStaff.staffId!,
            staffName: newStaff.staffName.trim(),
            shortName: newStaff.shortName.trim(),
            staffOffice: newStaff.staffOffice,
            staffSection: newStaff.staffSection.trim(),
            groupId: newStaff.groupId,
            kpi: newStaff.kpi!,
            year: newStaff.year!,
            month: newStaff.month!,
            workGoal: newStaff.workGoal!,
            pgTimeGoal: newStaff.pgTimeGoal!,
            machineTimeGoal: newStaff.machineTimeGoal!,
            manufacturingPoint: newStaff.manufacturingPoint!,
            oleGoal: newStaff.oleGoal!,
        }

        try {
            const response = await fetch(
                `${urlLink}/api/staff`,
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
            toast.success("Thêm nhân viên và KPI thành công!");
            location.reload()
            onCancel();
            setNewStaff({
                staffId: null,
                staffName: "",
                shortName: "",
                staffOffice: "",
                staffSection: "",
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
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    const { data: group, loading, error } = useGroup()

    return (
        <div className="grid gap-3 w-full">
            <div className="grid gap-7">
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin nhân viên</div>
                    <div className="grid gap-4 grid-cols-3">
                        <div className="grid">
                            <Label htmlFor="staffId" className="text-lg !font-normal">Mã nhân viên</Label>
                            <Input
                                id="staffId"
                                placeholder="Mã nhân viên"
                                inputMode="numeric"
                                value={newStaff.staffId?.toString() ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d{0,4}$/.test(val)) {
                                        updateField('staffId', val === "" ? null : Number(val));
                                    }
                                }}
                                className={`!text-lg placeholder:text-[16px] ${errors.staffId ? 'border-red-500' : ''}`}
                                maxLength={4}
                            />
                            {errors.staffId && (
                                <span className="text-red-500 text-sm mt-1">{errors.staffId}</span>
                            )}
                        </div>
                        <div className="grid">
                            <Label htmlFor="name" className="text-lg !font-normal">Họ và tên</Label>
                            <Input
                                id="name"
                                placeholder="Tên nhân viên"
                                value={newStaff.staffName}
                                onChange={(e) => updateField('staffName', e.target.value)}
                                className={`!text-lg placeholder:text-[16px] ${errors.staffName ? 'border-red-500' : ''}`}
                            />
                            {errors.staffName && (
                                <span className="text-red-500 text-sm mt-1">{errors.staffName}</span>
                            )}
                        </div>
                        <div className="grid">
                            <Label htmlFor="shortName" className="text-lg !font-normal">Tên tắt</Label>
                            <Input
                                id="shortName"
                                placeholder="Tên tắt"
                                value={newStaff.shortName}
                                onChange={(e) => updateField('shortName', e.target.value)}
                                className={`!text-lg placeholder:text-[16px] ${errors.shortName ? 'border-red-500' : ''}`}
                            />
                            {errors.shortName && (
                                <span className="text-red-500 text-sm mt-1">{errors.shortName}</span>
                            )}
                        </div>

                        <div className="grid">
                            <Label htmlFor="phong_ban" className="text-lg !font-normal">Phòng ban</Label>
                            <Select
                                value={newStaff.staffOffice?.toString() ?? ""}
                                onValueChange={(value) => updateField('staffOffice', value)}
                            >
                                <SelectTrigger className={`w-auto text-lg [&>span]:text-[16px] ${errors.staffOffice ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Chọn phòng ban" />
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
                            {errors.staffOffice && (
                                <span className="text-red-500 text-sm mt-1">{errors.staffOffice}</span>
                            )}
                        </div>

                        <div className="grid">
                            <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                            <Select
                                value={newStaff.groupId?.toString() ?? ""}
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
                                <span className="text-red-500 text-sm mt-1">{errors.groupId}</span>
                            )}
                        </div>

                        <div className="grid">
                            <Label htmlFor="cong_viec" className="text-lg !font-normal">Công việc</Label>
                            <Input
                                id="cong_viec"
                                placeholder="Công Việc"
                                value={newStaff.staffSection}
                                onChange={(e) => updateField('staffSection', e.target.value)}
                                className={`!text-lg placeholder:text-[16px] ${errors.staffSection ? 'border-red-500' : ''}`}
                            />
                            {errors.staffSection && (
                                <span className="text-red-500 text-sm mt-1">{errors.staffSection}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mục tiêu nhân viên */}
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu nhân viên</div>
                    <div className="grid gap-4 grid-cols-2 pb-3">
                        <div className="grid">
                            <Label htmlFor="year" className="text-lg !font-normal">Năm</Label>
                            <SelectYear
                                value={newStaff.year?.toString() ?? undefined}
                                onChange={(value) => updateField('year', Number(value))}
                                totalYears={5}
                                placeholder="Chọn năm"
                            />
                            {errors.year && (
                                <span className="text-red-500 text-sm mt-1">{errors.year}</span>
                            )}
                        </div>
                        <div className="month">
                            <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                            <SelectMonth
                                value={newStaff.month?.toString() ?? undefined}
                                onChange={(value) => updateField('month', Number(value))}
                            />
                            {errors.month && (
                                <span className="text-red-500 text-sm mt-1">{errors.month}</span>
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
                                value={newStaff.kpi !== null ? newStaff.kpi.toString() : ""}
                                onChange={(e) => updateField('kpi', e.target.value === "" ? null : Number(e.target.value))}
                                className={`!text-lg placeholder:text-[16px] ${errors.kpi ? 'border-red-500' : ''}`}
                            />
                            {errors.kpi && (
                                <span className="text-red-500 text-sm mt-1">{errors.kpi}</span>
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
                                value={newStaff.workGoal !== null ? newStaff.workGoal.toString() : ""}
                                onChange={(e) => updateField('workGoal', e.target.value === "" ? null : Number(e.target.value))}
                            />
                            {errors.workGoal && (
                                <span className="text-red-500 text-sm mt-1">{errors.workGoal}</span>
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
                                value={newStaff.pgTimeGoal !== null ? newStaff.pgTimeGoal.toString() : ""}
                                onChange={(e) => updateField('pgTimeGoal', e.target.value === "" ? null : Number(e.target.value))}
                            />
                            {errors.pgTimeGoal && (
                                <span className="text-red-500 text-sm mt-1">{errors.pgTimeGoal}</span>
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
                                value={newStaff.machineTimeGoal !== null ? newStaff.machineTimeGoal.toString() : ""}
                                onChange={(e) => updateField('machineTimeGoal', e.target.value === "" ? null : Number(e.target.value))}
                            />
                            {errors.machineTimeGoal && (
                                <span className="text-red-500 text-sm mt-1">{errors.machineTimeGoal}</span>
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
                                value={newStaff.manufacturingPoint !== null ? newStaff.manufacturingPoint.toString() : ""}
                                onChange={(e) => updateField('manufacturingPoint', e.target.value === "" ? null : Number(e.target.value))}
                            />
                            {errors.manufacturingPoint && (
                                <span className="text-red-500 text-sm mt-1">{errors.manufacturingPoint}</span>
                            )}
                        </div>
                        <div className="grid">
                            <Label htmlFor="oleGoal" className="text-lg !font-normal">Mục tiêu Ole</Label>
                            <Input
                                id="oleGoal"
                                placeholder="Mục tiêu Ole"
                                type="number"
                                inputMode="numeric"
                                className={`!text-lg placeholder:text-[16px] ${errors.oleGoal ? 'border-red-500' : ''}`}
                                value={newStaff.oleGoal !== null ? newStaff.oleGoal.toString() : ""}
                                onChange={(e) => updateField('oleGoal', e.target.value === "" ? null : Number(e.target.value))}
                            />
                            {errors.oleGoal && (
                                <span className="text-red-500 text-sm mt-1">{errors.oleGoal}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
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

"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Staff } from "@/lib/type"
import { KPI } from "../lib/type"
import {
    validateStaffKPIStaffId,
    validateStaffKPIKPI,
    validateStaffKPIYear,
    validateStaffKPIMonth,
    validateStaffKPIWorkGoal,
    validateStaffKPIPgTimeGoal,
    validateStaffKPIMachineTimeGoal,
    validateStaffKPIManufacturingPoint,
    validateStaffKPIOleGoal,
    validateStaffKPIGroupId,
    staffKPISchema
} from "../lib/validation"
import { SelectYear } from "../../components/SelectYear"
import { SelectMonth } from "../../components/SelectMonth"
import { useGroup } from "@/hooks/useMachine"

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type EditKPIStaffFormProps = {
    onUpdate: (updated: Staff) => void
    onCancel: () => void
    inforKPI: KPI
}
interface EditKPIStaff {
    staffId: string,
    kpi: number | null,
    year: number | null,
    month: number | null,
    workGoal: number | null,
    pgTimeGoal: number | null,
    machineTimeGoal: number | null,
    manufacturingPoint: number | null,
    oleGoal: number | null,
    groupId: string,
}
export default function EditKPIStaffForm({
    onUpdate,
    onCancel,
    inforKPI,
}: EditKPIStaffFormProps) {
    const [updateStaff, setUpdateStaff] = useState<EditKPIStaff>({
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
    })
    const { data: group, loading, error } = useGroup()
    const [errors, setErrors] = useState<Record<string, string>>({})

    const updateField = (field: keyof EditKPIStaff, value: any) => {
        setUpdateStaff(prev => ({ ...prev, [field]: value }))

        // Clear existing error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }

        // Validate field immediately
        let fieldError = ""
        switch (field) {
            case 'staffId':
                fieldError = validateStaffKPIStaffId(value) || ""
                break
            case 'kpi':
                fieldError = validateStaffKPIKPI(value) || ""
                break
            case 'year':
                fieldError = validateStaffKPIYear(value) || ""
                break
            case 'month':
                fieldError = validateStaffKPIMonth(value) || ""
                break
            case 'workGoal':
                fieldError = validateStaffKPIWorkGoal(value) || ""
                break
            case 'pgTimeGoal':
                fieldError = validateStaffKPIPgTimeGoal(value) || ""
                break
            case 'machineTimeGoal':
                fieldError = validateStaffKPIMachineTimeGoal(value) || ""
                break
            case 'manufacturingPoint':
                fieldError = validateStaffKPIManufacturingPoint(value) || ""
                break
            case 'oleGoal':
                fieldError = validateStaffKPIOleGoal(value) || ""
                break
            case 'groupId':
                fieldError = validateStaffKPIGroupId(value) || ""
                break
        }

        if (fieldError) {
            setErrors(prev => ({ ...prev, [field]: fieldError }))
        }
    }

    useEffect(() => {
        if (inforKPI) {
            setUpdateStaff({
                staffId: inforKPI.staffId ?? "",
                kpi: inforKPI.kpi ?? null,
                year: inforKPI.year ?? null,
                month: inforKPI.month ?? null,
                workGoal: inforKPI.workGoal ?? null,
                pgTimeGoal: inforKPI.pgTimeGoal ?? null,
                machineTimeGoal: inforKPI.machineTimeGoal ?? null,
                manufacturingPoint: inforKPI.manufacturingPoint ?? null,
                oleGoal: inforKPI.oleGoal ?? null,
                groupId: inforKPI.groupId?.toString() ?? "",
            })
        }
    }, [inforKPI])
    const handleUpdate = async () => {
        // Validate all fields before submission
        const validationErrors: Record<string, string> = {}

        const staffIdError = validateStaffKPIStaffId(updateStaff.staffId)
        if (staffIdError) validationErrors.staffId = staffIdError

        const kpiError = validateStaffKPIKPI(updateStaff.kpi)
        if (kpiError) validationErrors.kpi = kpiError

        const yearError = validateStaffKPIYear(updateStaff.year)
        if (yearError) validationErrors.year = yearError

        const monthError = validateStaffKPIMonth(updateStaff.month)
        if (monthError) validationErrors.month = monthError

        const workGoalError = validateStaffKPIWorkGoal(updateStaff.workGoal)
        if (workGoalError) validationErrors.workGoal = workGoalError

        const pgTimeGoalError = validateStaffKPIPgTimeGoal(updateStaff.pgTimeGoal)
        if (pgTimeGoalError) validationErrors.pgTimeGoal = pgTimeGoalError

        const machineTimeGoalError = validateStaffKPIMachineTimeGoal(updateStaff.machineTimeGoal)
        if (machineTimeGoalError) validationErrors.machineTimeGoal = machineTimeGoalError

        const manufacturingPointError = validateStaffKPIManufacturingPoint(updateStaff.manufacturingPoint)
        if (manufacturingPointError) validationErrors.manufacturingPoint = manufacturingPointError

        const oleGoalError = validateStaffKPIOleGoal(updateStaff.oleGoal)
        if (oleGoalError) validationErrors.oleGoal = oleGoalError

        const groupIdError = validateStaffKPIGroupId(updateStaff.groupId)
        if (groupIdError) validationErrors.groupId = groupIdError

        try {
            const response = await fetch(
                `${urlLink}/api/staff-kpi/${inforKPI.kpiId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        staffId: updateStaff.staffId,
                        kpi: updateStaff.kpi,
                        year: updateStaff.year,
                        month: updateStaff.month,
                        workGoal: updateStaff.workGoal,
                        pgTimeGoal: updateStaff.pgTimeGoal,
                        machineTimeGoal: updateStaff.machineTimeGoal,
                        manufacturingPoint: updateStaff.manufacturingPoint,
                        oleGoal: updateStaff.oleGoal,
                        groupId: updateStaff.groupId,
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
                        <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2 ml-2">Thông tin nhân viên</div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="grid">
                                <Label htmlFor="staffName" className="text-lg !font-normal">Tên nhân viên</Label>
                                <Input
                                    id="staffName"
                                    placeholder="Tên nhân viên"
                                    readOnly
                                    value={inforKPI.staffName?.toString() ?? ""}
                                    className="!text-lg placeholder:text-[16px]"
                                />
                            </div>

                            <div className="grid">
                                <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                {/* <Input
                                    id="nhom"
                                    placeholder="Nhóm"
                                    readOnly
                                    value={inforKPI.groupName?.toString() ?? ""}
                                    className="!text-lg placeholder:text-[16px]"
                                /> */}
                                <Select
                                    value={updateStaff.groupId?.toString() ?? ""}
                                    onValueChange={(value) => updateField('groupId', value)}
                                >
                                    <SelectTrigger className={`w-auto text-lg [&>span]:text-[16px] ${errors.groupId ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Chọn nhóm" />
                                    </SelectTrigger>
                                    <SelectContent id="nhom">
                                        <SelectGroup>
                                            {group?.map((g) => (
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
                                <Label htmlFor="name" className="text-lg !font-normal">
                                    Năm
                                </Label>
                                {/* <Input
                                    type="number"
                                    value={inforKPI.year ?? ""}
                                    placeholder="Năm"
                                    readOnly
                                    className="placeholder:text-[10px] !text-xl"
                                /> */}
                                <SelectYear
                                    value={updateStaff.year?.toString() ?? ""}
                                    onChange={(value) => updateField('year', Number(value))}
                                    totalYears={5}
                                    placeholder="Chọn năm"
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                {/* <Input
                                    type="number"
                                    value={inforKPI.month ?? ""}
                                    readOnly
                                    placeholder="Tháng"
                                    className="placeholder:text-[10px] !text-lg"
                                /> */}
                                <SelectMonth
                                    value={updateStaff.month?.toString() ?? ""}
                                    onChange={(value) => updateField('month', Number(value))}
                                // showAllOption={true}
                                />
                            </div>
                        </div>
                        <div className="grid gap-5 grid-cols-3">
                            <div className="grid">
                                <Label htmlFor="kpi" className="text-lg !font-normal">KPI</Label>
                                <Input
                                    id="kpi"
                                    className="!text-lg"
                                    placeholder="Mục tiêu làm việc"
                                    type="number"
                                    inputMode="numeric"
                                    value={updateStaff.kpi ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, kpi: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="workGoal" className="text-lg !font-normal">Mục tiêu nhân viên làm việc</Label>
                                <Input
                                    id="workGoal"
                                    placeholder="Mục tiêu làm việc"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.workGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, workGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="pgTimeGoal" className="text-lg !font-normal">Mục tiêu giờ PG</Label>
                                <Input
                                    id="pgTimeGoal"
                                    placeholder="Mục tiêu giờ PG"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.pgTimeGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, pgTimeGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="machineTimeGoal" className="text-lg !font-normal">Mục tiêu giờ máy</Label>
                                <Input
                                    id="machineTimeGoal"
                                    placeholder="Mục tiêu giờ máy"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.machineTimeGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, machineTimeGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="manufacturingPoint" className="text-lg !font-normal">Mục tiêu điểm gia công</Label>
                                <Input
                                    id="manufacturingPoint"
                                    placeholder="Mục tiêu điểm gia công"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.manufacturingPoint ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, manufacturingPoint: e.target.value === "" ? null : Number(e.target.value) })
                                    }

                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="oleGoal" className="text-lg !font-normal">Mục tiêu Ole</Label>
                                <Input
                                    id="oleGoal"
                                    placeholder="Mục tiêu Ole"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.oleGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, oleGoal: e.target.value === "" ? null : Number(e.target.value) })
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
                        <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2 ml-2">Thông tin nhân viên</div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="grid">
                                <Label htmlFor="staffName" className="text-lg !font-normal">Tên nhân viên</Label>
                                <Input
                                    id="staffName"
                                    placeholder="Tên nhân viên"
                                    readOnly
                                    value={inforKPI.staffName?.toString() ?? ""}
                                    className="!text-lg placeholder:text-[16px]"
                                />
                            </div>

                            <div className="grid">
                                <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                {/* <Input
                                    id="nhom"
                                    placeholder="Nhóm"
                                    readOnly
                                    value={inforKPI.groupName?.toString() ?? ""}
                                    className="!text-lg placeholder:text-[16px]"
                                /> */}
                                <Select
                                    value={updateStaff.groupId?.toString() ?? ""}
                                    onValueChange={(value) => updateField('groupId', value)}
                                >
                                    <SelectTrigger className={`w-auto text-lg [&>span]:text-[16px] ${errors.groupId ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Chọn nhóm" />
                                    </SelectTrigger>
                                    <SelectContent id="nhom">
                                        <SelectGroup>
                                            {group?.map((g) => (
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
                                <Label htmlFor="name" className="text-lg !font-normal">
                                    Năm
                                </Label>
                                {/* <Input
                                    type="number"
                                    value={inforKPI.year ?? ""}
                                    placeholder="Năm"
                                    readOnly
                                    className="placeholder:text-[10px] !text-xl"
                                /> */}
                                <SelectYear
                                    value={updateStaff.year?.toString() ?? ""}
                                    onChange={(value) => updateField('year', Number(value))}
                                    totalYears={5}
                                    placeholder="Chọn năm"
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                {/* <Input
                                    type="number"
                                    value={inforKPI.month ?? ""}
                                    readOnly
                                    placeholder="Tháng"
                                    className="placeholder:text-[10px] !text-lg"
                                /> */}
                                <SelectMonth
                                    value={updateStaff.month?.toString() ?? ""}
                                    onChange={(value) => updateField('month', Number(value))}
                                // showAllOption={true}
                                />
                            </div>
                        </div>
                        <div className="grid gap-5 grid-cols-3">
                            <div className="grid">
                                <Label htmlFor="kpi" className="text-lg !font-normal">KPI</Label>
                                <Input
                                    id="kpi"
                                    className="!text-lg"
                                    placeholder="Mục tiêu làm việc"
                                    type="number"
                                    inputMode="numeric"
                                    value={updateStaff.kpi ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, kpi: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="workGoal" className="text-lg !font-normal">Mục tiêu nhân viên làm việc</Label>
                                <Input
                                    id="workGoal"
                                    placeholder="Mục tiêu làm việc"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.workGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, workGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="pgTimeGoal" className="text-lg !font-normal">Mục tiêu giờ PG</Label>
                                <Input
                                    id="pgTimeGoal"
                                    placeholder="Mục tiêu giờ PG"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.pgTimeGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, pgTimeGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="machineTimeGoal" className="text-lg !font-normal">Mục tiêu giờ máy</Label>
                                <Input
                                    id="machineTimeGoal"
                                    placeholder="Mục tiêu giờ máy"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.machineTimeGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, machineTimeGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="manufacturingPoint" className="text-lg !font-normal">Mục tiêu điểm gia công</Label>
                                <Input
                                    id="manufacturingPoint"
                                    placeholder="Mục tiêu điểm gia công"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.manufacturingPoint ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, manufacturingPoint: e.target.value === "" ? null : Number(e.target.value) })
                                    }

                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="oleGoal" className="text-lg !font-normal">Mục tiêu Ole</Label>
                                <Input
                                    id="oleGoal"
                                    placeholder="Mục tiêu Ole"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    value={updateStaff.oleGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaff({ ...updateStaff, oleGoal: e.target.value === "" ? null : Number(e.target.value) })
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

"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGroup } from "../hooks/useStaff"
import { toast } from "sonner"
import { Staff } from "@/lib/type"
import { useStaffWithKPI } from "../hooks/useStaffWithKPI"
import { officeList, statusList } from "../lib/data"
import { 
    validateEditStaff, 
    EditStaffFormData, 
    formatValidationErrors,
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
    validateOleGoal,
    validateStatus
} from "../lib/validation"

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type EditStaffFormProps = {
    onUpdate: (updated: Staff) => void
    onCancel: () => void
    idStaffString: string
    staffList: Staff[]
}
interface EditStaff {
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
    groupId: string,
    status: number | null
}
export default function EditStaffForm({
    onUpdate,
    onCancel,
    idStaffString,
    staffList
}: EditStaffFormProps) {
    // Lấy các group hiện có
    const { data: group, loading, error } = useGroup()

    // Staff With KPI
    const { data: staffWithKPI } = useStaffWithKPI(idStaffString)
    // const [staff, setStaff] = useState<Staff>()

    const [updateStaff, setUpdateStaff] = useState<EditStaff>({
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
        status: null,
    })

    // Validation errors state
    const [errors, setErrors] = useState<{[key: string]: string | null}>({})

    // Function to update field and validate
    const updateField = (field: keyof EditStaff, value: any) => {
        setUpdateStaff(prev => ({ ...prev, [field]: value }))
        
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
            case 'status':
                error = validateStatus(value)
                break
        }
        
        setErrors(prev => ({ ...prev, [field]: error }))
    }

    useEffect(() => {
        if (staffWithKPI) {
            setUpdateStaff({
                staffId: staffWithKPI.staffId ?? null,
                staffName: staffWithKPI.staffName ?? "",
                shortName: staffWithKPI.shortName ?? "",
                staffOffice: staffWithKPI.staffOffice ?? "",
                staffSection: staffWithKPI.staffSection ?? "",
                kpi: staffWithKPI.staffKpiDtos?.kpi ?? null,
                year: staffWithKPI.staffKpiDtos?.year ?? null,
                month: staffWithKPI.staffKpiDtos?.month ?? null,
                workGoal: staffWithKPI.staffKpiDtos?.workGoal ?? null,
                pgTimeGoal: staffWithKPI.staffKpiDtos?.pgTimeGoal ?? null,
                machineTimeGoal: staffWithKPI.staffKpiDtos?.machineTimeGoal ?? null,
                manufacturingPoint: staffWithKPI.staffKpiDtos?.manufacturingPoint ?? null,
                oleGoal: staffWithKPI.staffKpiDtos?.oleGoal ?? null,
                groupId: staffWithKPI.staffKpiDtos?.groupId?.toString() ?? "",
                status: staffWithKPI.status ?? null,
            })
        }
    }, [staffWithKPI])

    const handleUpdate = async () => {
        // Validate all fields individually first
        const fieldValidations = {
            staffId: validateStaffId(updateStaff.staffId),
            staffName: validateStaffName(updateStaff.staffName),
            shortName: validateShortName(updateStaff.shortName),
            staffOffice: validateStaffOffice(updateStaff.staffOffice),
            staffSection: validateStaffSection(updateStaff.staffSection),
            groupId: validateGroupId(updateStaff.groupId),
            kpi: validateKPIField(updateStaff.kpi),
            year: validateYear(updateStaff.year),
            month: validateMonth(updateStaff.month),
            workGoal: validateWorkGoal(updateStaff.workGoal),
            pgTimeGoal: validatePgTimeGoal(updateStaff.pgTimeGoal),
            machineTimeGoal: validateMachineTimeGoal(updateStaff.machineTimeGoal),
            manufacturingPoint: validateManufacturingPoint(updateStaff.manufacturingPoint),
            oleGoal: validateOleGoal(updateStaff.oleGoal),
            status: validateStatus(updateStaff.status),
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
            staffId: updateStaff.staffId!,
            staffName: updateStaff.staffName.trim(),
            shortName: updateStaff.shortName.trim(),
            staffOffice: updateStaff.staffOffice,
            staffSection: updateStaff.staffSection.trim(),
            groupId: updateStaff.groupId,
            kpi: updateStaff.kpi!,
            year: updateStaff.year!,
            month: updateStaff.month!,
            workGoal: updateStaff.workGoal!,
            pgTimeGoal: updateStaff.pgTimeGoal!,
            machineTimeGoal: updateStaff.machineTimeGoal!,
            manufacturingPoint: updateStaff.manufacturingPoint!,
            oleGoal: updateStaff.oleGoal!,
            status: updateStaff.status!,
        }

        try {
            const response = await fetch(
                `${urlLink}/api/staff/${idStaffString}`,
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
                                        value={updateStaff.staffId?.toString() ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d{0,4}$/.test(val)) {
                                                const newId = val === "" ? null : Number(val);
                                                if (newId !== null) {
                                                    const isDuplicate = staffList.some(
                                                        (st) => st.staffId === newId && st.staffId !== updateStaff.staffId
                                                    );

                                                    if (isDuplicate) {
                                                        toast.error("Mã nhân viên đã tồn tại!");
                                                        return;
                                                    }
                                                }
                                                updateField('staffId', newId);
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
                                        value={updateStaff.staffName}
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
                                        value={updateStaff.shortName}
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
                                        value={updateStaff.staffOffice?.toLowerCase() ?? ""}
                                        onValueChange={(value) =>
                                            setUpdateStaff({ ...updateStaff, staffOffice: value })
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
                                    <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                    <Select
                                        value={updateStaff?.groupId?.toString()}
                                        onValueChange={(value) =>
                                            setUpdateStaff((prev) => ({ ...prev, groupId: value }))
                                        }
                                    >
                                        <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
                                            <SelectValue placeholder="Chọn nhóm" />
                                        </SelectTrigger>
                                        <SelectContent id="nhom">
                                            <SelectGroup>
                                                {group.map((g) => (
                                                    <SelectItem
                                                        className="text-lg"
                                                        key={g.groupId}
                                                        value={g.groupId.toString()}
                                                    >
                                                        {g.groupName}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>

                                <div className="grid">
                                    <Label htmlFor="cong_viec" className="text-lg !font-normal">Công việc</Label>
                                    <Input
                                        id="cong_viec"
                                        placeholder="Công Việc"
                                        value={updateStaff.staffSection ?? ""}
                                        onChange={(e) =>
                                            setUpdateStaff({
                                                ...updateStaff,
                                                staffSection: e.target.value,
                                            })
                                        }
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mục tiêu nhân viên */}
                        {staffWithKPI && (
                            <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                                <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu nhân viên</div>
                                <div className="grid gap-4 grid-cols-2 pb-3">
                                    <div className="flex flex-row items-center gap-2">
                                        <Label htmlFor="name" className="text-lg !font-normal">
                                            Năm
                                        </Label>
                                        <Input
                                            type="number"
                                            value={updateStaff.year ?? ""}
                                            placeholder="Năm"
                                            readOnly
                                            className="placeholder:text-[10px] !text-xl"
                                        />
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                        <Input
                                            type="number"
                                            value={staffWithKPI.staffKpiDtos?.month ?? ""}
                                            readOnly
                                            placeholder="Tháng"
                                            className="placeholder:text-[10px] !text-lg"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 grid-cols-3">
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


                        )}
                    </div>
                    {/* Nút */}
                    <div className="flex justify-between ">
                        <div className="flex text-xl items-center pl-6 font-medium w-fit ">
                            <span className="pr-3">
                                Trạng Thái:
                            </span>
                            <Select
                                value={updateStaff?.status?.toString()}
                                onValueChange={(value) =>
                                    setUpdateStaff((prev) => ({ ...prev, status: Number(value) }))
                                }
                            >
                                <SelectTrigger className="w-auto text-lg [&>span]:text-[16px] px-6">
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent id="nhom">
                                    <SelectGroup>
                                        {statusList.map((g) => (
                                            <SelectItem
                                                className="text-lg"
                                                key={g.id}
                                                value={g.id.toString()}
                                            >
                                                {g.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                                Hủy
                            </Button>
                            <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer">
                                Lưu thay đổi
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Màng hinh lớn hơn laptop */}
            <div className="hidden min-[1550px]:block">
                <div className="grid gap-3 w-full">
                    <div className="grid gap-9">
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin nhân viên</div>
                            <div className="grid gap-5 grid-cols-3">
                                <div className="grid">
                                    <Label htmlFor="staffId" className="text-lg !font-normal">Mã nhân viên</Label>
                                    <Input
                                        id="staffId"
                                        placeholder="Mã nhân viên"
                                        inputMode="numeric"
                                        value={updateStaff.staffId?.toString() ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d{0,4}$/.test(val)) {
                                                const newId = val === "" ? null : Number(val);
                                                if (newId !== null) {
                                                    const isDuplicate = staffList.some(
                                                        (st) => st.staffId === newId && st.staffId !== updateStaff.staffId
                                                    );

                                                    if (isDuplicate) {
                                                        toast.error("Mã nhân viên đã tồn tại!");
                                                        return;
                                                    }
                                                }
                                                setUpdateStaff({
                                                    ...updateStaff,
                                                    staffId: newId,
                                                });
                                            }
                                        }}
                                        className="!text-lg placeholder:text-[16px]"
                                        maxLength={4}
                                    />

                                </div>
                                <div className="grid">
                                    <Label htmlFor="name" className="text-lg !font-normal">Họ và tên</Label>
                                    <Input
                                        id="name"
                                        placeholder="Tên nhân viên"
                                        value={updateStaff.staffName}
                                        onChange={(e) =>
                                            setUpdateStaff({
                                                ...updateStaff,
                                                staffName: e.target.value,
                                            })
                                        }
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="shortName" className="text-lg !font-normal">Tên tắt</Label>
                                    <Input
                                        id="shortName"
                                        placeholder="Tên tắt"
                                        // value={staff?.shortName}
                                        // onChange={(e) => setUpdateStaff({ ...updateStaff, shortName: e.target.value })}
                                        value={updateStaff.shortName}
                                        onChange={(e) =>
                                            setUpdateStaff({
                                                ...updateStaff,
                                                shortName: e.target.value,
                                            })
                                        }
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="phong_ban" className="text-lg !font-normal">Phòng ban</Label>
                                    <Select
                                        value={updateStaff.staffOffice?.toLowerCase() ?? ""}
                                        onValueChange={(value) =>
                                            setUpdateStaff({ ...updateStaff, staffOffice: value })
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
                                    <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                    <Select
                                        value={updateStaff?.groupId?.toString()}
                                        onValueChange={(value) =>
                                            setUpdateStaff((prev) => ({ ...prev, groupId: value }))
                                        }
                                    >
                                        <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
                                            <SelectValue placeholder="Chọn nhóm" />
                                        </SelectTrigger>
                                        <SelectContent id="nhom">
                                            <SelectGroup>
                                                {group.map((g) => (
                                                    <SelectItem
                                                        className="text-lg"
                                                        key={g.groupId}
                                                        value={g.groupId.toString()}
                                                    >
                                                        {g.groupName}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid">
                                    <Label htmlFor="cong_viec" className="text-lg !font-normal">Công việc</Label>
                                    <Input
                                        id="cong_viec"
                                        placeholder="Công Việc"
                                        // value={staff?.staffSection}
                                        // onChange={(e) =>
                                        //     setUpdateStaff({ ...updateStaff, staffSection: e.target.value })
                                        // }
                                        value={updateStaff.staffSection ?? ""}
                                        onChange={(e) =>
                                            setUpdateStaff({
                                                ...updateStaff,
                                                staffSection: e.target.value,
                                            })
                                        }
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mục tiêu nhân viên */}
                        {staffWithKPI && (
                            <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                                <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2 ">Mục tiêu nhân viên</div>
                                <div className="grid gap-5 grid-cols-2 pb-5">
                                    <div className="flex flex-row items-center gap-2">
                                        <Label htmlFor="name" className="text-lg !font-normal">
                                            Năm
                                        </Label>
                                        <Input
                                            type="number"
                                            value={updateStaff.year ?? ""}
                                            placeholder="Năm"
                                            readOnly
                                            className="placeholder:text-[10px] !text-xl"
                                        />
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                        <Input
                                            type="number"
                                            value={staffWithKPI.staffKpiDtos?.month ?? ""}
                                            readOnly
                                            placeholder="Tháng"
                                            className="placeholder:text-[10px] !text-lg"
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
                                            // value={kpi.workGoal ?? ""}
                                            // onChange={(e) => setUpdateStaffKPI("workGoal", Number(e.target.value))}
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
                                            // value={kpi.pgTimeGoal ?? ""}
                                            // onChange={(e) => updateKPIField("pgTimeGoal", Number(e.target.value))}
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
                                            // value={kpi.machineTimeGoal ?? ""}
                                            // onChange={(e) => updateKPIField("machineTimeGoal", Number(e.target.value))}
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
                                            // value={kpi.manufacturingPoint ?? ""}
                                            // onChange={(e) => updateKPIField("manufacturingPoint", Number(e.target.value))}
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
                                            // value={kpi.oleGoal ?? ""}
                                            // onChange={(e) => updateKPIField("oleGoal", Number(e.target.value))}
                                            value={updateStaff.oleGoal ?? ""}
                                            onChange={(e) =>
                                                setUpdateStaff({ ...updateStaff, oleGoal: e.target.value === "" ? null : Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Nút */}
                    <div className="flex justify-between ">
                        <div className="flex text-xl items-center pl-6 font-medium w-fit ">
                            <span className="pr-3">
                                Trạng Thái:
                            </span>
                            <Select
                                value={updateStaff?.status?.toString()}
                                onValueChange={(value) =>
                                    setUpdateStaff((prev) => ({ ...prev, status: Number(value) }))
                                }
                            >
                                <SelectTrigger
                                    className={`w-auto text-lg [&>span]:text-[16px] gap-5 ${updateStaff?.status === 1
                                        ? "bg-[#E7F7EF] text-[#0CAF60]"
                                        : "bg-[#FFE6E6] text-[#fb5656]"
                                        }`}
                                >
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent id="nhom">
                                    <SelectGroup>
                                        {statusList.map((g) => (
                                            <SelectItem
                                                className="text-lg"
                                                key={g.id}
                                                value={g.id.toString()}
                                            >
                                                {g.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                                Hủy
                            </Button>
                            <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer">
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}


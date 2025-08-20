"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGroup } from "../hook/useStaff"
import { toast } from "sonner"
import { Staff } from "@/lib/type"
import { useStaffWithKPI } from "../hook/useStaffWithKPI"

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
    groupId: string
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
        groupId: ""
    })

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
            })
        }
    }, [staffWithKPI])

    const handleUpdate = async () => {
        // Kiểm tra thông tin bắt buộc của Staff
        if (
            !updateStaff.staffId ||
            !updateStaff.staffName.trim() ||
            !updateStaff.staffOffice.trim() ||
            !updateStaff.groupId ||
            !updateStaff.staffSection.trim()
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin nhân viên.");
            return;
        }


        // Kiểm tra thông tin bắt buộc của StaffKPI
        if (
            updateStaff.pgTimeGoal === null ||
            updateStaff.machineTimeGoal === null ||
            updateStaff.manufacturingPoint === null ||
            updateStaff.oleGoal === null ||
            updateStaff.workGoal === null ||
            updateStaff.kpi === null
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin mục tiêu nhân viên.");
            return;
        }

        try {
            const response = await fetch(
                `${urlLink}/api/staff/${idStaffString}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        staffId: updateStaff.staffId,
                        staffName: updateStaff.staffName,
                        shortName: updateStaff.shortName,
                        staffOffice: updateStaff.staffOffice,
                        staffSection: updateStaff.staffSection,
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
                throw new Error(errorData.message || "Gửi thất bại ở response 1.");
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
                                    <Input
                                        id="phong_ban"
                                        placeholder="Phòng ban"
                                        // value={staff?.staffOffice}
                                        // onChange={(e) =>
                                        //     setUpdateStaff({ ...updateStaff, staffOffice: e.target.value })
                                        // }
                                        value={updateStaff?.staffOffice}
                                        onChange={(e) =>
                                            setUpdateStaff({
                                                ...updateStaff,
                                                staffOffice: e.target.value,
                                            })
                                        }
                                        className="!text-lg placeholder:text-[16px]"
                                    />
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
                    <div className="flex justify-end gap-3">
                        <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4]">
                            Lưu thay đổi
                        </Button>
                        <Button variant="outline" onClick={onCancel}>
                            Hủy
                        </Button>
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
                                    <Input
                                        id="phong_ban"
                                        placeholder="Phòng ban"
                                        // value={staff?.staffOffice}
                                        // onChange={(e) =>
                                        //     setUpdateStaff({ ...updateStaff, staffOffice: e.target.value })
                                        // }
                                        value={updateStaff?.staffOffice}
                                        onChange={(e) =>
                                            setUpdateStaff({
                                                ...updateStaff,
                                                staffOffice: e.target.value,
                                            })
                                        }
                                        className="!text-lg placeholder:text-[16px]"
                                    />
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
                    <div className="flex justify-end gap-3">
                        <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4]">
                            Lưu thay đổi
                        </Button>
                        <Button variant="outline" onClick={onCancel}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </div>
        </>

    )
}

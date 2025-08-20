"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Staff, StaffKPI } from "@/lib/type"
import { Label } from "@/components/ui/label"
import { useGroup } from "../hook/useStaff"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectYear } from "./SelectYear"
import { SelectMonth } from "./SelectMonth"
import { toast } from "sonner"
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type AddStaffFormProps = {
    onAdd: (staff: Staff) => void
    onCancel: () => void
}

export default function AddOperatorForm({ onAdd, onCancel }: AddStaffFormProps) {
    const [newStaff, setNewStaff] = useState<Staff>({
        id: "",
        staffId: null,
        staffName: "",
        staffOffice: "",
        groupName: "",
        staffSection: "",
        shortName: "",
        status: 1, // bên server tự làm
        groupId: "",
    })

    const [newStaffKPI, setNewStaffKPI] = useState<StaffKPI>({
        year: null,
        month: null,
        pgTimeGoal: null,
        machineTimeGoal: null,
        manufacturingPoint: null,
        oleGoal: null,
        workGoal: null,
        kpi: null,
    })

    const handleSubmit = async () => {
        // Kiểm tra thông tin bắt buộc của newStaff
        if (
            !newStaff.staffId ||
            !newStaff.staffName.trim() ||
            !newStaff.staffOffice.trim() ||
            !newStaff.groupId ||
            !newStaff.staffSection.trim()
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin nhân viên.");
            return;
        }

        // Kiểm tra thông tin bắt buộc của newStaffKPI
        if (
            newStaffKPI.year === null ||
            newStaffKPI.month === null ||
            newStaffKPI.pgTimeGoal === null ||
            newStaffKPI.machineTimeGoal === null ||
            newStaffKPI.manufacturingPoint === null ||
            newStaffKPI.oleGoal === null ||
            newStaffKPI.workGoal === null ||
            newStaffKPI.kpi === null
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin mục tiêu nhân viên.");
            return;
        }

        try {
            const response = await fetch(
                `${urlLink}/api/staff`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        staffId: newStaff.staffId,
                        staffName: newStaff.staffName,
                        shortName: newStaff.shortName,
                        staffOffice: newStaff.staffOffice,
                        staffSection: newStaff.staffSection,
                        groupId: newStaff.groupId,
                        kpi: newStaffKPI.kpi,
                        year: newStaffKPI.year,
                        month: newStaffKPI.month,
                        workGoal: newStaffKPI.workGoal,
                        pgTimeGoal: newStaffKPI.pgTimeGoal,
                        machineTimeGoal: newStaffKPI.machineTimeGoal,
                        manufacturingPoint: newStaffKPI.manufacturingPoint,
                        oleGoal: newStaffKPI.oleGoal,
                    }),
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
                id: "",
                staffId: null,
                staffName: "",
                staffOffice: "",
                groupName: "",
                staffSection: "",
                shortName: "",
                status: 1,
                groupId: "",
            });

            setNewStaffKPI({
                year: null,
                month: null,
                pgTimeGoal: null,
                machineTimeGoal: null,
                manufacturingPoint: null,
                oleGoal: null,
                workGoal: null,
                kpi: null,
            });
        } catch (error) {
            // console.error("Lỗi khi cập gửi:", error);
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };


    const { data: group, loading, error } = useGroup("staff")

    return (
        <div className="grid gap-3 w-full">
            <div className="grid gap-7">
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin nhân viên</div>
                    <div className="grid gap-4 grid-cols-3">
                        <div className="grid">
                            <Label htmlFor="staffId" className="text-lg !font-normal">Mã nhân viên</Label>
                            {/* <Input
                                id="staffId"
                                placeholder="Mã nhân viên"
                                // type="number"
                                // inputMode="numeric"
                                value={newStaff.staffId?.toString() ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setNewStaff({
                                        ...newStaff,
                                        staffId: val === "" ? null : Number(val),
                                    });
                                }}
                                className="!text-lg placeholder:text-[16px]"
                            /> */}

                            <Input
                                id="staffId"
                                placeholder="Mã nhân viên"
                                // type="number" // Dùng text để cho phép kiểm soát input
                                inputMode="numeric"
                                value={newStaff.staffId?.toString() ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d{0,4}$/.test(val)) {
                                        setNewStaff({
                                            ...newStaff,
                                            staffId: val === "" ? null : Number(val),
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
                                value={newStaff.staffName}
                                onChange={(e) => setNewStaff({ ...newStaff, staffName: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>
                        <div className="grid">
                            <Label htmlFor="shortName" className="text-lg !font-normal">Tên tắt</Label>
                            <Input
                                id="shortName"
                                placeholder="Tên tắt"
                                value={newStaff.shortName}
                                onChange={(e) => setNewStaff({ ...newStaff, shortName: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="phong_ban" className="text-lg !font-normal">Phòng ban</Label>
                            <Input
                                id="phong_ban"
                                placeholder="Phòng ban"
                                value={newStaff.staffOffice}
                                onChange={(e) => setNewStaff({ ...newStaff, staffOffice: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                            {/* <Input
                            id="nhom"
                            placeholder="Nhóm"
                            value={newStaff.groupName}
                            onChange={(e) => setNewStaff({ ...newStaff, groupName: e.target.value })}
                        /> */}
                            <Select
                                value={newStaff.groupId?.toString() ?? ""}
                                onValueChange={(value) => setNewStaff({ ...newStaff, groupId: value })}
                            >
                                <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
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
                        </div>

                        <div className="grid">
                            <Label htmlFor="cong_viec" className="text-lg !font-normal">Công việc</Label>
                            <Input
                                id="cong_viec"
                                placeholder="Công Việc"
                                value={newStaff.staffSection}
                                onChange={(e) => setNewStaff({ ...newStaff, staffSection: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
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
                                value={newStaffKPI.year?.toString() ?? undefined}
                                onChange={(value) =>
                                    setNewStaffKPI({ ...newStaffKPI, year: Number(value) })
                                }
                                totalYears={5}
                                placeholder="Chọn năm"
                            />
                        </div>
                        <div className="month">
                            <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                            <SelectMonth
                                value={newStaffKPI.month?.toString() ?? undefined}
                                onChange={(value) =>
                                    setNewStaffKPI({ ...newStaffKPI, month: Number(value) })
                                }
                            // showAllOption={true}
                            />
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
                                value={newStaffKPI.kpi !== null ? newStaffKPI.kpi.toString() : ""}
                                onChange={(e) =>
                                    setNewStaffKPI({
                                        ...newStaffKPI,
                                        kpi: e.target.value === "" ? null : Number(e.target.value),
                                    })
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
                                value={newStaffKPI.workGoal !== null ? newStaffKPI.workGoal.toString() : ""}
                                // value={newStaffKPI.workGoal?.toString() ?? undefined}
                                onChange={(e) =>
                                    setNewStaffKPI({ ...newStaffKPI, workGoal: Number(e.target.value) })
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
                                value={newStaffKPI.pgTimeGoal !== null ? newStaffKPI.pgTimeGoal.toString() : ""}
                                // value={newStaffKPI.pgTimeGoal?.toString() ?? undefined}
                                onChange={(e) =>
                                    setNewStaffKPI({ ...newStaffKPI, pgTimeGoal: Number(e.target.value) })
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
                                value={newStaffKPI.machineTimeGoal !== null ? newStaffKPI.machineTimeGoal.toString() : ""}
                                // value={newStaffKPI.machineTimeGoal?.toString() ?? undefined}
                                onChange={(e) =>
                                    setNewStaffKPI({ ...newStaffKPI, machineTimeGoal: Number(e.target.value) })
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
                                value={newStaffKPI.manufacturingPoint !== null ? newStaffKPI.manufacturingPoint.toString() : ""}
                                // value={newStaffKPI.manufacturingPoint?.toString() ?? undefined}
                                onChange={(e) =>
                                    setNewStaffKPI({ ...newStaffKPI, manufacturingPoint: Number(e.target.value) })
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
                                value={newStaffKPI.oleGoal !== null ? newStaffKPI.oleGoal.toString() : ""}
                                // value={newStaffKPI.oleGoal?.toString() ?? undefined}
                                onChange={(e) =>
                                    setNewStaffKPI({ ...newStaffKPI, oleGoal: Number(e.target.value) })
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={onCancel} className="py-6 px-10 cursor-pointer text-xl">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} className="text-xl bg-[#074695] hover:bg-[#0754B4] py-6 px-10 cursor-pointer">
                    Lưu
                </Button>

            </div>
        </div>
    )
}

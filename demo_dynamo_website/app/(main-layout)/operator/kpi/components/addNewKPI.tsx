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
    const handleSubmit = async () => {
        if (
            !newKPIStaff.staffId ||
            !newKPIStaff.groupId ||
            !newKPIStaff.year ||
            !newKPIStaff.month ||
            !newKPIStaff.pgTimeGoal ||
            !newKPIStaff.machineTimeGoal ||
            !newKPIStaff.manufacturingPoint ||
            !newKPIStaff.oleGoal ||
            !newKPIStaff.workGoal ||
            !newKPIStaff.kpi
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        try {
            console.log("newKPIStaff")
            console.log(newKPIStaff)
            const response = await fetch(
                `${urlLink}/api/staff-kpi`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        staffId: newKPIStaff.staffId,
                        kpi: newKPIStaff.kpi,
                        year: newKPIStaff.year,
                        month: newKPIStaff.month,
                        workGoal: newKPIStaff.workGoal,
                        pgTimeGoal: newKPIStaff.pgTimeGoal,
                        machineTimeGoal: newKPIStaff.machineTimeGoal,
                        manufacturingPoint: newKPIStaff.manufacturingPoint,
                        oleGoal: newKPIStaff.oleGoal,
                        groupId: newKPIStaff.groupId,
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
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
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
                            onChange={(val) => setNewKPIStaff({ ...newKPIStaff, staffId: val })}
                            displayField="staffName"
                            valueField="id"
                            placeholder="Tên nhân viên"
                            allowCustom={false}
                        />
                    </div>

                    <div className="grid">
                        <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                        <Select
                            value={newKPIStaff.groupId?.toString() ?? ""}
                            onValueChange={(value) => setNewKPIStaff({ ...newKPIStaff, groupId: value })}
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
                </div>
                <div className="grid gap-4 grid-cols-2 pb-3">
                    <div className="grid">
                        <Label htmlFor="year" className="text-lg !font-normal">Năm</Label>
                        <SelectYear
                            value={newKPIStaff.year?.toString() ?? undefined}
                            onChange={(value) =>
                                setNewKPIStaff({ ...newKPIStaff, year: Number(value) })
                            }
                            totalYears={5}
                            placeholder="Chọn năm"
                        />
                    </div>
                    <div className="grid">
                        <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                        <SelectMonth
                            value={newKPIStaff.month?.toString() ?? undefined}
                            onChange={(value) =>
                                setNewKPIStaff({ ...newKPIStaff, month: Number(value) })
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
                            value={newKPIStaff.kpi !== null ? newKPIStaff.kpi.toString() : ""}
                            onChange={(e) =>
                                setNewKPIStaff({
                                    ...newKPIStaff,
                                    kpi: e.target.value === "" ? null : Number(e.target.value),
                                })
                            }
                            className="!text-lg placeholder:text-[16px]"
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="workGoal" className="text-lg !font-normal">Mục tiêu nhân viên làm việc</Label>
                        <Input
                            className="!text-lg placeholder:text-[16px]"
                            id="workGoal"
                            placeholder="Mục tiêu làm việc"
                            type="number"
                            inputMode="numeric"
                            value={newKPIStaff.workGoal !== null ? newKPIStaff.workGoal.toString() : ""}
                            onChange={(e) =>
                                setNewKPIStaff({ ...newKPIStaff, workGoal: Number(e.target.value) })
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
                            className="!text-lg placeholder:text-[16px]"
                            value={newKPIStaff.pgTimeGoal !== null ? newKPIStaff.pgTimeGoal.toString() : ""}
                            onChange={(e) =>
                                setNewKPIStaff({ ...newKPIStaff, pgTimeGoal: Number(e.target.value) })
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
                            className="!text-lg placeholder:text-[16px]"
                            value={newKPIStaff.machineTimeGoal !== null ? newKPIStaff.machineTimeGoal.toString() : ""}
                            onChange={(e) =>
                                setNewKPIStaff({ ...newKPIStaff, machineTimeGoal: Number(e.target.value) })
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
                            className="!text-lg placeholder:text-[16px]"
                            value={newKPIStaff.manufacturingPoint !== null ? newKPIStaff.manufacturingPoint.toString() : ""}
                            onChange={(e) =>
                                setNewKPIStaff({ ...newKPIStaff, manufacturingPoint: Number(e.target.value) })
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






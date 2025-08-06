"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Staff } from "@/lib/type"

type EditStaffFormProps = {
    initialData: Staff
    onUpdate: (updated: Staff) => void
    onCancel: () => void
}
const labelMap: Record<keyof Staff, string> = {
    staffId: "Mã nhân viên",
    staffName: "Tên nhân viên",
    staffOffice: "Phòng ban",
    staffSection: "Công việc",
    groupName: "Nhóm",
    id: "",
    shortName: "",
    status: "",
    groupId: "",
    staffKpiDtos: ""
}

export default function EditStaffForm({
    initialData,
    onUpdate,
    onCancel,
}: EditStaffFormProps) {
    const [staff, setStaff] = useState<Staff>(initialData)

    const handleUpdate = () => {
        if (!staff.staffId || !staff.id || !staff.staffName) {
            alert("Vui lòng nhập đầy đủ thông tin.")
            return
        }
        onUpdate(staff)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                {Object.keys(staff).map((field) => (
                    <div key={field} className="space-y-1">
                        {/* <Label htmlFor={field}>{field.replace(/_/g, " ").toUpperCase()}</Label> */}
                        {/* <Label htmlFor={field}>
                            {field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                        </Label> */}
                        <Label htmlFor={field}>
                            {labelMap[field as keyof Staff] || field}
                        </Label>
                        <Input
                            id={field}
                            type="text"
                            value={(staff as any)[field]}
                            onChange={(e) =>
                                setStaff((prev) => ({
                                    ...prev,
                                    [field]: e.target.value,
                                }))
                            }
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4]">
                    Lưu thay đổi
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
            </div>
        </div>
    )
}

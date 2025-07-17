"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Operator } from "@/lib/type"

type EditOperatorFormProps = {
    initialData: Operator
    onUpdate: (updated: Operator) => void
    onCancel: () => void
}
const labelMap: Record<keyof Operator, string> = {
    stt: "Số thứ tự",
    id: "Mã nhân viên",
    name: "Tên nhân viên",
    phong_ban: "Phòng ban",
    nhom: "Nhóm",
    cong_viec: "Công việc",
}

export default function EditOperatorForm({
    initialData,
    onUpdate,
    onCancel,
}: EditOperatorFormProps) {
    const [operator, setOperator] = useState<Operator>(initialData)

    const handleUpdate = () => {
        if (!operator.stt || !operator.id || !operator.name) {
            alert("Vui lòng nhập đầy đủ thông tin.")
            return
        }
        onUpdate(operator)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                {Object.keys(operator).map((field) => (
                    <div key={field} className="space-y-1">
                        {/* <Label htmlFor={field}>{field.replace(/_/g, " ").toUpperCase()}</Label> */}
                        {/* <Label htmlFor={field}>
                            {field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                        </Label> */}
                        <Label htmlFor={field}>
                            {labelMap[field as keyof Operator] || field}
                        </Label>
                        <Input
                            id={field}
                            type="text"
                            value={(operator as any)[field]}
                            onChange={(e) =>
                                setOperator((prev) => ({
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

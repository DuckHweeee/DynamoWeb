"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DrawingCode } from "@/lib/type"

type EditDrawingCodeFormProps = {
    initialData: DrawingCode
    onUpdate: (updated: DrawingCode) => void
    onCancel: () => void
}

const labelMap: Record<keyof DrawingCode, string> = {
    id: "STT",
    ma_ban_ve: "Mã bản vẽ",
    dnc: "DNC",
    trang_thai: "Trạng thái",
}

export default function EditDrawingCodeForm({
    initialData,
    onUpdate,
    onCancel,
}: EditDrawingCodeFormProps) {
    const [drawingCode, setDrawingCode] = useState<DrawingCode>(initialData)

    const handleUpdate = () => {
        if (!drawingCode.id || !drawingCode.ma_ban_ve || !drawingCode.dnc) {
            alert("Vui lòng nhập đầy đủ thông tin.")
            return
        }
        onUpdate(drawingCode)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                {Object.keys(drawingCode).map((field) => (
                    <div key={field} className="space-y-1">
                        <Label htmlFor={field}>
                            {labelMap[field as keyof DrawingCode] || field}
                        </Label>

                        {field === "trang_thai" ? (
                            <Select
                                value={drawingCode.trang_thai}
                                onValueChange={(value) =>
                                    setDrawingCode((prev) => ({
                                        ...prev,
                                        trang_thai: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                                    <SelectItem value="Chưa hoàn thành">Chưa hoàn thành</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                id={field}
                                type="text"
                                value={(drawingCode as any)[field]}
                                onChange={(e) =>
                                    setDrawingCode((prev) => ({
                                        ...prev,
                                        [field]: e.target.value,
                                    }))
                                }
                            />
                        )}
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

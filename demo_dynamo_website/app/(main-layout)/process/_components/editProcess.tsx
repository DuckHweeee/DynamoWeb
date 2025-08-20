"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Process } from "@/lib/type"

type EditProcessFormProps = {
    initialData: Process
    onUpdate: (updated: Process) => void
    onCancel: () => void
}

const labelMap: Record<keyof Process, string> = {
    id: "STT",
    ma_ban_ve: "Mã bản vẽ",
    dnc: "DNC",
    tgdk: "Thời gian đăng ký (giây)",
    snc: "Số NC",
    ttnc: "TTNC",
    trang_thai: "Trạng thái",
}

export default function EditProcessForm({
    initialData,
    onUpdate,
    onCancel,
}: EditProcessFormProps) {
    const [process, setProcess] = useState<Process>(initialData)

    const handleUpdate = () => {
        const { id, ma_ban_ve, dnc, tgdk, snc, ttnc } = process
        if (!id || !ma_ban_ve || !dnc || !tgdk || !snc || !ttnc) {
            alert("Vui lòng nhập đầy đủ thông tin.")
            return
        }
        onUpdate(process)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                {Object.keys(process).map((field) => (
                    <div key={field} className="space-y-1">
                        <Label htmlFor={field}>
                            {labelMap[field as keyof Process] || field}
                        </Label>

                        {field === "trang_thai" ? (
                            <Select
                                value={process.trang_thai}
                                onValueChange={(value) =>
                                    setProcess((prev) => ({
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
                                type={
                                    ["dnc", "tgdk", "snc", "ttnc"].includes(field)
                                        ? "number"
                                        : "text"
                                }
                                value={(process as any)[field]}
                                onChange={(e) =>
                                    setProcess((prev) => ({
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

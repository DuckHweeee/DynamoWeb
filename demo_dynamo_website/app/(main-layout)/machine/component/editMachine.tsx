"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Machine2 } from "@/lib/type"

type EditMachineFormProps = {
    initialData: Machine2
    onUpdate: (updated: Machine2) => void
    onCancel: () => void
}

export default function EditMachineForm({
    initialData,
    onUpdate,
    onCancel,
}: EditMachineFormProps) {
    const [machine, setMachine] = useState<Machine>(initialData)

    const handleUpdate = () => {
        if (!machine.id || !machine.name || !machine.ma_may) {
            alert("Vui lòng nhập đầy đủ thông tin.")
            return
        }
        onUpdate(machine)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                {Object.keys(machine).map((field) => (
                    <div key={field} className="space-y-1">
                        <Label htmlFor={field}>
                            {labelMap[field as keyof Machine] || field}
                        </Label>
                        <Input
                            id={field}
                            type="text"
                            value={(machine as any)[field]}
                            onChange={(e) =>
                                setMachine((prev) => ({
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

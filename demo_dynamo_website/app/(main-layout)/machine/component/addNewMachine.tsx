"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { Machine } from "@/lib/type"

type AddMachineFormProps = {
    onAdd: (machine: Machine) => void
    onCancel: () => void
}

export default function AddMachineForm({ onAdd, onCancel }: AddMachineFormProps) {
    const [newMachine, setNewMachine] = useState<Machine>({
        id: "",
        name: "",
        loai_may: "",
        ma_may: "",
    })

    const handleSubmit = () => {
        if (!newMachine.id || !newMachine.name || !newMachine.ma_may) {
            toast.error("Vui lòng nhập đầy đủ thông tin.")
            return
        }

        onAdd(newMachine)

        // Reset form
        setNewMachine({
            id: "",
            name: "",
            loai_may: "",
            ma_may: "",
        })
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="id">STT</Label>
                    <Input
                        id="id"
                        placeholder="STT"
                        value={newMachine.id}
                        onChange={(e) => setNewMachine({ ...newMachine, id: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Tên máy</Label>
                    <Input
                        id="name"
                        placeholder="Tên máy"
                        value={newMachine.name}
                        onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="loai_may">Loại máy</Label>
                    <Input
                        id="loai_may"
                        placeholder="Loại máy"
                        value={newMachine.loai_may}
                        onChange={(e) => setNewMachine({ ...newMachine, loai_may: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="ma_may">Mã máy</Label>
                    <Input
                        id="ma_may"
                        placeholder="Mã máy"
                        value={newMachine.ma_may}
                        onChange={(e) => setNewMachine({ ...newMachine, ma_may: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-2 justify-end">
                <Button onClick={handleSubmit} className="bg-[#074695] hover:bg-[#0754B4]">
                    Lưu
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
            </div>
        </div>
    )
}

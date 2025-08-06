"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Operator } from "@/lib/type"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

type AddOperatorFormProps = {
    onAdd: (operator: Operator) => void
    onCancel: () => void
}

export default function AddOperatorForm({ onAdd, onCancel }: AddOperatorFormProps) {
    const [newOperator, setNewOperator] = useState<Operator>({
        stt: "",
        id: "",
        name: "",
        phong_ban: "",
        nhom: "",
        cong_viec: ""
    })


    const handleSubmit = () => {
        if (!newOperator.stt || !newOperator.id || !newOperator.name) {
            toast.error("Vui lòng chọn đầy đủ thông tin.");
            return
        }
        onAdd(newOperator)
        setNewOperator({
            stt: "",
            id: "",
            name: "",
            phong_ban: "",
            nhom: "",
            cong_viec: ""
        })
    }

    return (
        <div className="space-y-3">
            <div className="grid  gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="id">Mã nhân viên</Label>
                    <Input
                        id="id"
                        placeholder="Mã nhân viên"
                        value={newOperator.id}
                        onChange={(e) => setNewOperator({ ...newOperator, id: e.target.value })}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Tên nhân viên</Label>
                    <Input
                        id="name"
                        placeholder="Tên nhân viên"
                        value={newOperator.name}
                        onChange={(e) => setNewOperator({ ...newOperator, name: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phong_ban">Phòng ban</Label>
                    <Input
                        id="phong_ban"
                        placeholder="Phòng ban"
                        value={newOperator.phong_ban}
                        onChange={(e) => setNewOperator({ ...newOperator, phong_ban: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="nhom">Nhóm</Label>
                    <Input
                        id="nhom"
                        placeholder="Nhóm"
                        value={newOperator.nhom}
                        onChange={(e) => setNewOperator({ ...newOperator, nhom: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cong_viec">Công việc</Label>
                    <Input
                        id="cong_viec"
                        placeholder="Công Việc"
                        value={newOperator.cong_viec}
                        onChange={(e) => setNewOperator({ ...newOperator, cong_viec: e.target.value })}
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

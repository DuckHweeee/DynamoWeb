"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Process } from "@/lib/type"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type AddProcessFormProps = {
    onAdd: (process: Process) => void
    onCancel: () => void
}

export default function AddProcessForm({ onAdd, onCancel }: AddProcessFormProps) {
    const [newProcess, setNewProcess] = useState<Process>({
        id: "",
        ma_ban_ve: "",
        dnc: "",
        tgdk: "",
        snc: "",
        ttnc: "",
        trang_thai: "",
    })

    const handleSubmit = () => {
        if (
            !newProcess.id ||
            !newProcess.ma_ban_ve ||
            !newProcess.dnc ||
            !newProcess.tgdk ||
            !newProcess.snc ||
            !newProcess.ttnc
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin.")
            return
        }

        onAdd(newProcess)

        // Reset form
        setNewProcess({
            id: "",
            ma_ban_ve: "",
            dnc: "",
            tgdk: "",
            snc: "",
            ttnc: "",
            trang_thai: "",
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
                        value={newProcess.id}
                        onChange={(e) => setNewProcess({ ...newProcess, id: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="ma_ban_ve">Mã bản vẽ</Label>
                    <Input
                        id="ma_ban_ve"
                        placeholder="Mã bản vẽ"
                        value={newProcess.ma_ban_ve}
                        onChange={(e) => setNewProcess({ ...newProcess, ma_ban_ve: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="dnc">DNC</Label>
                    <Input
                        id="dnc"
                        placeholder="DNC (số)"
                        type="number"
                        value={newProcess.dnc}
                        onChange={(e) => setNewProcess({ ...newProcess, dnc: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="tgdk">Thời gian đăng ký (giây)</Label>
                    <Input
                        id="tgdk"
                        placeholder="Thời gian đăng ký (giây)"
                        type="number"
                        value={newProcess.tgdk}
                        onChange={(e) => setNewProcess({ ...newProcess, tgdk: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="snc">Số NC</Label>
                    <Input
                        id="snc"
                        placeholder="Số NC"
                        type="number"
                        value={newProcess.snc}
                        onChange={(e) => setNewProcess({ ...newProcess, snc: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="ttnc">TTNC</Label>
                    <Input
                        id="ttnc"
                        placeholder="TTNC"
                        type="number"
                        value={newProcess.ttnc}
                        onChange={(e) => setNewProcess({ ...newProcess, ttnc: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="trang_thai">Trạng thái</Label>
                    <Select
                        value={newProcess.trang_thai}
                        onValueChange={(value) =>
                            setNewProcess((prev) => ({
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

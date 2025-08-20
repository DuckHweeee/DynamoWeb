"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { DrawingCode } from "@/lib/type"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AddDrawingCodeFormProps = {
    onAdd: (drawing: DrawingCode) => void
    onCancel: () => void
}

export default function AddDrawingCodeForm({ onAdd, onCancel }: AddDrawingCodeFormProps) {
    const [newDrawing, setNewDrawing] = useState<DrawingCode>({
        id: "",
        ma_ban_ve: "",
        dnc: "",
        trang_thai: "",
    })

    const handleSubmit = () => {
        if (!newDrawing.id || !newDrawing.ma_ban_ve || !newDrawing.dnc) {
            toast.error("Vui lòng nhập đầy đủ thông tin.")
            return
        }

        onAdd(newDrawing)

        // Reset form
        setNewDrawing({
            id: "",
            ma_ban_ve: "",
            dnc: "",
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
                        value={newDrawing.id}
                        onChange={(e) => setNewDrawing({ ...newDrawing, id: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="ma_ban_ve">Mã bản vẽ</Label>
                    <Input
                        id="ma_ban_ve"
                        placeholder="Mã bản vẽ"
                        value={newDrawing.ma_ban_ve}
                        onChange={(e) => setNewDrawing({ ...newDrawing, ma_ban_ve: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="dnc">DNC</Label>
                    <Input
                        id="dnc"
                        placeholder="DNC"
                        value={newDrawing.dnc}
                        onChange={(e) => setNewDrawing({ ...newDrawing, dnc: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="trang_thai">Trạng thái</Label>
                    <Select
                        value={newDrawing.trang_thai}
                        onValueChange={(value) =>
                            setNewDrawing((prev) => ({
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

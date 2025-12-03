"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { DrawingCode } from "@/lib/type"

type AddDrawingCodeFormProps = {
    onAdd: (drawing: DrawingCode) => void
    onCancel: () => void
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function AddDrawingCodeForm({ onAdd, onCancel }: AddDrawingCodeFormProps) {
    const [addNewDrawingCode, setAddNewDrawingCode] = useState({
        drawingCodeName: "",
    })
    const handleSubmit = async () => {
        if (!addNewDrawingCode.drawingCodeName.trim()) {
            toast.error("Vui lòng nhập mã bản vẽ.");
            return;
        }
        try {
            const response = await fetch(
                `${url}/api/drawing-code`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        drawingCodeName: addNewDrawingCode.drawingCodeName,
                        status: 1,
                    }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Thêm mới thành công!");
            // onUpdate({ ...drawingCode, ...updateDrawingCode });
            location.reload()
            onCancel()
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-">
                <Label htmlFor="id" className="text-xl">Mã bản vẽ</Label>
                <Input
                    id="id"
                    placeholder="Mã bản vẽ"
                    value={addNewDrawingCode.drawingCodeName}
                    onChange={(e) => setAddNewDrawingCode({ ...addNewDrawingCode, drawingCodeName: e.target.value })}
                />
            </div>

            <div className="flex gap-4 pt-2 justify-end">
                <Button variant="outline" onClick={onCancel} className="py-5 px-6 text-lg cursor-pointer">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} className="bg-[#074695] hover:bg-[#0754B4] py-5 px-6 text-xl cursor-pointer">
                    Lưu
                </Button>
            </div>
        </div >
    )
}

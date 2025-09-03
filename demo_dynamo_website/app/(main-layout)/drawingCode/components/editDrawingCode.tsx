"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DrawingCode } from "@/lib/type"
import { toast } from "sonner"

type EditDrawingCodeFormProps = {
    initialData: DrawingCode
    onUpdate: (updated: DrawingCode) => void
    onCancel: () => void
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function EditDrawingCodeForm({
    initialData,
    onUpdate,
    onCancel,
}: EditDrawingCodeFormProps) {
    const [drawingCode] = useState<DrawingCode>(initialData)
    const [updateDrawingCode, setUpdateDrawingCode] = useState({
        drawingCodeName: "",
        status: 1,
    })
    useEffect(() => {
        if (drawingCode) {
            setUpdateDrawingCode({
                drawingCodeName: drawingCode.drawingCodeName ?? "",
                status: drawingCode.status ?? 1,
            })
        }
    }, [drawingCode])

    const handleUpdate = async () => {
        if (!updateDrawingCode.drawingCodeName.trim()) {
            toast.error("Vui lòng nhập mã bản vẽ.");
            return;
        }
        try {
            const response = await fetch(
                `${url}/api/drawing-code/${drawingCode.drawingCodeId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        drawingCodeId: drawingCode.drawingCodeId,
                        drawingCodeName: updateDrawingCode.drawingCodeName,
                        status: updateDrawingCode.status,
                    }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Chỉnh sửa thành công!");
            // onUpdate({ ...drawingCode, ...updateDrawingCode });
            location.reload()
            onCancel()
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-3">
                <div className="grid gap-1">
                    <Label htmlFor="drawingCodeName" className="text-xl">Mã bản vẽ</Label>
                    <Input
                        id="drawingCodeName"
                        placeholder="Mã bản vẽ"
                        className="!text-xl"
                        value={updateDrawingCode.drawingCodeName}
                        onChange={(e) => setUpdateDrawingCode({ ...updateDrawingCode, drawingCodeName: e.target.value })}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="status" className="text-xl">Trạng thái</Label>
                    <Select
                        value={String(updateDrawingCode.status)}
                        onValueChange={(value) =>
                            setUpdateDrawingCode({
                                ...updateDrawingCode,
                                status: Number(value),
                            })
                        }
                    >
                        <SelectTrigger className="w-full text-xl">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="0" className="text-xl">Hết hiệu lực</SelectItem>
                            <SelectItem value="1" className="text-xl">Còn hiệu lực</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            </div>
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel} className=" py-6 px-8 text-lg">
                    Hủy
                </Button>
                <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4] py-6 px-8 text-lg">
                    Lưu thay đổi
                </Button>
            </div>
        </div>
    )
}

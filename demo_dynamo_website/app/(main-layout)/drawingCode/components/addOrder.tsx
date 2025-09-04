"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { Order } from "@/lib/type"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AddOrderFormProps = {
    onAdd: (drawing: Order) => void
    onCancel: () => void
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function AddOrderForm({ onAdd, onCancel }: AddOrderFormProps) {
    const [addNewOrder, setAddNewOrder] = useState({
        poNumber: "",
    })
    const handleSubmit = async () => {
        if (!addNewOrder.poNumber.trim()) {
            toast.error("Vui lòng nhập số PO.");
            return;
        }
        try {
            const response = await fetch(
                `${url}/api/order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        poNumber: addNewOrder.poNumber,
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
                <Label htmlFor="id" className="text-xl">Số PO</Label>
                <Input
                    id="id"
                    placeholder="Mã bản vẽ"
                    value={addNewOrder.poNumber}
                    onChange={(e) => setAddNewOrder({ ...addNewOrder, poNumber: e.target.value })}
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

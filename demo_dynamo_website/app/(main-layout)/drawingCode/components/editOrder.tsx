"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DrawingCode, Order } from "@/lib/type"
import { toast } from "sonner"

type EditOrderFormProps = {
    initialData: Order
    onUpdate: (updated: Order) => void
    onCancel: () => void
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function EditOrderForm({
    initialData,
    onUpdate,
    onCancel,
}: EditOrderFormProps) {
    const [order] = useState<Order>(initialData)
    const [updateOrder, setUpdateOrdere] = useState({
        poNumber: "",
        status: 1,
    })
    useEffect(() => {
        if (order) {
            setUpdateOrdere({
                poNumber: order.poNumber ?? "",
                status: order.status ?? 1,
            })
        }
    }, [order])

    const handleUpdate = async () => {
        if (!updateOrder.poNumber.trim()) {
            toast.error("Vui lòng nhập PO.");
            return;
        }
        try {
            const response = await fetch(
                `${url}/api/order/${order.orderId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orderId: order.orderId,
                        poNumber: updateOrder.poNumber,
                        status: updateOrder.status,
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
                    <Label htmlFor="drawingCodeName" className="text-xl">Số PO</Label>
                    <Input
                        id="drawingCodeName"
                        placeholder="Mã bản vẽ"
                        className="!text-xl"
                        value={updateOrder.poNumber}
                        onChange={(e) => setUpdateOrdere({ ...updateOrder, poNumber: e.target.value })}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="status" className="text-xl">Trạng thái</Label>
                    <Select
                        value={String(updateOrder.status)}
                        onValueChange={(value) =>
                            setUpdateOrdere({
                                ...updateOrder,
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

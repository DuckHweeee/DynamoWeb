"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { FlexibleCombobox } from "./FlexibleCombobox"
import "react-datepicker/dist/react-datepicker.css"
import { OrderDetail } from "../lib/type"
import { processingObjectList } from "../lib/data"
import { useOrder } from "../hooks/useOrder"
import { useDrawingCode } from "../hooks/useDrawingCode"
import { useGroup } from "../hooks/useGroup"
type AddOrderDetailFormProps = {
    onAdd: (orderDetail: OrderDetail) => void
    onCancel: () => void
}
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function AddOrderDetailForm({ onCancel }: AddOrderDetailFormProps) {
    const { data: orderList } = useOrder()
    const { data: drawingCodeList } = useDrawingCode()
    const { data: groupList } = useGroup()
    const [newNewOrderDetail, setNewOrderDetail] = useState({
        drawingCodeId: "",
        orderId: "",
        managerGroupId: "",
        orderType: "",
        quantity: "",
        pgTimeGoal: ""
    });
    const handleSubmit = async () => {
        if (
            !newNewOrderDetail.drawingCodeId ||
            !newNewOrderDetail.orderId ||
            !newNewOrderDetail.managerGroupId ||
            !newNewOrderDetail.orderType ||
            !newNewOrderDetail.pgTimeGoal.trim() ||
            !newNewOrderDetail.quantity.trim()
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin nhân viên.");
            return;
        }
        try {
            const response = await fetch(
                `${urlLink}/api/order-detail`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        drawingCodeId: newNewOrderDetail.drawingCodeId,
                        orderId: newNewOrderDetail.orderId,
                        managerGroupId: newNewOrderDetail.managerGroupId,
                        orderType: newNewOrderDetail.orderType,
                        pgTimeGoal: newNewOrderDetail.pgTimeGoal,
                        quantity: newNewOrderDetail.quantity,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Thêm nhân viên và KPI thành công!");
            location.reload()
            onCancel();
            setNewOrderDetail({
                drawingCodeId: "",
                orderId: "",
                managerGroupId: "",
                orderType: "",
                quantity: "",
                pgTimeGoal: ""
            });
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-2 grid-cols-2">
                <div className="grid gap-1">
                    <Label htmlFor="process" className="text-lg">Mã Đơn Hàng</Label>
                    <FlexibleCombobox
                        options={orderList || []}
                        value={newNewOrderDetail.orderId}
                        onChange={(val) => setNewOrderDetail({ ...newNewOrderDetail, orderId: val })}
                        displayField="poNumber"
                        valueField="orderId"
                        placeholder="Chọn mã đơn hàng"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="staff" className="text-lg">Mã Bản Vẽ</Label>
                    <FlexibleCombobox
                        options={drawingCodeList || []}
                        value={newNewOrderDetail.drawingCodeId}
                        onChange={(val) => setNewOrderDetail({ ...newNewOrderDetail, drawingCodeId: val })}
                        displayField="drawingCodeName"
                        valueField="drawingCodeId"
                        placeholder="Chọn mã bản vẽ"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="partNumber" className="text-lg">Đối Tượng Gia Công</Label>
                    <FlexibleCombobox
                        options={processingObjectList}
                        value={newNewOrderDetail.orderType}
                        onChange={(val) => setNewOrderDetail({ ...newNewOrderDetail, orderType: val })}
                        displayField="name"
                        valueField="name"
                        placeholder="Chọn đối tượng gia công"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="quantity" className="text-lg">Số Lượng</Label>
                    <Input
                        id="quantity"
                        type="number"
                        placeholder="Số Lượng"
                        className="!text-xl !placeholder-gray-300"
                        value={newNewOrderDetail.quantity}
                        onChange={(e) =>
                            setNewOrderDetail({
                                ...newNewOrderDetail,
                                quantity: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="managerGroupName" className="text-lg">Nhóm</Label>
                    <FlexibleCombobox
                        options={groupList}
                        value={newNewOrderDetail.managerGroupId}
                        onChange={(val) => setNewOrderDetail({ ...newNewOrderDetail, managerGroupId: val })}
                        displayField="groupName"
                        valueField="groupId"
                        placeholder="Chọn nhóm"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="pgTime" className="text-lg">PG Dự Kiến</Label>
                    <Input
                        id="pgTime"
                        type="number"
                        placeholder="Giờ PG dự kiến"
                        className="!text-xl !placeholder-gray-300"
                        value={newNewOrderDetail.pgTimeGoal}
                        onChange={(e) =>
                            setNewOrderDetail({
                                ...newNewOrderDetail,
                                pgTimeGoal: e.target.value,
                            })
                        }
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-2 justify-end">
                <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer">
                    Lưu
                </Button>
            </div>
        </div >
    )
}

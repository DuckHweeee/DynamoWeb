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
        orderCode: "",
        managerGroupId: "",
        orderType: "",
        quantity: "",
        pgTimeGoal: "",
        office: "",
        numberOfSteps: ""
    });
    const officeList = [
        { name: "MOLD", value: "MOLD" },
        { name: "PIN", value: "PIN" },
        { name: "D_INSERT1", value: "D_INSERT1" }
    ];
    const handleSubmit = async () => {
        if (
            !newNewOrderDetail.orderCode ||
            !newNewOrderDetail.numberOfSteps ||
            !newNewOrderDetail.managerGroupId ||
            !newNewOrderDetail.orderType ||
            !newNewOrderDetail.pgTimeGoal.trim() ||
            !newNewOrderDetail.quantity.trim() ||
            !newNewOrderDetail.office.trim()
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
                        orderCode: newNewOrderDetail.orderCode,
                        numberOfSteps: newNewOrderDetail.numberOfSteps,
                        managerGroupId: newNewOrderDetail.managerGroupId,
                        orderType: newNewOrderDetail.orderType,
                        pgTimeGoal: newNewOrderDetail.pgTimeGoal,
                        quantity: newNewOrderDetail.quantity,
                        office: newNewOrderDetail.office
                    }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Thêm mã hàng gia công thành công!");
            location.reload()
            onCancel();
            setNewOrderDetail({
                orderCode: "",
                managerGroupId: "",
                orderType: "",
                quantity: "",
                pgTimeGoal: "",
                office: "",
                numberOfSteps: "",

            });
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-2 grid-cols-2">
                <div className="grid gap-1">
                    <Label htmlFor="process" className="text-lg">ID Mã hàng</Label>
                    {/* <FlexibleCombobox
                        options={orderList || []}
                        value={newNewOrderDetail.orderDetailId}
                        onChange={(val) => setNewOrderDetail({ ...newNewOrderDetail, orderDetailId: val })}
                        displayField="poNumber"
                        valueField="orderId"
                        placeholder="Nhập ID mã hàng"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    /> */}
                    <Input
                        id="orderDetailId"
                        type="text"
                        placeholder="Nhập ID mã hàng"
                        className="!text-xl !placeholder-gray-300"
                        value={newNewOrderDetail.orderCode}
                        onChange={(e) =>
                            setNewOrderDetail({
                                ...newNewOrderDetail,
                                orderCode: e.target.value,
                            })
                        }
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
                    <Label htmlFor="quantity" className="text-lg">Số lượng nguyên công</Label>
                    <Input
                        id="quantity"
                        type="number"
                        placeholder="Số Lượng nguyên công"
                        className="!text-xl !placeholder-gray-300"
                        value={newNewOrderDetail.numberOfSteps}
                        onChange={(e) =>
                            setNewOrderDetail({
                                ...newNewOrderDetail,
                                numberOfSteps: e.target.value,
                            })
                        }
                    />
                </div>        
                <div className="grid gap-1">
                    <Label htmlFor="quantity" className="text-lg">Số Lượng</Label>
                    <Input
                        id="quantity"
                        type="number"
                        placeholder="Nhập Số Lượng"
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
                    <Label htmlFor="office" className="text-lg">Phòng sản xuất</Label>
                    <FlexibleCombobox
                        options={officeList}
                        value={newNewOrderDetail.office}
                        onChange={(val) => setNewOrderDetail({ ...newNewOrderDetail, office: val })}
                        displayField="name"
                        valueField="value"
                        placeholder="Chọn phòng sản xuất"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="pgTime" className="text-lg">PG Dự Kiến(Phút)</Label>
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

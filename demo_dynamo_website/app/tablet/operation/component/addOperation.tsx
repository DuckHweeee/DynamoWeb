"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { OrderDetailDto, Staff } from "@/lib/type"
import { FlexibleCombobox } from "./FlexibleCombobox"
import axios from "axios"
import { toast } from "sonner"
import { processingObjectList } from "../../lib/data"

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    staffList: Staff[]
    selectedMachineId: string
}
export default function CreateProcessDialog({
    open,
    onOpenChange,
    staffList,
    selectedMachineId,
}: Props) {
    const [formData, setFormData] = useState({
        staffId: "",
        processType: "",
        stepNumber: "",
        manufacturingPoint: "",
        pgTime: "",
        partNumber: "",
        orderCode: "",
    })

    // Đã test ok, còn thiếu trường hợp Mã hàng nằm ngoài thì bật 1 dialog để tạo mới sau đó mới được chọn
    const handleSubmit = async () => {
        const requiredFields = [
            "staffId",
            "processType",
            "stepNumber",
            "manufacturingPoint",
            "pgTime",
            "partNumber",
            "orderCode",
        ];

        const emptyFields = requiredFields.filter((field) => !formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === "");

        if (emptyFields.length > 0) {
            toast.error("Vui lòng chọn đầy đủ thông tin.");
            return;
        }

        // Hiển thị thông tin để xác nhận
        const confirmMessage = `
                        Xác nhận gửi thông tin sau:

                        - Nhân viên: ${staffList.find(st => st.staffId === Number(formData.staffId))?.staffName || formData.staffId}
                        - Đối tượng gia công: ${formData.processType}
                        - Thứ tự sản phẩm: ${formData.partNumber}
                        - Thứ tự gia công: ${formData.stepNumber}
                        - Điểm gia công: ${formData.manufacturingPoint}
                        - Giờ PG: ${formData.pgTime}
                        - Mã hàng: ${formData.orderCode}

                        Bạn có chắc chắn muốn gửi không?
                `.trim();

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const response = await fetch(
                `${urlLink}/api/drawing-code-process/by-operator`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        stepNumber: Number(formData.stepNumber),
                        partNumber: Number(formData.partNumber),
                        manufacturingPoint: Number(formData.manufacturingPoint),
                        processType: formData.processType,
                        pgTime: Number(formData.pgTime),
                        orderCode: formData.orderCode,
                        machineId: Number(selectedMachineId),
                        staffId: formData.staffId,
                        operatorHistories: null
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Gửi thành công!");
            setFormData({
                staffId: "",
                processType: "",
                stepNumber: "",
                manufacturingPoint: "",
                pgTime: "",
                partNumber: "",
                orderCode: "",
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi cập gửi:", error);
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    // Fetch mã hàng
    const [orderDetail, setOrderDetail] = useState<OrderDetailDto[] | null>(null);
    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await axios.get<OrderDetailDto[]>(
                    `${urlLink}/api/order-detail`
                );
                setOrderDetail(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu mã hàng:", error);
                setOrderDetail(null);
            }
        };
        fetchOrderDetail();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-6xl top-3 max-[1300px]:!top-23  translate-y-0 !gap-0 !px-8">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">Tạo Mới Thông Tin Gia Công</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pb-6">
                    <div className="grid gap-1">
                        <Label htmlFor="process" className="text-2xl">Đối tượng gia công</Label>
                        <FlexibleCombobox
                            options={processingObjectList}
                            value={formData.processType}
                            onChange={(val) => setFormData({ ...formData, processType: val })}
                            displayField="name"
                            valueField="name"
                            placeholder="Chọn Đối Tượng Gia Công"
                            allowCustom={false}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="staff" className="text-2xl">ID Mã Hàng</Label>
                        <FlexibleCombobox
                            options={orderDetail || []}
                            value={formData.orderCode}
                            onChange={(val) => setFormData({ ...formData, orderCode: val })}
                            displayField="orderCode"
                            valueField="orderCode"
                            placeholder="ID Mã Hàng"
                            allowCustom={false}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="partNumber" className="text-2xl">Thứ Tự Sản Phẩm</Label>
                        <Input
                            id="partNumber"
                            type="number"
                            placeholder="Thứ Tự Sản Phẩm"
                            className="!text-xl !placeholder-gray-300"
                            value={formData.partNumber}
                            onChange={(e) =>
                                setFormData({ ...formData, partNumber: e.target.value })
                            }
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="stepNumber" className="text-2xl">Thứ Tự Gia Công</Label>
                        <Input
                            id="stepNumber"
                            type="number"
                            placeholder="Thứ Tự  Gia Công"
                            className="!text-xl !placeholder-gray-300"
                            value={formData.stepNumber}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    stepNumber: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="manufacturingPoint" className="text-2xl">Điểm Gia Công</Label>
                        <Input
                            id="manufacturingPoint"
                            type="number"
                            placeholder="Điểm Gia Công"
                            className="!text-xl !placeholder-gray-300"
                            value={formData.manufacturingPoint}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    manufacturingPoint: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="pgTime" className="text-2xl">Giờ PG</Label>
                        <Input
                            id="pgTime"
                            type="number"
                            placeholder="Giờ PG"
                            className="!text-xl !placeholder-gray-300"
                            value={formData.pgTime}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    pgTime: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="operator" className="text-2xl">Nhân viên</Label>
                        <FlexibleCombobox
                            options={staffList}
                            value={formData.staffId}
                            onChange={(val) => setFormData({ ...formData, staffId: val })}
                            displayField="staffId"
                            valueField="staffId"
                            placeholder="Chọn nhân viên"
                            allowCustom={false}
                        />
                    </div>

                    <div className="flex justify-end mt-2">
                        <Button
                            onClick={handleSubmit}
                            className="bg-green-700 hover:bg-green-600 text-2xl font-bold px-13 py-8.5"
                        >
                            Gửi
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

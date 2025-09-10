"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Machine2, OrderDetailDto, Staff } from "@/lib/type";
import axios from "axios";
import { toast } from "sonner";
import { useMachine } from "./hooks/useMachine";
import { FlexibleCombobox } from "./components/FlexibleCombobox";
import { processingObjectList } from "../../lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation";
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CreateProcessPage() {
    const router = useRouter()
    const { data: machineList } = useMachine();
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [orderDetail, setOrderDetail] = useState<OrderDetailDto[] | null>(null);

    const [formData, setFormData] = useState({
        staffId: "",
        processType: "",
        stepNumber: "",
        manufacturingPoint: "",
        pgTime: "",
        partNumber: "",
        orderCode: "",
        machineId: "",
    });

    // Fetch staff
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axios.get<Staff[]>(`${urlLink}/api/staff`);
                setStaffList(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy staff:", error);
            }
        };
        fetchStaff();
    }, []);

    // Fetch order detail
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

    const handleSubmit = async () => {
        const requiredFields = [
            "staffId",
            "processType",
            "stepNumber",
            "manufacturingPoint",
            "pgTime",
            "partNumber",
            "orderCode",
            "machineId",
        ];

        const emptyFields = requiredFields.filter(
            (field) =>
                !formData[field as keyof typeof formData] ||
                formData[field as keyof typeof formData] === ""
        );

        if (emptyFields.length > 0) {
            toast.error("Vui lòng chọn đầy đủ thông tin.");
            return;
        }

        const confirmMessage = `
      Xác nhận gửi thông tin sau:
      - Đối tượng gia công: ${formData.processType}
      - Mã hàng: ${formData.orderCode}
      - Thứ tự sản phẩm: ${formData.partNumber}
      - Thứ tự gia công: ${formData.stepNumber}
      - Điểm gia công: ${formData.manufacturingPoint}
      - Giờ PG: ${formData.pgTime}
      - Nhân viên: ${staffList.find((st) => st.staffId === Number(formData.staffId))
                ?.staffName || formData.staffId
            }
      - Máy: ${machineList.find((mc) => mc.machineId === Number(formData.machineId))
                ?.machineName || formData.machineId
            }
    `.trim();

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const response = await fetch(`${urlLink}/api/drawing-code-process`, {
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
                    machineId: Number(formData.machineId),
                    staffId: formData.staffId,
                    isPlan: 0,
                }),
            });

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
                machineId: "",
            });
            // router.push("/tablet/newProcess");
            window.location.href = "/tablet/newProcess"
        } catch (error) {
            console.error("Lỗi khi gửi:", error);
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    return (
        // <div className="w-full max-w-6xl mx-auto p-6">
        //     <h1 className="text-3xl font-bold mb-6">Tạo Mới Thông Tin Gia Công</h1>
        //     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pb-6">
        //         <div className="grid gap-1">
        //             <Label className="text-2xl">Đối tượng gia công</Label>
        //             <FlexibleCombobox
        //                 options={processingObjectList}
        //                 value={formData.processType}
        //                 onChange={(val) => setFormData({ ...formData, processType: val })}
        //                 displayField="name"
        //                 valueField="name"
        //                 placeholder="Chọn Đối Tượng Gia Công"
        //                 allowCustom={false}
        //             />
        //         </div>

        //         <div className="grid gap-1">
        //             <Label className="text-2xl">ID Mã Hàng</Label>
        //             <FlexibleCombobox
        //                 options={orderDetail || []}
        //                 value={formData.orderCode}
        //                 onChange={(val) => setFormData({ ...formData, orderCode: val })}
        //                 displayField="orderCode"
        //                 valueField="orderCode"
        //                 placeholder="ID Mã Hàng"
        //                 allowCustom={false}
        //             />
        //         </div>

        //         <div className="grid gap-1">
        //             <Label className="text-2xl">Thứ Tự Sản Phẩm</Label>
        //             <Input
        //                 type="number"
        //                 placeholder="Thứ Tự Sản Phẩm"
        //                 className="!text-xl !placeholder-gray-300"
        //                 value={formData.partNumber}
        //                 onChange={(e) =>
        //                     setFormData({ ...formData, partNumber: e.target.value })
        //                 }
        //             />
        //         </div>

        //         <div className="grid gap-1">
        //             <Label className="text-2xl">Thứ Tự Gia Công</Label>
        //             <Input
        //                 type="number"
        //                 placeholder="Thứ Tự Gia Công"
        //                 className="!text-xl !placeholder-gray-300"
        //                 value={formData.stepNumber}
        //                 onChange={(e) =>
        //                     setFormData({ ...formData, stepNumber: e.target.value })
        //                 }
        //             />
        //         </div>

        //         <div className="grid gap-1">
        //             <Label className="text-2xl">Điểm Gia Công</Label>
        //             <Input
        //                 type="number"
        //                 placeholder="Điểm Gia Công"
        //                 className="!text-xl !placeholder-gray-300"
        //                 value={formData.manufacturingPoint}
        //                 onChange={(e) =>
        //                     setFormData({ ...formData, manufacturingPoint: e.target.value })
        //                 }
        //             />
        //         </div>

        //         <div className="grid gap-1">
        //             <Label className="text-2xl">Giờ PG</Label>
        //             <Input
        //                 type="number"
        //                 placeholder="Giờ PG"
        //                 className="!text-xl !placeholder-gray-300"
        //                 value={formData.pgTime}
        //                 onChange={(e) =>
        //                     setFormData({ ...formData, pgTime: e.target.value })
        //                 }
        //             />
        //         </div>

        //         <div className="grid gap-1">
        //             <Label className="text-2xl">Nhân viên</Label>
        //             <FlexibleCombobox
        //                 options={staffList}
        //                 value={formData.staffId}
        //                 onChange={(val) => setFormData({ ...formData, staffId: val })}
        //                 displayField="staffId"
        //                 valueField="staffId"
        //                 placeholder="Chọn nhân viên"
        //                 allowCustom={false}
        //             />
        //         </div>

        //         <div className="grid gap-1">
        //             <Label className="text-2xl">Máy</Label>
        //             <FlexibleCombobox
        //                 options={machineList}
        //                 value={
        //                     machineList.find(
        //                         (m) => Number(m.machineId) === Number(formData.machineId)
        //                     )?.machineName || ""
        //                 }
        //                 onChange={(selectedName) => {
        //                     const selected = machineList.find(
        //                         (m) => m.machineName === selectedName
        //                     );
        //                     setFormData({
        //                         ...formData,
        //                         machineId: selected ? String(selected.machineId) : "",
        //                     });
        //                 }}
        //                 displayField="machineName"
        //                 valueField="machineName"
        //                 placeholder="Chọn Máy"
        //                 allowCustom={false}
        //             />
        //         </div>
        //     </div>

        //     <div className="flex justify-end">
        //         <Button
        //             onClick={handleSubmit}
        //             className="bg-green-700 hover:bg-green-600 text-2xl font-bold px-13 py-8.5"
        //         >
        //             Gửi
        //         </Button>
        //     </div>
        // </div>
        <div className="w-full max-w-7xl mx-auto p-8">
            <Card className="shadow-lg border-1 rounded-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-blue-900">
                        Tạo mới thông tin gia công
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Đối tượng gia công */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-2xl font-semibold text-gray-700">Đối tượng gia công</Label>
                            <FlexibleCombobox
                                options={processingObjectList}
                                value={formData.processType}
                                onChange={(val) => setFormData({ ...formData, processType: val })}
                                displayField="name"
                                valueField="name"
                                placeholder="Chọn đối tượng"
                                allowCustom={false}
                            />
                        </div>

                        {/* ID Mã Hàng */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-2xl font-semibold text-gray-700">ID Mã Hàng</Label>
                            <FlexibleCombobox
                                options={orderDetail || []}
                                value={formData.orderCode}
                                onChange={(val) => setFormData({ ...formData, orderCode: val })}
                                displayField="orderCode"
                                valueField="orderCode"
                                placeholder="ID mã hàng"
                                allowCustom={false}
                            />
                        </div>

                        {/* Thứ tự sản phẩm */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-2xl font-semibold text-gray-700">Thứ Tự Sản Phẩm</Label>
                            <Input
                                type="number"
                                placeholder="Nhập số thứ tự"
                                className="!text-2xl py-5 placeholder:text-xl  placeholder:text-gray-300"
                                value={formData.partNumber}
                                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                            />
                        </div>

                        {/* Thứ tự gia công */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-2xl font-semibold text-gray-700">Thứ Tự Gia Công</Label>
                            <Input
                                type="number"
                                placeholder="Nhập số thứ tự"
                                className="!text-2xl py-5 placeholder:text-xl  placeholder:text-gray-300"
                                value={formData.stepNumber}
                                onChange={(e) => setFormData({ ...formData, stepNumber: e.target.value })}
                            />
                        </div>

                        {/* Điểm gia công */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-2xl font-semibold text-gray-700">Điểm Gia Công</Label>
                            <Input
                                type="number"
                                placeholder="Điểm gia công"
                                className="!text-2xl py-5 placeholder:text-xl  placeholder:text-gray-300"
                                value={formData.manufacturingPoint}
                                onChange={(e) =>
                                    setFormData({ ...formData, manufacturingPoint: e.target.value })
                                }
                            />
                        </div>

                        {/* Giờ PG */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-2xl font-semibold text-gray-700">Giờ PG</Label>
                            <Input
                                type="number"
                                placeholder="Nhập giờ PG"
                                className="!text-2xl py-5 placeholder:text-xl  placeholder:text-gray-300"
                                value={formData.pgTime}
                                onChange={(e) => setFormData({ ...formData, pgTime: e.target.value })}
                            />
                        </div>

                        {/* Nhân viên */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-2xl font-semibold text-gray-700">Nhân viên</Label>
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

                        {/* Máy */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-2xl font-semibold text-gray-700">Máy</Label>
                            <FlexibleCombobox
                                options={machineList}
                                value={
                                    machineList.find(
                                        (m) => Number(m.machineId) === Number(formData.machineId)
                                    )?.machineName || ""
                                }
                                onChange={(selectedName) => {
                                    const selected = machineList.find((m) => m.machineName === selectedName)
                                    setFormData({
                                        ...formData,
                                        machineId: selected ? String(selected.machineId) : "",
                                    })
                                }}
                                displayField="machineName"
                                valueField="machineName"
                                placeholder="Chọn máy"
                                allowCustom={false}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <Button
                            onClick={handleSubmit}
                            className="bg-green-700 hover:bg-green-600 text-2xl font-bold px-12 py-8 rounded-sm shadow-md"
                        >
                            Gửi
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

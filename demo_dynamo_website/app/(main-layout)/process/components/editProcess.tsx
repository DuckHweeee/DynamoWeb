"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useOrderDetail } from "../hooks/useOrderDetail"
import { FlexibleCombobox } from "./FlexibleCombobox"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { vi } from "date-fns/locale"
import { processingObjectList } from "../lib/data"
import { useMachine } from "../hooks/useMachine"
import { useStaff } from "../../../../hooks/useStaff"
import { Process, UpdateProcess } from "../lib/type"
import dayjs from "dayjs";
type EditProcessFormProps = {
    initialData: Process
    onUpdate: (updated: Process) => void
    onCancel: () => void
}
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function EditProcessForm({
    initialData,
    onUpdate,
    onCancel,
}: EditProcessFormProps) {
    const { user } = useAuth()

    const { data: orderList } = useOrderDetail()
    const { data: machineList } = useMachine()
    const { data: staffList } = useStaff()

    const [updateProcess, setUpdateProcess] = useState<UpdateProcess>({
        processType: "",
        orderCode: "",
        partNumber: null,
        stepNumber: null,
        manufacturingPoint: null,
        pgTime: null,
        startDate: new Date(),
        endDate: new Date(),
        machineId: null,
        staffId: null,
    })

    useEffect(() => {
        if (initialData) {
            setUpdateProcess({
                processType: initialData.processType ?? "",
                orderCode: initialData.orderDetailDto?.orderCode ?? null,
                manufacturingPoint: initialData.manufacturingPoint ?? null,
                partNumber: initialData.partNumber ?? null,
                stepNumber: initialData.stepNumber ?? null,
                pgTime: initialData.pgTime ?? null,
                startDate: initialData.planDto?.startTime ? new Date(initialData.planDto.startTime) : new Date(),
                endDate: initialData.planDto?.endTime ? new Date(initialData.planDto.endTime) : new Date(),
                machineId: initialData.planDto?.machineId ?? null,
                staffId: initialData.planDto?.staffId ?? null,
            })
        }
    }, [initialData])

    const [startDate, setStartDate] = useState<Date | null>(updateProcess.startDate)
    const [endDate, setEndDate] = useState<Date | null>(updateProcess.endDate)
    const handleUpdate = async () => {
        if (
            !updateProcess.processType ||
            !updateProcess.orderCode.trim() ||
            !updateProcess.manufacturingPoint ||
            !updateProcess.partNumber ||
            !updateProcess.stepNumber ||
            !updateProcess.pgTime ||
            !startDate ||
            !endDate ||
            !updateProcess.machineId ||
            !updateProcess.staffId ||
            !user?.userId
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin nhân viên.");
            return;
        }
        try {
            const response = await fetch(
                `${urlLink}/api/drawing-code-process/admin/${initialData.processId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        processType: updateProcess.processType,
                        partNumber: updateProcess.partNumber,
                        stepNumber: updateProcess.stepNumber,
                        manufacturingPoint: updateProcess.manufacturingPoint,
                        pgTime: updateProcess.pgTime,
                        startTime: dayjs(startDate).format("YYYY-MM-DD HH:mm:ss"),
                        endTime: dayjs(endDate).format("YYYY-MM-DD HH:mm:ss"),
                        status: 1,
                        orderCode: updateProcess.orderCode,
                        machineId: updateProcess.machineId,
                        staffId: updateProcess.staffId,
                        plannerId: user.userId,
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
            setUpdateProcess({
                processType: "",
                orderCode: "",
                partNumber: null,
                stepNumber: null,
                manufacturingPoint: null,
                pgTime: null,
                startDate: new Date(),
                endDate: new Date(),
                machineId: null,
                staffId: null,
            });
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-2 grid-cols-3">
                <div className="grid gap-1">
                    <Label htmlFor="process" className="text-lg">Đối tượng gia công</Label>
                    <FlexibleCombobox
                        options={processingObjectList}
                        value={updateProcess.processType}
                        onChange={(val) => setUpdateProcess({ ...updateProcess, processType: val })}
                        displayField="name"
                        valueField="name"
                        placeholder="Chọn Đối Tượng Gia Công"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="staff" className="text-lg">Mã Hàng</Label>
                    <FlexibleCombobox
                        options={orderList}
                        value={updateProcess.orderCode}
                        onChange={(val) => setUpdateProcess({ ...updateProcess, orderCode: val })}
                        displayField="orderCode"
                        valueField="orderCode"
                        placeholder="ID Mã Hàng"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="partNumber" className="text-lg">Thứ Tự Sản Phẩm</Label>
                    <Input
                        id="partNumber"
                        type="number"
                        placeholder="Thứ Tự Sản Phẩm"
                        className="!text-xl !placeholder-gray-300"
                        value={String(updateProcess.partNumber)}
                        onChange={(e) =>
                            setUpdateProcess({ ...updateProcess, partNumber: Number(e.target.value) })
                        }
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="stepNumber" className="text-lg">Thứ Tự Gia Công</Label>
                    <Input
                        id="stepNumber"
                        type="number"
                        placeholder="Thứ Tự  Gia Công"
                        className="!text-xl !placeholder-gray-300"
                        value={String(updateProcess.stepNumber)}
                        onChange={(e) =>
                            setUpdateProcess({
                                ...updateProcess,
                                stepNumber: Number(e.target.value),
                            })
                        }
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="manufacturingPoint" className="text-lg">Điểm Gia Công</Label>
                    <Input
                        id="manufacturingPoint"
                        type="number"
                        placeholder="Điểm Gia Công"
                        className="!text-xl !placeholder-gray-300"
                        value={String(updateProcess.manufacturingPoint)}
                        onChange={(e) =>
                            setUpdateProcess({
                                ...updateProcess,
                                manufacturingPoint: Number(e.target.value),
                            })
                        }
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="pgTime" className="text-lg">Giờ PG</Label>
                    <Input
                        id="pgTime"
                        type="number"
                        placeholder="Giờ PG"
                        className="!text-xl !placeholder-gray-300"
                        value={String(updateProcess.pgTime)}
                        onChange={(e) =>
                            setUpdateProcess({
                                ...updateProcess,
                                pgTime: Number(e.target.value),
                            })
                        }
                    />
                </div>
            </div>
            <div className="grid gap-2 grid-cols-2">
                <div className="grid gap-1">
                    <Label htmlFor="operator" className="text-lg">Ngày bắt đầu</Label>
                    <DatePicker
                        locale={vi}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="border px-3 py-1 rounded-sm w-full text-xl"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="operator" className="text-lg">Ngày kết thúc</Label>
                    <DatePicker
                        locale={vi}
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="border px-3 py-1 rounded-sm w-full text-xl"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="operator" className="text-lg">Nhân viên</Label>
                    <FlexibleCombobox
                        options={staffList}
                        value={String(updateProcess.staffId)}
                        onChange={(val) => setUpdateProcess({ ...updateProcess, staffId: Number(val) })}
                        displayField="staffId"
                        valueField="staffId"
                        placeholder="Chọn nhân viên"
                        widthSelect={"w-[485]"}
                        allowCustom={false}
                        extraField="staffName" // tên nhân viên
                        showExtraField={true}  // bật hiển thị
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="operator" className="text-lg">Máy</Label>
                    <FlexibleCombobox
                        options={machineList}
                        value={String(updateProcess.machineId)}
                        onChange={(val) => setUpdateProcess({ ...updateProcess, machineId: Number(val) })}
                        displayField="machineName"
                        valueField="machineId"
                        placeholder="Chọn Máy"
                        allowCustom={false}
                        widthSelect={"w-[485]"}
                    />
                </div>
            </div>
            <div className="flex gap-4 pt-2 justify-end">
                <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                    Hủy
                </Button>
                <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer">
                    Lưu
                </Button>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

import { FlexibleCombobox } from "./FlexibleCombobox"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { vi } from "date-fns/locale"
import dayjs from "dayjs";
import { Process } from "../../lib/type"
import { useOrderDetail } from "../../hooks/useOrderDetail"
import { useMachine } from "../../hooks/useMachine"
import { useStaff } from "../../../../../hooks/useStaff"
import { processingObjectList } from "../../lib/data"
type AddProcessFormProps = {
    onAdd: (process: Process) => void
    onCancel: () => void
}
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function AddProcessForm({ onCancel }: AddProcessFormProps) {
    const { user } = useAuth()
    const [newProcess, setNewProcess] = useState({
        processType: "",
        partNumber: "",
        stepNumber: "",
        manufacturingPoint: "",
        pgTime: "",
        orderCode: "",
        machineId: "",
        staffId: "",
    });
    const [startDate, setStartDate] = useState<Date | null>(new Date())
    const [endDate, setEndDate] = useState<Date | null>(new Date())
    const { data: orderList } = useOrderDetail()
    const { data: machineList } = useMachine()
    const { data: staffList } = useStaff()
    const handleSubmit = async () => {
        if (
            !newProcess.processType ||
            !newProcess.orderCode.trim() ||
            !newProcess.manufacturingPoint.trim() ||
            !newProcess.partNumber.trim() ||
            !newProcess.stepNumber ||
            !newProcess.pgTime.trim() ||
            !startDate ||
            !endDate ||
            !newProcess.machineId ||
            !newProcess.staffId ||
            !user?.id
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin nhân viên.");
            return;
        }
        try {
            const response = await fetch(
                `${urlLink}/api/drawing-code-process`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        processType: newProcess.processType,
                        partNumber: newProcess.partNumber,
                        stepNumber: newProcess.stepNumber,
                        manufacturingPoint: newProcess.manufacturingPoint,
                        pgTime: newProcess.pgTime,
                        startTime: dayjs(startDate).format("YYYY-MM-DD HH:mm:ss"),
                        endTime: dayjs(endDate).format("YYYY-MM-DD HH:mm:ss"),
                        status: 1,
                        orderCode: newProcess.orderCode,
                        machineId: newProcess.machineId,
                        staffId: newProcess.staffId,
                        plannerId: user.id,
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
            setNewProcess({
                processType: "",
                partNumber: "",
                stepNumber: "",
                manufacturingPoint: "",
                pgTime: "",
                orderCode: "",
                machineId: "",
                staffId: "",
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
                        value={newProcess.processType}
                        onChange={(val) => setNewProcess({ ...newProcess, processType: val })}
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
                        options={orderList || []}
                        value={newProcess.orderCode}
                        onChange={(val) => setNewProcess({ ...newProcess, orderCode: val })}
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
                        value={newProcess.partNumber}
                        onChange={(e) =>
                            setNewProcess({ ...newProcess, partNumber: e.target.value })
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
                        value={newProcess.stepNumber}
                        onChange={(e) =>
                            setNewProcess({
                                ...newProcess,
                                stepNumber: e.target.value,
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
                        value={newProcess.manufacturingPoint}
                        onChange={(e) =>
                            setNewProcess({
                                ...newProcess,
                                manufacturingPoint: e.target.value,
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
                        value={newProcess.pgTime}
                        onChange={(e) =>
                            setNewProcess({
                                ...newProcess,
                                pgTime: e.target.value,
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
                        className="border px-3 py-1 rounded-sm w-full"
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
                        className="border px-3 py-1 rounded-sm w-full"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="operator" className="text-lg">Nhân viên</Label>
                    <FlexibleCombobox
                        options={staffList}
                        value={newProcess.staffId}
                        onChange={(val) => setNewProcess({ ...newProcess, staffId: val })}
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
                        value={newProcess.machineId}
                        onChange={(val) => setNewProcess({ ...newProcess, machineId: val })}
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
                <Button onClick={handleSubmit} className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer">
                    Lưu
                </Button>
            </div>
        </div>
    )
}

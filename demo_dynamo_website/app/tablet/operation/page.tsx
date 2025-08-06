'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import CreateProcessDialog from "./component/addOperation";
import { useFetchMachines, useFetchOperators } from "@/hooks/useFetchData";
import { CurrentStaff, Machine2, Process2, Staff } from "@/lib/type";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
// import { useMachineStatusWS } from "./hook/WebSocket";
import { useMachineStatus } from "../_components/MachineStatusContext";

const statusMap = {
    E: { color: "bg-red-500", label: "Đang Lỗi" },
    R: { color: "bg-green-400", label: "Đang Chạy" },
    S: { color: "bg-orange-500", label: "Đang Dừng" },
};

// const urlLink = "http://10.70.166.119:8080"
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function TabletOperation() {
    const [selectedOperatorId, setSelectedOperatorId] = useState("");
    const [selectedMachineId, setSelectedMachineId] = useState<string>("");

    // Máy
    const [machine, setMachine] = useState<Machine2[]>([]);
    // useEffect(() => {
    //     setMachine(mockMachineList);
    // }, []);
    const fetchedMachine = useFetchMachines();
    useEffect(() => {
        if (fetchedMachine.length > 0) {
            setMachine(fetchedMachine);
            setSelectedMachineId((prev) => prev || fetchedMachine[0].machineId.toString());
        }
    }, [fetchedMachine]);

    // Staff
    const [staff, setstaff] = useState<Staff[]>([]);
    // useEffect(() => {
    //     setstaff(mockStaff);
    // }, []);
    const fetchedOperator = useFetchOperators();
    useEffect(() => {
        setstaff(fetchedOperator);
    }, [fetchedOperator]);

    // Process
    const [process, setProcess] = useState<Process2 | null>(null);
    // useEffect(() => {
    //     setProcess(mockProcess);
    // }, []);
    useEffect(() => {
        if (!selectedMachineId) return;
        const fetchProcess = async () => {
            try {
                const response = await axios.get<Process2>(
                    `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
                );
                setProcess(response.data);
                console.log(process)
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu process:", error);
                setProcess(null);
            }
        };
        fetchProcess();
    }, [selectedMachineId]);

    // Fetch current Staff
    const [currentStaff, setCurrentStaff] = useState<CurrentStaff[] | null>(null);
    // useEffect(() => {
    //     setCurrentStaff(mockCurrentStaff);
    // }, []);
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get<CurrentStaff[]>(
                    `${urlLink}/api/current-staff`
                );
                setCurrentStaff(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu current staff:", error);
                setCurrentStaff(null);
            }
        };
        fetchStaff();
    }, [selectedMachineId]);

    const selectedMachine = machine.find((m) => m.machineId.toString() === selectedMachineId);


    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const isNull = process?.pgTime == null ? true : false;
    const matchedStaff = currentStaff?.find(
        (item) => item.machineId === Number(selectedMachineId)
    );
    let currentStaffId = selectedOperatorId || matchedStaff?.staffIdNumber;

    // Test ok, nhưng cần thay đổi ngay sau khi load lại, tạm thời đang dùng reload lại toàn trang
    const handleSave = async () => {
        if (!inputValue || isNaN(Number(inputValue)) || Number(inputValue) <= 0) {
            toast.error("Vui lòng nhập điểm gia công hợp lệ (lớn hơn 0).");
            return;
        }

        const matchedStaff = currentStaff?.find(
            (item) => item.machineId === Number(selectedMachineId)
        );

        const finalOperatorId = selectedOperatorId || matchedStaff?.staffIdNumber;
        if (!finalOperatorId) {
            toast.error("Vui lòng chọn nhân viên thực hiện.");
            return;
        }

        try {
            const response = await fetch(
                `${urlLink}/api/drawing-code-process/${process?.processId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        manufacturingPoint: Number(inputValue),
                        staffId: Number(finalOperatorId),
                        processId: process?.processId,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Cập nhật thất bại.");
            }

            // Fetch lại process
            const response2 = await axios.get<Process2>(
                `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
            );
            const updatedProcess = response2.data;
            // console.log("Cập nhật thành công:", updatedProcess);
            // currentStaffId = finalOperatorId;
            // window.location.reload();

            const response3 = await axios.get<CurrentStaff[]>(
                `${urlLink}/api/current-staff`
            );
            setCurrentStaff(response3.data);
            setProcess(updatedProcess);
            setInputValue(String(updatedProcess.manufacturingPoint ?? "0"));
            setSelectedOperatorId("");
            setIsEditing(false);
            toast.success("Chỉnh sửa thành công");

        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật.");
        }
    };

    // Kiểm soát số 0 khi nhập input
    const [inputValue, setInputValue] = useState(String(process?.manufacturingPoint ?? "0"));
    useEffect(() => {
        setInputValue(String(process?.manufacturingPoint ?? "0"));
    }, [process?.manufacturingPoint]);

    // Test xong Websocket
    // const [wsData, setWsData] = useState<any[]>([]);
    // const ws = new WebSocket("ws://10.70.166.119:8080/ws/users");
    // ws.onmessage = function (event) {
    //     const msg = JSON.parse(event.data);

    //     if (msg.type === "status") {
    //         const currentStatuses = msg.data;
    //         console.log("Updated machine statuses", currentStatuses);
    //         setWsData(currentStatuses)
    //     }
    // };
    // console.log("Cứu tui:")
    // console.log(wsData)
    const { machineStatuses } = useMachineStatus()
    const currentMachineStatus = machineStatuses.find((m) => {
        return Number(m.machineId) === selectedMachine?.machineId
    });

    const statusKey = currentMachineStatus?.status?.[0] as keyof typeof statusMap;
    const machineStatus = statusKey ? statusMap[statusKey] : null;

    // Test xong
    // const handleComplete = async () => {
    //     if (!process?.processId) {
    //         console.error("Không tìm thấy ID của process");
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(
    //             `${urlLink}/api/drawing-code-process/done-process/${process.processId}`
    //         );
    //         const response2 = await axios.get<Process2>(
    //             `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
    //         );
    //         const updatedProcess = response2.data;
    //         // console.log("Process đã cập nhật:", updatedProcess);
    //         setProcess(updatedProcess);

    //         toast.success("Hoàn thành quy trình thành công!");
    //     } catch (error: any) {
    //         console.error("Lỗi khi hoàn thành process:", error);
    //         toast.error(
    //             error?.response?.data?.message || "Có lỗi xảy ra khi hoàn thành process."
    //         );
    //     }
    // };
    const handleComplete = async () => {
        if (!process?.processId) return;
        try {
            await axios.post(`${urlLink}/api/drawing-code-process/done-process/${process.processId}`);

            const response2 = await axios.get<Process2>(
                `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
            );
            toast.success("Hoàn thành quy trình thành công!");
            setProcess(response2.data);
            const response3 = await axios.get<CurrentStaff[]>(
                `${urlLink}/api/current-staff`
            );
            setCurrentStaff(response3.data);
        } catch (error: any) {
            console.error("Lỗi khi hoàn thành quy trình:", error);
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi hoàn thành quy trình.");
        }
    };

    return (
        <>
            <div className="px-6 py-3">
                <div className="flex items-center justify-between pb-3">
                    <div className="grid grid-cols-1">
                        <Select
                            value={selectedMachineId}
                            onValueChange={(value) => {
                                setSelectedMachineId(value);
                                setSelectedOperatorId("");
                                setIsCreating(false);
                                setIsEditing(false);
                            }}
                        >
                            <SelectTrigger className="w-auto text-3xl py-8">
                                <SelectValue placeholder="Máy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {machine.map((m) => (
                                        <SelectItem className="text-2xl" key={m.machineId} value={m.machineId.toString()}>
                                            {m.machineName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {machineStatus && (
                        <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full ${machineStatus.color}`}></span>
                            <p className="text-2xl font-medium text-slate-900">{machineStatus.label}</p>
                        </div>
                    )}
                </div>

                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className="bg-blue-950 hover:bg-blue-950">
                            <TableHead className="w-1/2 text-4xl font-bold text-white text-center py-2">Thông tin</TableHead>
                            <TableHead className="w-1/2 text-4xl font-bold text-white text-center">Chi tiết</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="border-x">
                        {process && (
                            <>
                                <TableRow className="border-b-0 h-[50px] bg-gray-100">
                                    <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                        Đối Tượng Gia Công
                                    </TableCell>
                                    <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950">
                                        {process.processType}
                                    </TableCell>
                                </TableRow>

                                <TableRow className="border-b-0 h-[50px]">
                                    <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                        ID Mã Hàng
                                    </TableCell>
                                    <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950">
                                        {process.orderDetailDto?.orderCode}
                                    </TableCell>
                                </TableRow>

                                <TableRow className="border-b-0 bg-gray-100">
                                    <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                        Thứ Tự Sản Phẩm
                                    </TableCell>
                                    <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950">
                                        {process.partNumber}
                                    </TableCell>
                                </TableRow>

                                <TableRow className="border-b-0">
                                    <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                        Thứ Tự Gia Công
                                    </TableCell>
                                    <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950">
                                        {process.stepNumber}
                                    </TableCell>
                                </TableRow>

                                <TableRow className="border-b-0 bg-gray-100">
                                    <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                        Điểm Gia Công
                                    </TableCell>
                                    <TableCell className="p-0 w-1/2 text-3xl font-bold text-center text-blue-950">
                                        {isEditing ? (
                                            <div className="flex h-full items-stretch w-full justify-center">
                                                <Input
                                                    type="number"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    className="!text-3xl text-center w-sm rounded-sm border-black h-full"
                                                />
                                            </div>
                                        ) : (
                                            <span>{process?.manufacturingPoint}</span>
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow className="border-b-0">
                                    <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                        Giờ PG
                                    </TableCell>
                                    <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950">
                                        {process.pgTime}
                                    </TableCell>
                                </TableRow>

                                <TableRow className="border-b-0 h-[50px] bg-gray-100">
                                    <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                        Nhân Viên
                                    </TableCell>
                                    <TableCell className="w-1/2 p-0 text-center text-3xl">
                                        {(() => {
                                            const operatorName =
                                                staff.find((st) => st.staffId === currentStaffId)?.staffName || "Không xác định";
                                            return isEditing ? (
                                                <div className="flex w-full h-full items-center justify-center">
                                                    <Select value={String(currentStaffId)} onValueChange={setSelectedOperatorId}>
                                                        <SelectTrigger className="w-sm h-full min-h-[45px] text-3xl font-bold flex items-center justify-center border-black !shadow-none text-blue-950">
                                                            <SelectValue placeholder="Chọn nhân viên" className="!placeholder:text-blue-950" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {staff.map((st) => (
                                                                    <SelectItem
                                                                        className="text-2xl font-bold text-blue-950"
                                                                        key={st.staffId}
                                                                        value={String(st.staffId)}
                                                                    >
                                                                        {st.staffName}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center text-3xl font-bold h-full text-blue-950">
                                                    {operatorName}
                                                </div>
                                            );
                                        })()}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex gap-3 items-center justify-end px-6">
                <div className="flex gap-4">
                    {/* Nút Chỉnh sửa */}
                    {!isNull && !isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer bg-blue-700 hover:bg-blue-600 px-10 py-6 text-2xl"
                        >
                            Chỉnh sửa
                        </Button>
                    )}

                    {/* Nút Lưu */}
                    {isEditing && (
                        <Button
                            onClick={handleSave}
                            className="cursor-pointer bg-green-700 hover:bg-green-600 px-10 py-6 text-2xl"
                        >
                            Lưu
                        </Button>
                    )}

                    {/* Nút Hoàn thành */}
                    {!isEditing && !isCreating && !isNull && statusKey === "S" && (
                        <Button
                            onClick={handleComplete}
                            className="cursor-pointer bg-green-700 hover:bg-green-600 px-10 py-6 text-2xl"
                        >
                            Hoàn thành
                        </Button>
                    )}

                    {/* Nút Tạo mới */}
                    {statusKey === "S" && isNull && (
                        <Button
                            onClick={() => setIsCreating(true)}
                            className="cursor-pointer bg-green-700 hover:bg-green-600 px-10 py-6 text-2xl"
                        >
                            Tạo mới
                        </Button>
                    )}
                </div>
            </div >

            <CreateProcessDialog
                open={isCreating}
                // onOpenChange={setIsCreating}
                onOpenChange={async (open) => {
                    setIsCreating(open);
                    if (!open) {
                        const response2 = await axios.get<Process2>(
                            `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
                        );
                        setProcess(response2.data);

                        const response3 = await axios.get<CurrentStaff[]>(
                            `${urlLink}/api/current-staff`
                        );
                        setCurrentStaff(response3.data);
                    }
                }}
                selectedMachineId={selectedMachineId} staffList={staff}
            />
        </>
    );
}

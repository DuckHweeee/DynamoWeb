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
import { CurrentStaff, Machine2, OrderDetailDto, Process2, Staff } from "@/lib/type";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMachineStatus } from "../_components/MachineStatusContext";
import { OrbitProgress } from "@/node_modules/react-loading-indicators";


const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;

// Khai báo kiểu dữ liệu của đối tượng gia công
interface ProcessingObject {
    id: string,
    name: string
};

// Khai báo để lấy ra todo và inProgress trong Process được gửi
interface ProcessResponse {
    todo: Process2[];
    inProgress: Process2 | null;
}

// Các đối tượng gia công
const processingObjectList: ProcessingObject[] = [
    {
        id: "1",
        name: "SP_Chính",
    },
    {
        id: "2",
        name: "NG_Chạy lại",
    },
    {
        id: "3",
        name: "LK-Đồ gá",
    },
    {
        id: "4",
        name: "Điện cực",
    },
    {
        id: "5",
        name: "Dự bị",
    },
];

// Trạng thái máy và màu hiển thị
const statusMap = {
    E: { color: "bg-red-500", label: "Đang Lỗi" },
    R: { color: "bg-green-400", label: "Đang Chạy" },
    S: { color: "bg-yellow-300", label: "Đang Dừng" },
    0: { color: "bg-gray-300", label: "Đang Trống" },
};

export default function TabletOperation() {
    // const [selectedOperatorId, setSelectedOperatorId] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedMachineId, setSelectedMachineId] = useState<string>("");
    console.log("selectedMachineId")
    console.log(selectedMachineId)
    const [updateInfor, setUpdateInfor] = useState<UpdateInfor>({
        updateProcessType: "",
        updateOrderCode: "",
        updatePartNumber: 0,
        updateStepNumber: 0,
        updatePgTime: 0,
        updateManufacturingPoint: 0,
        updateStaffId: 0,
    });

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

    // Máy
    const [machine, setMachine] = useState<Machine2[]>([]);
    const fetchedMachine = useFetchMachines();
    useEffect(() => {
        if (fetchedMachine.length > 0) {
            setMachine(fetchedMachine);
            setSelectedMachineId((prev) => prev || fetchedMachine[0].machineId.toString());
        }
    }, [fetchedMachine]);

    // Staff
    const [staff, setstaff] = useState<Staff[]>([]);
    const fetchedOperator = useFetchOperators();
    useEffect(() => {
        setstaff(fetchedOperator);
    }, [fetchedOperator]);


    // Process
    // Đang tách ra từng phần của Process
    const [todo, setTodo] = useState<Process2[]>([]);
    const [inProgress, setInProgress] = useState<Process2 | null>(null);
    // Lưu process được chọn khi inProgress đang trống
    const [selectedProcess, setSelectedProcess] = useState<Process2 | null>(null);
    useEffect(() => {
        if (!selectedMachineId) return;
        const fetchProcess = async () => {
            try {
                // const response = await axios.get<Process2>(
                //     `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
                // );
                // setProcess(response.data);

                const res = await axios.get<ProcessResponse>(
                    `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
                );
                setTodo(res.data.todo || []);
                setInProgress(res.data.inProgress || null);
                console.log("inProgress")
                console.log(inProgress)
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu process:", error);
                // setProcess(null);
            }
        };
        setSelectedProcess(null);
        fetchProcess();
    }, [selectedMachineId]);

    // Fetch current Staff
    const [currentStaff, setCurrentStaff] = useState<CurrentStaff[] | null>(null);
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
    const isNull = inProgress?.pgTime == null ? true : false;
    const isAddnew = (inProgress == null) ? true : false;

    const matchedStaff = currentStaff?.find(
        (item) => item.machineId === Number(selectedMachineId)
    );
    let currentStaffId = updateInfor.updateStaffId || matchedStaff?.staffIdNumber || selectedProcess?.planDto?.staffId;

    // Test
    const handleSave = async () => {
        if (
            !updateInfor.updateManufacturingPoint ||
            isNaN(Number(updateInfor.updateManufacturingPoint)) ||
            Number(updateInfor.updateManufacturingPoint) <= 0 ||
            !updateInfor.updatePartNumber ||
            !updateInfor.updateStepNumber ||
            !updateInfor.updatePgTime
        ) {
            toast.error("Vui lòng nhập thông tin hợp lệ (lớn hơn 0).");
            return;
        }

        if (
            !updateInfor.updateProcessType ||
            !updateInfor.updateOrderCode
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const matchedStaff = currentStaff?.find(
            (item) => item.machineId === Number(selectedMachineId)
        );

        const finalOperatorId = updateInfor.updateStaffId || matchedStaff?.staffIdNumber;
        if (!finalOperatorId) {
            toast.error("Vui lòng chọn nhân viên thực hiện.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                `${urlLink}/api/drawing-code-process/${inProgress?.processId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        processType: updateInfor.updateProcessType,
                        orderCode: updateInfor.updateOrderCode,
                        partNumber: updateInfor.updatePartNumber,
                        stepNumber: updateInfor.updateStepNumber,
                        pgTime: updateInfor.updatePgTime,
                        manufacturingPoint: updateInfor.updateManufacturingPoint,
                        staffId: updateInfor.updateStaffId,
                        processId: inProgress?.processId,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Cập nhật thất bại.");
            }

            const res = await axios.get<ProcessResponse>(
                `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
            );
            setTodo(res.data.todo || []);
            setInProgress(res.data.inProgress || null);

            const response3 = await axios.get<CurrentStaff[]>(
                `${urlLink}/api/current-staff`
            );
            setCurrentStaff(response3.data);
            setIsEditing(false);
            toast.success("Chỉnh sửa thành công");

        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật.");
        }
        finally {
            setLoading(false);
        }
    };

    const { machineStatuses } = useMachineStatus()
    const currentMachineStatus = machineStatuses.find((m) => {
        return Number(m.machineId) === selectedMachine?.machineId
    });

    const statusKey = currentMachineStatus?.status?.[0] as keyof typeof statusMap;
    const machineStatus = statusKey ? statusMap[statusKey] : null;

    // Test okela
    const handleComplete = async () => {
        if (!inProgress?.processId) return;
        setLoading(true);
        try {
            await axios.post(`${urlLink}/api/drawing-code-process/done-process/${inProgress.processId}`);
            const res = await axios.get<ProcessResponse>(
                `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
            );
            setTodo(res.data.todo || []);
            setInProgress(res.data.inProgress || null);

            toast.success("Hoàn thành quy trình thành công!");
            const response3 = await axios.get<CurrentStaff[]>(
                `${urlLink}/api/current-staff`
            );
            setCurrentStaff(response3.data);
        } catch (error: any) {
            console.error("Lỗi khi hoàn thành quy trình:", error);
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi hoàn thành quy trình.");
        } finally {
            setLoading(false);
        }
    };

    // Test okela
    const startEditing = () => {
        if (!inProgress) return;
        setUpdateInfor({
            updateProcessType: inProgress.processType || "",
            updateOrderCode: inProgress.orderDetailDto?.orderCode || "",
            updatePartNumber: Number(inProgress.partNumber) || 0,
            updateStepNumber: Number(inProgress.stepNumber) || 0,
            updatePgTime: Number(inProgress.pgTime) || 0,
            updateManufacturingPoint: Number(inProgress.manufacturingPoint) || 0,
            updateStaffId: Number(matchedStaff?.staffIdNumber || 0)
        });
        setIsEditing(true);
    };


    // Chọn bên todo qua inProgres
    const handleSelectTodo = (item: Process2) => {
        if (!inProgress) {
            setSelectedProcess(item);
        }
    };


    // Test submit chuyển từ todo sang inProgress
    const handleSubmit = async () => {
        setLoading(true);
        let staffIString = String(
            staff.find(st => String(st.staffId) === String(selectedProcess?.planDto?.staffId))?.id || ""
        );

        try {
            const url = `${urlLink}/api/drawing-code-process/receive?drawingCodeProcess_id=${selectedProcess?.processId}&&staffId=${staffIString}&&machineId=${selectedMachineId}`;
            await axios.post(url);
            toast.success("Gửi thành công!");

            // Đợi hỏi lại thông tin chính xác
            // const res = await axios.get<ProcessResponse>(
            //     `${urlLink}/api/drawing-code-process/machine/${selectedMachineId}`
            // );
            // setTodo(res.data.todo || []);
            // setInProgress(res.data.inProgress || null);

        } catch (error) {
            toast.error("Gửi thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {
                loading ? (
                    <div className="flex justify-center mt-4">
                        <OrbitProgress
                            variant="spokes"
                            color="#b3b3b3"
                            size="medium"
                            text="Đang gửi"
                            textColor=""
                        />
                    </div>
                ) : (
                    <div className="px-6 py-2">
                        <div className="flex items-center justify-between pb-2">
                            <div className="grid grid-cols-1">
                                <Select
                                    value={selectedMachineId}
                                    onValueChange={(value) => {
                                        setSelectedMachineId(value);
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
                                    <span className={`w-7 h-7 rounded-full ${machineStatus.color}`}></span>
                                    <p className="text-2xl font-medium text-slate-900">{machineStatus.label}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-1">
                            {/* To Do */}
                            <div className="flex flex-[40%]">
                                <div className="border-0 rounded w-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-blue-950 hover:bg-blue-950 sticky top-0 z-10">
                                                <TableHead className="w-[22ch] text-left text-3xl font-bold text-white max-[1300px]:text-3xl py-2">ID Mã Hàng</TableHead>
                                                <TableHead className=" text-center text-3xl font-bold text-white max-[1300px]:text-3xl">TTNC</TableHead>
                                                <TableHead className=" text-center text-3xl font-bold text-white max-[1300px]:text-3xl min-2xl:pr-4">TTGC</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                    <div className="max-h-94 overflow-y-auto">
                                        <Table>
                                            <TableBody>
                                                {todo.map((item, index) => (
                                                    <TableRow key={index} onClick={() => handleSelectTodo(item)} className="odd:bg-gray-100 border-0 py-2 h-[50px]">
                                                        <TableCell className="text-[26px] text-blue-950 font-bold text-left w-[25ch]">{item.orderDetailDto?.orderCode}</TableCell>
                                                        <TableCell className="text-[26px] text-blue-950 font-bold text-center">{item.partNumber}</TableCell>
                                                        <TableCell className="text-[26px] text-blue-950 font-bold text-center">{item.stepNumber}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>

                            {/* In Progress */}
                            <div className="flex flex-1/2">
                                <Table className="!table-fixed !w-full">
                                    <TableHeader>
                                        <TableRow className="bg-blue-950 hover:bg-blue-950 h-[50px]">
                                            <TableHead className="w-1/3 text-3xl  font-bold text-white text-left py-2">Thông tin</TableHead>
                                            <TableHead className="w-2/3 text-3xl font-bold text-white text-center">Chi tiết</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* {(inProgress || selectedProcess) && ( */}
                                        <>
                                            <TableRow className="border-0 bg-gray-100 h-[50px]">
                                                {/*
                                    Tablet: Fully: max-[1300px]: ; Chorme: max-2xl
                                    Laptop-Screen: min-2xl
                                    */}
                                                <TableCell className="w-1/2 text-3xl font-bold text-left pl-3 text-blue-950">
                                                    ĐTGC
                                                </TableCell>
                                                <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950">
                                                    {(statusKey == 0 && isEditing) ? (
                                                        <div className="flex w-full h-full items-center justify-center">
                                                            <Select
                                                                value={updateInfor.updateProcessType}
                                                                onValueChange={(val) => setUpdateInfor(prev => ({ ...prev, updateProcessType: val }))}
                                                            >
                                                                {/* <SelectTrigger className="w-sm h-full min-h-[45px] text-3xl max-[1300px]:text-[32px] font-bold flex items-center justify-center border-black !shadow-none text-blue-950"> */}
                                                                <SelectTrigger className="w-sm h-full min-h-[45px] text-3xl max-[1300px]:text-[32px] font-bold flex items-center justify-center border-black border-0 border-b-1 rounded-none !shadow-none text-blue-950">
                                                                    <SelectValue placeholder="Chọn đối tượng" className="!placeholder:text-blue-950" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        {processingObjectList.map((obj) => (
                                                                            <SelectItem key={obj.id} value={obj.name} className="text-2xl font-bold text-blue-950 max-[1300px]:text-[32px]">
                                                                                {obj.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    ) : (
                                                        <span className="!text-3xl">{(inProgress || selectedProcess)?.processType}</span>
                                                    )}

                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="border-0 h-[50px]">
                                                <TableCell className="w-1/3 text-3xl font-bold text-left text-blue-950 pl-3">
                                                    ID Mã Hàng
                                                </TableCell>
                                                <TableCell className="w-2/3 text-3xl font-bold text-center text-blue-950 max-[1300px]:text-[32px] break-words ">
                                                    {(statusKey == 0 && isEditing) ? (
                                                        <div className="flex h-full items-stretch w-full justify-center">
                                                            <div className="flex w-full h-full items-center justify-center">
                                                                <Select
                                                                    value={updateInfor.updateOrderCode}
                                                                    onValueChange={(val) => setUpdateInfor(prev => ({ ...prev, updateOrderCode: val }))}
                                                                >
                                                                    {/* <SelectTrigger className="w-sm h-full min-h-[45px] text-3xl max-[1300px]:text-[32px] font-bold flex items-center justify-center border-black !shadow-none text-blue-950"> */}
                                                                    <SelectTrigger className="w-sm h-full min-h-[45px] text-3xl max-[1300px]:text-[32px] font-bold flex items-center justify-center border-black border-0 border-b-1 rounded-none !shadow-none text-blue-950">
                                                                        <SelectValue placeholder="Chọn đối tượng" className="!placeholder:text-blue-950" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {orderDetail?.map((obj) => (
                                                                                <SelectItem key={obj.orderDetailId} value={obj.orderCode} className="text-2xl font-bold text-blue-950 max-[1300px]:text-[32px]">
                                                                                    {obj.orderCode}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-3xl">{(inProgress || selectedProcess)?.orderDetailDto?.orderCode}</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="border-0 bg-gray-100 h-[50px]">
                                                <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                                    TTSP
                                                </TableCell>
                                                <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950">
                                                    {/* {process.partNumber} */}
                                                    {(statusKey == 0 && isEditing) ? (
                                                        <div className="flex h-full items-stretch w-full justify-center">
                                                            <Input
                                                                inputMode="numeric"
                                                                value={updateInfor.updatePartNumber}
                                                                onChange={(e) => setUpdateInfor(prev => ({
                                                                    ...prev,
                                                                    updatePartNumber: Number(e.target.value)
                                                                }))}
                                                                // className="!text-3xl max-[1300px]:!text-[32px] text-center w-sm border-black h-full"
                                                                className="!text-3xl max-[1300px]:!text-[32px] text-center w-sm border-black h-full border-0 border-b-1 rounded-none"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="!text-3xl">{(inProgress || selectedProcess)?.partNumber}</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="border-0 h-[50px]">
                                                <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3 max-[1300px]:text-[32px]">
                                                    TTGC
                                                </TableCell>
                                                <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950 max-[1300px]:text-[32px]">
                                                    {/* {process.stepNumber} */}
                                                    {(statusKey == 0 && isEditing) ? (
                                                        <div className="flex h-full items-stretch w-full justify-center">
                                                            <Input
                                                                inputMode="numeric"
                                                                value={updateInfor.updateStepNumber}
                                                                onChange={(e) => setUpdateInfor(prev => ({
                                                                    ...prev,
                                                                    updateStepNumber: Number(e.target.value)
                                                                }))}
                                                                // className="!text-3xl max-[1300px]:!text-[32px] text-center w-sm rounded-sm border-black h-full"
                                                                className="!text-3xl max-[1300px]:!text-[32px] text-center w-sm border-black h-full border-0 border-b-1 rounded-none"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="!text-3xl max-[1300px]:!text-[32px]">{(inProgress || selectedProcess)?.stepNumber}</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="border-0 bg-gray-100 h-[50px]">
                                                <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3 max-[1300px]:text-[32px] ">
                                                    ĐGC
                                                </TableCell>
                                                <TableCell className="p-0 w-1/2 font-bold text-center text-blue-950">
                                                    {isEditing ? (
                                                        <div className="flex h-full items-stretch w-full justify-center">
                                                            <Input
                                                                inputMode="numeric"
                                                                value={updateInfor.updateManufacturingPoint}
                                                                onChange={(e) => {
                                                                    const newValue = Number(e.target.value);
                                                                    const oldValue = inProgress?.manufacturingPoint ?? 0;
                                                                    if (newValue > oldValue) {
                                                                        toast.error(`Giá trị mới nhập (${newValue}) không được lớn hơn giá trị cũ (${oldValue})`);
                                                                        return;
                                                                    }

                                                                    setUpdateInfor(prev => ({
                                                                        ...prev,
                                                                        updateManufacturingPoint: newValue
                                                                    }));
                                                                }}
                                                                // className="!text-3xl max-[1300px]:!text-[32px] text-center w-sm rounded-sm border-black h-full"
                                                                className="!text-3xl max-[1300px]:!text-[32px] text-center w-sm border-black h-full border-0 border-b-1 rounded-none"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="!text-3xl max-[1300px]:!text-[32px] h-full">{(inProgress || selectedProcess)?.manufacturingPoint}</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="border-0 h-[50px]">
                                                <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3">
                                                    Giờ PG
                                                </TableCell>
                                                <TableCell className="w-1/2 text-3xl font-bold text-center text-blue-950">
                                                    {(statusKey == 0 && isEditing) ? (
                                                        <div className="flex h-full items-stretch w-full justify-center">
                                                            <Input
                                                                inputMode="numeric"
                                                                value={updateInfor.updatePgTime}
                                                                onChange={(e) => setUpdateInfor(prev => ({
                                                                    ...prev,
                                                                    updatePgTime: Number(e.target.value)
                                                                }))}
                                                                // className="!text-3xl max-[1300px]:!text-[32px] text-center w-sm rounded-sm border-black h-full"
                                                                className="!text-3xl max-[1300px]:!text-[32px] text-center w-sm border-black h-full border-0 border-b-1 rounded-none"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="!text-3xl">{(inProgress || selectedProcess)?.pgTime}</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="border-0 bg-gray-100 h-[50px]">
                                                <TableCell className="w-1/2 text-3xl font-bold text-left text-blue-950 pl-3 max-[1300px]:text-[32px]">
                                                    Nhân Viên
                                                </TableCell>
                                                <TableCell className="w-1/2 p-0 text-center text-3xl">
                                                    {(() => {
                                                        let operatorName =
                                                            staff.find((st) => st.staffId === currentStaffId)?.staffName || "Không xác định";
                                                        return isEditing ? (
                                                            <div className="flex w-full h-full items-center justify-center">
                                                                <Select value={String(currentStaffId)} onValueChange={(val) => setUpdateInfor(prev => ({ ...prev, updateStaffId: Number(val) }))}>
                                                                    {/* <SelectTrigger className="w-sm h-full min-h-[45px] text-3xl max-[1300px]:text-[32px] font-bold flex items-center justify-center border-black !shadow-none text-blue-950"> */}
                                                                    <SelectTrigger className="w-sm h-full min-h-[45px] text-3xl max-[1300px]:text-[32px] font-bold flex items-center justify-center border-black border-0 border-b-1 rounded-none !shadow-none text-blue-950">
                                                                        <SelectValue placeholder="Chọn nhân viên" className="!placeholder:text-blue-950" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {staff.map((st) => (
                                                                                <SelectItem
                                                                                    className="text-2xl font-bold text-blue-950 max-[1300px]:text-[32px]"
                                                                                    key={st.staffId}
                                                                                    value={String(st.staffId)}
                                                                                >
                                                                                    {/* {st.staffName} */}
                                                                                    {st.shortName} - {st.staffId}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center text-3xl font-bold h-full text-blue-950 max-[1300px]:text-[32px]">
                                                                {operatorName}
                                                            </div>
                                                        );
                                                    })()}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                        {/* )} */}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Các nút bấm */}
            < div className="flex gap-3 items-center justify-end px-6">
                <div className="flex gap-4">
                    {isEditing && (
                        <Button
                            variant="outline"
                            onClick={() => {

                                setIsEditing(false);
                                if (inProgress) {
                                    setUpdateInfor({
                                        updateProcessType: inProgress.processType || "",
                                        updateOrderCode: inProgress.orderDetailDto?.orderCode || "",
                                        updatePartNumber: Number(inProgress.partNumber) || 0,
                                        updateStepNumber: Number(inProgress.stepNumber) || 0,
                                        updatePgTime: Number(inProgress.pgTime) || 0,
                                        updateManufacturingPoint: Number(inProgress.manufacturingPoint) || 0,
                                        updateStaffId: Number(matchedStaff?.staffIdNumber || 0)
                                    });
                                }
                            }}
                            className="cursor-pointer text-gray-500  px-10 py-7 text-3xl font-bold max-[1300px]:px-10"
                        >
                            Hủy
                        </Button>
                    )}
                    {!isNull && !isEditing && (
                        <Button
                            onClick={() => startEditing()}
                            className="cursor-pointer bg-blue-700 hover:bg-blue-600  px-10 py-7 text-3xl font-bold max-[1300px]:px-10"
                        >
                            Chỉnh sửa
                        </Button>
                    )}
                    {isEditing && (
                        <Button
                            onClick={handleSave}
                            className="cursor-pointer bg-green-700 hover:bg-green-600  px-10 py-7 text-3xl font-bold max-[1300px]:px-10"
                        >
                            Lưu
                        </Button>
                    )}
                    {!isEditing && !isCreating && !isNull && statusKey === "S" && Number(selectedMachineId) > 9 && (
                        <Button
                            onClick={handleComplete}
                            className="cursor-pointer bg-green-700 hover:bg-green-600  px-10 py-7 text-3xl font-bold max-[1300px]:px-10"
                        >
                            Hoàn thành
                        </Button>
                    )}
                    {/* {((statusKey === "S" || statusKey == 0) && isNull) && (
                        <Button
                            onClick={() => setIsCreating(true)}
                            className="cursor-pointer bg-green-700 hover:bg-green-600 px-10 py-7 text-3xl font-bold max-[1300px]:px-10"
                        >
                            Tạo mới
                        </Button>
                    )} */}
                    {/* {((statusKey === "S" || statusKey == 0) && inProgress == null) && ( */}
                    {isAddnew && (
                        <Button
                            onClick={() => handleSubmit()}
                            className="cursor-pointer bg-green-700 hover:bg-green-600 px-10 py-7 text-3xl font-bold max-[1300px]:px-10"
                        >
                            Gửi
                        </Button>
                    )}
                </div>
            </ div>

            {/* Tạo mới */}
            {/* <CreateProcessDialog
                open={isCreating}
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
            /> */}
        </>
    );
}

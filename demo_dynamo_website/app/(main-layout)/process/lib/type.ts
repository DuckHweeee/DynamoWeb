import { Staff } from "@/lib/type";

export interface Process {
    processId: string;
    partNumber: number;
    stepNumber: number;
    manufacturingPoint: number;
    processType: string;
    processStatus: number;
    pgTime: number;
    startTime?: string;
    endTime?: string;
    createdDate: string;
    updatedDate: string;
    isPlan: number;
    status: number;
    orderDetailDto: OrderDetailDto;
    machineDto: MachineDto;
    staffDtos: Staff[];
    planDto: PlanDto;
    processTimeDto?: ProcessTimeDto;
}
export interface PlanDto {
    startTime: string;
    endTime: string;
    status: number;
    inProgress: number;
    remark?: any;
    remarkTime?: any;
    processId: string;
    staffId: number;
    machineId: number;
    plannerId: string;
    createdDate: string;
    updatedDate: string;
    id: number;
}
export interface MachineDto {
    machineId?: string;
    machineName: string;
}
export interface OrderDetailDto {
    orderDetailId: string;
    orderCode: string;
}

export interface ProcessTimeDto {
    id: number,
    spanTime: number,
    runTime: number,
    pgTime: number,
    stopTime: number,
    offsetTime: number,
    drawingCodeProcessID: string
}

export interface ProcessingObject {
    id: string,
    name: string
}

export interface UpdateProcess {
    processType: string;
    orderCode: string;
    partNumber: number | null;
    stepNumber: number | null;
    manufacturingPoint: number | null;
    pgTime: number | null;
    startDate: Date;
    endDate: Date;
    machineId: number | null;
    staffId: number | null;
}
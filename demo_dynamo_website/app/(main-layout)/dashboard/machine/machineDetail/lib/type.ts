import { Machine } from "../../lib/type";

export interface MachineStatisticDetail {
    machineId: number;
    machineName: string;
    totalRunTime: number;
    runTimeRate: number;
    totalStopTime: number;
    stopTimeRate: number;
    totalPgTime: number;
    pgTimeRate: number;
    totalErrorTime: number;
    errorTimeRate: number;
    numberOfProcesses: number;
    processRate: number;
    totalOffsetTime: number;
}

export interface MachineHistoryDetail {
    orderCode: string;
    partNumber: number;
    stepNumber: number;
    startTime: string;
    endTime: string;
    machineName: string;
    staffIdNumber: number;
    staffName: string;
    status: string;
}

export interface MachineEfficiencyDetail {
    machineId: number;
    machineName: string;
    operationalEfficiency: number;
    pgEfficiency: number;
    valueEfficiency: number;
    oee: number;
    offsetLoss: number;
    otherLoss: number;
    machines: Machine[];
}
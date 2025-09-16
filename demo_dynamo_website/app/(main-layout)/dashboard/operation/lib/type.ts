export interface StaffOverview {
    staffId: string;
    staffIdNumber: number;
    staffFullName: string;
    workingHourGoal: number;
    totalWorkingHour: number;
    manufacturingPointGoal: number;
    totalManufacturingPoint: number;
    totalOperationNumber: number;
    oleGoal: number;
    ole: number;
    kpiGoal: number;
    kpi: number;
    machineTimeGoal: number;
    machineTime: number;
    pgTimeGoal: number;
    pgTime: number;
}

export interface StaffStatistic {
    groupId: string;
    groupName: string;
    staffCount: number;
    workingHours: number;
    workingRate: number;
    manufacturingPoints: number;
    mpRate: number;
    processCount: number;
    processRate: number;
    totalKpi: number;
    kpiRate: number;
    staffDto: Staff[];
}
export interface Staff {
    id: number;
    staffName: string;
}

export interface HistoryProcess {
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
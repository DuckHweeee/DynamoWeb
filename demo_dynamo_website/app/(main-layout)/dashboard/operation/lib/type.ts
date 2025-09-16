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
    staff: Staff[];
}
export interface Staff {
    staffId: string;
    staffName: string;
}
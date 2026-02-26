export interface OperatorStatusType {
    staffDto: StaffDto;
    listStaffStatus: ListStaffStatus[];
}
export interface ListStaffStatus {
    id: string;
    machineDto: MachineDto;
    staffDto?: any;
    drawingCodeName: string;
    pgTime: number;
    startTime: number;
    time: string;
    status: string;
    duration: number;
    lastStatusChangeAt: number;

}
export interface MachineDto {
    machineName: string;
}
export interface StaffDto {
    staffName: string;
}
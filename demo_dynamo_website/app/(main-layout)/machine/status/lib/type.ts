export interface MachineStatusType {
    id: string;
    machineDto: MachineDto;
    staffDto: StaffDto;
    drawingCodeName: string;
    pgTime: number;
    startTime: number;
    time: string;
    status: string;
    duration: number;
    lastStatusChangeAt: number;
}
export interface StaffDto {
    staffName: string;
}
export interface MachineDto {
    machineName: string;
}
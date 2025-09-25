export interface MachineStatistic {
    groupId: string;
    groupName: string;
    totalRunTime: number;
    totalStopTime: number;
    totalPgTime: number;
    totalOffsetTime: number;
    totalSpanTime: number;
    totalErrorTime: number;
    errorTimeRate: number;
    runTimeRate: number;
    stopTimeRate: number;
    pgTimeRate: number;
    offsetTimeRate: number;
    spanTimeRate: number;
    machines: Machine[] | null;
}

export interface Machine {
    machineId: number,
    machineName: string,
}
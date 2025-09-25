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
    totalMachines: number,
    totalProcesses: number,
    processRate: number,
    machines: Machine[] | null;
}

export interface Machine {
    machineId: number,
    machineName: string,
}

export interface MachineOverview {
    machineId: number;
    machineName: string;
    runTime: number;
    stopTime: number;
    pgTime: number;
    offsetTime: number;
    spanTime: number;
    pgTimeExpect: number;
    numberOfProcesses: number;
    groupTarget: number;
}

export interface TopMachine {
    machineName: string,
    machineId: number;
    totalRunTime: number;
}

export interface GroupEfficiency {
    groupId: string;
    groupName: string;
    operationalEfficiency: number;
    pgEfficiency: number;
    valueEfficiency: number;
    oee: number;
    offsetLoss: number;
    otherLoss: number;
}

export interface TotalRunTime {
    runTimeOfMainProduct: number;
    runTimeOfRerun: number;
    runTimeOfLK: number;
    runTimeOfElectric: number;
    totalRunTimeOfPreparation: number;
    totalPgTime: number;
    totalOffsetTime: number;
    totalStopTime: number;
    totalErrorTime: number;
}
export interface NewMachine {
    machineName: string,
    machineType: string,
    machineWork: string,
    machineOffice: string,
    year: number | null,
    month: number | null,
    groupId: string,
    groupName: string,
    machineMiningTarget: number | null,
    oee: number | null
}
export interface UpdateMachine extends NewMachine {
}
export interface Office {
    name: string
}

export interface GroupMachine {
    name: string
}


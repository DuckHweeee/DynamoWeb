export type Operator = {
    stt: string
    id: string
    name: string
    phong_ban: string
    nhom: string
    cong_viec: string
    trang_thai: number
}

export type Machine = {
    id: string
    name: string
    loai_may: string
    ma_may: string
}



export type Process = {
    id: string
    ma_ban_ve: string
    dnc: string
    tgdk: string
    snc: string
    ttnc: string
    trang_thai: string
}

export type HistoryProcess = {
    ma_ban_ve: string
    tsnc: number
    hoan_thanh: number
    chua_hoan_thanh: number
    tght: number
}

export type HistoryMachine = {
    ten_may: string
    id: string
    tgc: number
    tgd: number
    tgt: number
    tgl: number
}



// Demo data Dashboard
export type Operator2 = {
    id: string
    name: string
    gio_lam_viec: number
    so_nguyen_cong: number
    diem_nguyen_cong: number
}
export type DrawingCode2 = {
    id: string
    name: string
    thoi_gian_du_kien: number
    thoi_gian_thuc_te: number
}




// Tablet - Dữ liệu thật--------------------------------------------------------------------------------------------------------------
export interface Process2 {
    processId: string;
    partNumber: number;
    stepNumber: number;
    manufacturingPoint: number;
    pgTime: number;
    processType: string;
    processStatus: number;
    isPlan: number;
    status: number;
    orderDetailDto: OrderDetailDto;
    machineDto: Machine2 | null;
    planDto: PlanDto | null;
}

export interface PlanDto {
    id: number | null;
    inProgress: number | null;
    machineId: number | null;
    plannerId: string | null;
    processId: string | null;
    remark: number | null;
    staffId: number | null;
    status: number | null;
}


export interface OrderDetailDto {
    orderDetailId: string;
    drawingCodeId: string;
    orderId: string;
    poNumber: number;
    orderCode: string;
    quantity: number;
    orderType: string;
    createdDate: string;
    updatedDate: string;
    pgTimeGoal: number;
}
export interface Machine2 {
    machineId: number;
    machineName: string;
    machineType: string;
    machineWork: string;
    machineOffice: string;
    status: number;
    createdDate: string;
    updatedDate: string;
    groupId: string;
    machineKpiDtos: MachineKpiDtos;
}
export interface MachineKpiDtos {
    year: number | null,
    month: number | null,
    oee: number | null,
    machineMiningTarget: number | null,
    createdDate: string,
    updatedDate: string,
    machineId: number | null,
    machineName: string,
    machineStatus: number | null,
    groupId: string,
    groupName: string,
    id: number | null
}
export interface CurrentStaff {
    staffIdNumber: number
    staffId: string
    operatorName: string
    machineId: number
}

export interface Staff {
    staffId?: number | null;
    staffName: string;
    staffOffice: string;
    staffSection: string;
    shortName: string;
    status: number | null;
    staffKpiDtos?: StaffKpiDto;
    id: string;
}

export interface StaffKpiDto {
    kpiId?: number,
    year: number;
    month: number;
    pgTimeGoal: number;
    machineTimeGoal: number;
    manufacturingPoint: number;
    oleGoal: number;
    workGoal: number;
    kpi: number;
    createdDate: string;
    updatedDate: string;
    staffId?: number;
    staffName?: string,
    groupId: string,
    groupName?: string | null,
    staffStatus?: number,
    id: number;
}

export interface Group {
    groupId: string,
    groupName: string,
    // groupType: string,
    // "staffGroups": [],
    // "machineGroups": [],
    groupId: string;
    groupName: string;
    groupType: string;
    staffGroups: any[];
    machineGroups: any[];
    createdDate?: string;
    updatedDate?: string;
}

export interface CreateGroupData {
    groupName: string;
    groupType: string;
}

export interface UpdateGroupData {
    groupName: string;
    groupType: string;
}

// Group KPI Types
export interface GroupKPI {
    id: number;
    year: number;
    month: number | null;
    week: number | null;
    day: number | null;
    isMonth: number; // 0 = monthly KPI, 1 = weekly KPI, 2 = daily KPI
    office: string;
    workingHourGoal: number;
    workingHourDifference: number;
    workingHour: number;
    groupId: string;
    createdDate: string;
    updatedDate: string;
}

export interface NewGroupKPI {
    year: number | null;
    month: number | null;
    week: number | null;
    day: number | null;
    isMonth: number; // 0 = monthly KPI, 1 = weekly KPI, 2 = daily KPI
    office: string;
    workingHourGoal: number | null;
    workingHourDifference?: number | null; // Optional - backend will calculate
    workingHour?: number | null; // Optional - backend will calculate
    groupId: string;
}


export interface MachineDto {
    machineId: number;
    machineName: string;
    machineType: string;
    machineGroup: string;
    machineOffice: string;
    status: number;
    createdDate: string;
    updatedDate: string;
    groupId: string;
    groupName: string;
    machineKpiDtos: any;
}

export interface StaffDto {
    staffId?: string;
    staffName?: string;
}

export interface ProcessData {
    processId: string;
    partNumber: number;
    stepNumber: number;
    manufacturingPoint: number;
    processType: string;
    processStatus: number; // 1: Waiting, 2: In Progress, 3: Completed
    pgTime: number;
    startTime: string | null;
    endTime: string | null;
    createdDate: string;
    updatedDate: string;
    isPlan: number;
    status: number;
    orderDetailDto: OrderDetailDto | null; // Make orderDetailDto optional
    machineDto: MachineDto | null; // Make machineDto optional
    staffDtos: StaffDto[] | null;
    planDto: any;
    processTimeDto: any;
}

export interface DrawingCode {
    drawingCodeId: string;
    drawingCodeName: string;
    status: number;
    createdDate: string;
    updatedDate: string;
}
export interface Order {
    orderId: string;
    poNumber: string;
    createdDate: string;
    updatedDate: string;
    status: number;
}
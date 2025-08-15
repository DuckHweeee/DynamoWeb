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

export type DrawingCode = {
    id: string
    ma_ban_ve: string
    dnc: string
    trang_thai: string
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
    machineGroup: string;
    machineOffice: string;
    machineStatus: number;
    status: number;
    createdDate: string;
    updatedDate: string;
    groupId: string;
    machineKpiDtos: any; // Cần trao đổi thêm
}
export interface CurrentStaff {
    staffIdNumber: number
    staffId: string
    operatorName: string
    machineId: number
}

export interface Staff {
    staffId: number | null;
    staffName: string;
    staffOffice: string;
    staffSection: string;
    shortName: string;
    status: number | null;
    groupId: string;
    // staffKpiDtos?: StaffKpiDto;
    groupName?: string,
    id: string;
}
// export interface StaffKpiDto {
//     year: number;
//     month: number;
//     pgTimeGoal: number;
//     machineTimeGoal: number;
//     manufacturingPoint: number;
//     oleGoal: number;
//     workGoal: number;
//     kpi: number;
//     createdDate: string;
//     updatedDate: string;
//     staffId: number;
//     id: number;
// }

export interface StaffKPI {
    kpiId?: number,
    year: number | null,
    month: number | null,
    pgTimeGoal: number | null,
    machineTimeGoal: number | null,
    manufacturingPoint: number | null,
    oleGoal: number | null,
    workGoal: number | null,
    kpi: number | null,

}

export interface StaffWithKPI extends Staff {
    staffKpiDtos: StaffKPI[] | null;
}







import { Process2, Staff, CurrentStaff, Machine, Machine2 } from "./type"

export const mockProcess: Process2 = {
    processId: "P001",
    partNumber: 12345,
    stepNumber: 1,
    manufacturingPoint: 10,
    pgTime: 120,
    processType: "Milling",
    processStatus: 1,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(), // +1 giờ
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    isPlan: 1,
    status: 1,
    orderDetailDto: {
        orderDetailId: "OD001",
        drawingCodeId: "D001",
        orderId: "O001",
        orderCode: "ORD-001",
        quantity: 50,
        orderType: "Standard",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
    },
    machineDto: {
        machineId: 1001,
        machineName: "CNC-01",
        machineType: "CNC",
        machineGroup: "Group A",
        machineOffice: "Factory 1",
        status: 1,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        groupId: "MG001",
        machineKpiDtos: null // hoặc mảng giả nếu bạn cần
    }
}

export const mockMachineList: Machine2[] = [
    {
        machineId: 1001,
        machineName: "Máy CNC A01",
        machineType: "CNC",
        machineGroup: "Nhóm 1",
        machineOffice: "Xưởng 1",
        status: 1,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        groupId: "G01",
        machineKpiDtos: []
    },
    {
        machineId: 1002,
        machineName: "Máy Phay B02",
        machineType: "Phay",
        machineGroup: "Nhóm 2",
        machineOffice: "Xưởng 2",
        status: 0,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        groupId: "G02",
        machineKpiDtos: []
    },
    {
        machineId: 1003,
        machineName: "Máy Tiện C03",
        machineType: "Tiện",
        machineGroup: "Nhóm 1",
        machineOffice: "Xưởng 1",
        status: 1,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        groupId: "G01",
        machineKpiDtos: []
    }
]

export const mockStaff: Staff[] = [
    {
        staffId: 2001,
        staffName: "Nguyễn Văn A",
        staffOffice: "Factory 1",
        staffSection: "Section B",
        shortName: "NVA",
        status: 1,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        groupId: "SG001",
        staffKpiDtos: {
            year: 2025,
            month: 7,
            pgTimeGoal: 100,
            machineTimeGoal: 80,
            manufacturingPoint: 10,
            oleGoal: 85,
            workGoal: 20,
            kpi: 90,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            staffId: 2001,
            id: 1
        },
        id: "staff-2001"
    },
    {
        staffId: 2002,
        staffName: "Nguyễn Văn B",
        staffOffice: "Factory 1",
        staffSection: "Section B",
        shortName: "NVA",
        status: 1,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        groupId: "SG001",
        staffKpiDtos: {
            year: 2025,
            month: 7,
            pgTimeGoal: 100,
            machineTimeGoal: 80,
            manufacturingPoint: 10,
            oleGoal: 85,
            workGoal: 20,
            kpi: 90,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            staffId: 2001,
            id: 1
        },
        id: "staff-2001"
    },
]

export const mockCurrentStaff: CurrentStaff[] = [
    {
        staffId: "staff-2001",
        staffIdNumber: 123,
        operatorName: "Nguyễn Văn A",
        machineId: 1001
    },
    {
        staffId: "staff-2002",
        staffIdNumber: 456,
        operatorName: "Nguyễn Văn B",
        machineId: 1002
    },
]



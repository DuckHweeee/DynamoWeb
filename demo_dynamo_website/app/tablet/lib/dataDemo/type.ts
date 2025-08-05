// Data Demo
export interface OperationProcess {
    processId: string;
    partNumber: number;
    stepNumber: number;
    manufacturingPoint: number;
    pgTime: number;
    startTime: string | null;
    endTime: string | null;
    createdDate: number;
    updatedDate: number;
    status: number;
    drawingCodeDto: DrawingCodeDto;
    machineDto: any | null;
}
export interface DrawingCodeDto {
    drawingCodeId: string;
    drawingCodeName: string;
    addDate: string | null;
    status: number;
    createdDate: string;
    updatedDate: string;
}
export interface Operator {
    operatorId: number;
    operatorName: string;
    operatorOffice: string;
    operatorSection: string;
    operatorStep: string;
    kpi: number;
    status: number;
    createdDate: string;
    updatedDate: string;
    id: string;
}
export interface Machine {
    machineId: number;
    machineName: string;
    machineType: string;
    machineGroup: string;
    machineOffice: string;
    status: number;
    createdDate: string;
    updatedDate: string;
}
export const data2: OperationProcess[] = [
    {
        processId: "OP001",
        partNumber: 201,
        stepNumber: 1,
        manufacturingPoint: 10,
        pgTime: 60,
        startTime: "2025-07-24T07:00:00Z",
        endTime: "2025-07-24T08:00:00Z",
        createdDate: 1721802000000,
        updatedDate: 1721805600000,
        status: 1,
        drawingCodeDto: {
            drawingCodeId: "DC201",
            drawingCodeName: "Frame Support",
            addDate: "2025-07-01T00:00:00Z",
            status: 1,
            createdDate: "2025-06-01T00:00:00Z",
            updatedDate: "2025-07-15T00:00:00Z",
        },
        machineDto: {
            machineId: 3,
            machineName: "Grinder C3",
            machineType: "Grinder",
            machineGroup: "Group C",
            machineOffice: "Plant 3",
            status: 1,
            createdDate: "2025-03-15T07:45:00Z",
            updatedDate: "2025-06-10T08:30:00Z",
        },
    },
    {
        processId: "OP002",
        partNumber: 202,
        stepNumber: 2,
        manufacturingPoint: 20,
        pgTime: 45,
        startTime: null,
        endTime: null,
        createdDate: 1721805600000,
        updatedDate: 1721805600000,
        status: 0,
        drawingCodeDto: {
            drawingCodeId: "DC202",
            drawingCodeName: "Gear Cover",
            addDate: null,
            status: 0,
            createdDate: "2025-06-15T00:00:00Z",
            updatedDate: "2025-07-18T00:00:00Z",
        },
        machineDto: null,
    },
    {
        processId: "OP003",
        partNumber: 203,
        stepNumber: 3,
        manufacturingPoint: 30,
        pgTime: 75,
        startTime: "2025-07-24T09:00:00Z",
        endTime: "2025-07-24T10:30:00Z",
        createdDate: 1721812800000,
        updatedDate: 1721818200000,
        status: 1,
        drawingCodeDto: {
            drawingCodeId: "DC203",
            drawingCodeName: "Bracket Mount",
            addDate: "2025-07-10T00:00:00Z",
            status: 1,
            createdDate: "2025-06-20T00:00:00Z",
            updatedDate: "2025-07-20T00:00:00Z",
        },
        machineDto: {
            machineId: 5,
            machineName: "Laser Cutter E5",
            machineType: "Laser Cutter",
            machineGroup: "Group E",
            machineOffice: "Plant 2",
            status: 1,
            createdDate: "2025-05-20T10:30:00Z",
            updatedDate: "2025-06-24T10:30:00Z",
        },
    },
    {
        processId: "OP004",
        partNumber: 204,
        stepNumber: 4,
        manufacturingPoint: 40,
        pgTime: 90,
        startTime: "2025-07-24T11:00:00Z",
        endTime: "2025-07-24T12:30:00Z",
        createdDate: 1721820000000,
        updatedDate: 1721825400000,
        status: 1,
        drawingCodeDto: {
            drawingCodeId: "DC204",
            drawingCodeName: "Main Chassis",
            addDate: "2025-07-05T00:00:00Z",
            status: 1,
            createdDate: "2025-06-01T00:00:00Z",
            updatedDate: "2025-07-20T00:00:00Z",
        },
        machineDto: {
            machineId: 4,
            machineName: "Drill Press D4",
            machineType: "Drill",
            machineGroup: "Group D",
            machineOffice: "Plant 1",
            status: 1,
            createdDate: "2025-04-01T06:00:00Z",
            updatedDate: "2025-06-22T09:45:00Z",
        },
    },
    {
        processId: "OP005",
        partNumber: 205,
        stepNumber: 5,
        manufacturingPoint: 50,
        pgTime: 70,
        startTime: null,
        endTime: null,
        createdDate: 1721832000000,
        updatedDate: 1721832000000,
        status: 0,
        drawingCodeDto: {
            drawingCodeId: "DC205",
            drawingCodeName: "Control Panel",
            addDate: "2025-07-10T00:00:00Z",
            status: 1,
            createdDate: "2025-06-10T00:00:00Z",
            updatedDate: "2025-07-15T00:00:00Z",
        },
        machineDto: {
            machineId: 2,
            machineName: "CNC Milling B2",
            machineType: "CNC",
            machineGroup: "Group B",
            machineOffice: "Plant 2",
            status: 1,
            createdDate: "2025-02-10T09:30:00Z",
            updatedDate: "2025-06-18T11:15:00Z",
        },
    },
    {
        processId: "OP006",
        partNumber: 206,
        stepNumber: 6,
        manufacturingPoint: 60,
        pgTime: 120,
        startTime: "2025-07-24T13:00:00Z",
        endTime: "2025-07-24T15:00:00Z",
        createdDate: 1721835600000,
        updatedDate: 1721842800000,
        status: 1,
        drawingCodeDto: {
            drawingCodeId: "DC206",
            drawingCodeName: "Top Plate",
            addDate: "2025-07-15T00:00:00Z",
            status: 1,
            createdDate: "2025-06-25T00:00:00Z",
            updatedDate: "2025-07-22T00:00:00Z",
        },
        machineDto: {
            machineId: 1,
            machineName: "Lathe Machine A1",
            machineType: "Lathe",
            machineGroup: "Group A",
            machineOffice: "Plant 1",
            status: 1,
            createdDate: "2025-01-05T08:00:00Z",
            updatedDate: "2025-06-20T10:00:00Z",
        },
    },
    {
        processId: "OP007",
        partNumber: 207,
        stepNumber: 7,
        manufacturingPoint: 70,
        pgTime: 50,
        startTime: null,
        endTime: null,
        createdDate: 1721846400000,
        updatedDate: 1721846400000,
        status: 0,
        drawingCodeDto: {
            drawingCodeId: "DC207",
            drawingCodeName: "Side Arm",
            addDate: null,
            status: 0,
            createdDate: "2025-07-01T00:00:00Z",
            updatedDate: "2025-07-18T00:00:00Z",
        },
        machineDto: null,
    },
    {
        processId: "OP008",
        partNumber: 208,
        stepNumber: 8,
        manufacturingPoint: 80,
        pgTime: 110,
        startTime: "2025-07-24T16:00:00Z",
        endTime: "2025-07-24T17:50:00Z",
        createdDate: 1721853600000,
        updatedDate: 1721860200000,
        status: 1,
        drawingCodeDto: {
            drawingCodeId: "DC208",
            drawingCodeName: "Back Cover",
            addDate: "2025-07-18T00:00:00Z",
            status: 1,
            createdDate: "2025-06-15T00:00:00Z",
            updatedDate: "2025-07-23T00:00:00Z",
        },
        machineDto: {
            machineId: 5,
            machineName: "Laser Cutter E5",
            machineType: "Laser Cutter",
            machineGroup: "Group E",
            machineOffice: "Plant 2",
            status: 1,
            createdDate: "2025-05-20T10:30:00Z",
            updatedDate: "2025-06-24T10:30:00Z",
        },
    },
    {
        processId: "OP004",
        partNumber: 204,
        stepNumber: 4,
        manufacturingPoint: 40,
        pgTime: 90,
        startTime: "2025-07-24T11:00:00Z",
        endTime: "2025-07-24T12:30:00Z",
        createdDate: 1721820000000,
        updatedDate: 1721825400000,
        status: 1,
        drawingCodeDto: {
            drawingCodeId: "DC204",
            drawingCodeName: "Main Chassis",
            addDate: "2025-07-05T00:00:00Z",
            status: 1,
            createdDate: "2025-06-01T00:00:00Z",
            updatedDate: "2025-07-20T00:00:00Z",
        },
        machineDto: {
            machineId: 4,
            machineName: "Drill Press D4",
            machineType: "Drill",
            machineGroup: "Group D",
            machineOffice: "Plant 1",
            status: 1,
            createdDate: "2025-04-01T06:00:00Z",
            updatedDate: "2025-06-22T09:45:00Z",
        },
    },
    {
        processId: "OP005",
        partNumber: 205,
        stepNumber: 5,
        manufacturingPoint: 50,
        pgTime: 70,
        startTime: null,
        endTime: null,
        createdDate: 1721832000000,
        updatedDate: 1721832000000,
        status: 0,
        drawingCodeDto: {
            drawingCodeId: "DC205",
            drawingCodeName: "Control Panel",
            addDate: "2025-07-10T00:00:00Z",
            status: 1,
            createdDate: "2025-06-10T00:00:00Z",
            updatedDate: "2025-07-15T00:00:00Z",
        },
        machineDto: {
            machineId: 2,
            machineName: "CNC Milling B2",
            machineType: "CNC",
            machineGroup: "Group B",
            machineOffice: "Plant 2",
            status: 1,
            createdDate: "2025-02-10T09:30:00Z",
            updatedDate: "2025-06-18T11:15:00Z",
        },
    },
    {
        processId: "OP006",
        partNumber: 206,
        stepNumber: 6,
        manufacturingPoint: 60,
        pgTime: 120,
        startTime: "2025-07-24T13:00:00Z",
        endTime: "2025-07-24T15:00:00Z",
        createdDate: 1721835600000,
        updatedDate: 1721842800000,
        status: 1,
        drawingCodeDto: {
            drawingCodeId: "DC206",
            drawingCodeName: "Top Plate",
            addDate: "2025-07-15T00:00:00Z",
            status: 1,
            createdDate: "2025-06-25T00:00:00Z",
            updatedDate: "2025-07-22T00:00:00Z",
        },
        machineDto: {
            machineId: 1,
            machineName: "Lathe Machine A1",
            machineType: "Lathe",
            machineGroup: "Group A",
            machineOffice: "Plant 1",
            status: 1,
            createdDate: "2025-01-05T08:00:00Z",
            updatedDate: "2025-06-20T10:00:00Z",
        },
    },
    {
        processId: "OP007",
        partNumber: 207,
        stepNumber: 7,
        manufacturingPoint: 70,
        pgTime: 50,
        startTime: null,
        endTime: null,
        createdDate: 1721846400000,
        updatedDate: 1721846400000,
        status: 0,
        drawingCodeDto: {
            drawingCodeId: "DC207",
            drawingCodeName: "Side Arm",
            addDate: null,
            status: 0,
            createdDate: "2025-07-01T00:00:00Z",
            updatedDate: "2025-07-18T00:00:00Z",
        },
        machineDto: null,
    },
    {
        processId: "OP008",
        partNumber: 208,
        stepNumber: 8,
        manufacturingPoint: 80,
        pgTime: 110,
        startTime: "2025-07-24T16:00:00Z",
        endTime: "2025-07-24T17:50:00Z",
        createdDate: 1721853600000,
        updatedDate: 1721860200000,
        status: 1,
        drawingCodeDto: {
            drawingCodeId: "DC208",
            drawingCodeName: "Back Cover",
            addDate: "2025-07-18T00:00:00Z",
            status: 1,
            createdDate: "2025-06-15T00:00:00Z",
            updatedDate: "2025-07-23T00:00:00Z",
        },
        machineDto: {
            machineId: 5,
            machineName: "Laser Cutter E5",
            machineType: "Laser Cutter",
            machineGroup: "Group E",
            machineOffice: "Plant 2",
            status: 1,
            createdDate: "2025-05-20T10:30:00Z",
            updatedDate: "2025-06-24T10:30:00Z",
        },
    },

];
export const sampleOperators: Operator[] = [
    {
        operatorId: 1,
        operatorName: "Nguyen Van A",
        operatorOffice: "Plant 1",
        operatorSection: "Machining",
        operatorStep: "Step 1",
        kpi: 88,
        status: 1,
        createdDate: "2025-05-01T08:00:00Z",
        updatedDate: "2025-06-20T08:00:00Z",
        id: "OP001"
    },
    {
        operatorId: 2,
        operatorName: "Tran Thi B",
        operatorOffice: "Plant 2",
        operatorSection: "Welding",
        operatorStep: "Step 2",
        kpi: 92,
        status: 1,
        createdDate: "2025-05-03T09:30:00Z",
        updatedDate: "2025-06-21T09:30:00Z",
        id: "OP002"
    },
    {
        operatorId: 3,
        operatorName: "Pham Van C",
        operatorOffice: "Plant 3",
        operatorSection: "Assembly",
        operatorStep: "Step 3",
        kpi: 80,
        status: 0,
        createdDate: "2025-05-10T11:00:00Z",
        updatedDate: "2025-06-23T11:00:00Z",
        id: "OP003"
    }
];
export const sampleMachines: Machine[] = [
    {
        machineId: 1,
        machineName: "Lathe Machine A1",
        machineType: "Lathe",
        machineGroup: "Group A",
        machineOffice: "Plant 1",
        status: 1,
        createdDate: "2025-01-05T08:00:00Z",
        updatedDate: "2025-06-20T10:00:00Z",
    },
    {
        machineId: 2,
        machineName: "CNC Milling B2",
        machineType: "CNC",
        machineGroup: "Group B",
        machineOffice: "Plant 2",
        status: 1,
        createdDate: "2025-02-10T09:30:00Z",
        updatedDate: "2025-06-18T11:15:00Z",
    },
    {
        machineId: 3,
        machineName: "Grinder C3",
        machineType: "Grinder",
        machineGroup: "Group C",
        machineOffice: "Plant 3",
        status: 0,
        createdDate: "2025-03-15T07:45:00Z",
        updatedDate: "2025-06-10T08:30:00Z",
    },
    {
        machineId: 4,
        machineName: "Drill Press D4",
        machineType: "Drill",
        machineGroup: "Group D",
        machineOffice: "Plant 1",
        status: 1,
        createdDate: "2025-04-01T06:00:00Z",
        updatedDate: "2025-06-22T09:45:00Z",
    },
    {
        machineId: 5,
        machineName: "Laser Cutter E5",
        machineType: "Laser Cutter",
        machineGroup: "Group E",
        machineOffice: "Plant 2",
        status: 1,
        createdDate: "2025-05-20T10:30:00Z",
        updatedDate: "2025-06-24T10:30:00Z",
    }
];

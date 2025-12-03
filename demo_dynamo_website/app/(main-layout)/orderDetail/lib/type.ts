export interface OrderDetail {
    orderDetailId: string;
    drawingCodeId: string;
    drawingCodeName: string;
    orderId: string;
    poNumber: string;
    orderCode: string;
    quantity: number;
    orderType: string;
    createdDate: string;
    updatedDate: string;
    pgTimeGoal: number;
    managerGroupId: string;
    managerGroupName: string;
    numberOfSteps: number;
    office: string;
    progress: number;
    processTimeSummaryDto: ProcessTimeSummaryDto;
}

export interface ProcessTimeSummaryDto {
    id: number;
    quantity: number;
    productionStep: number;
    manufacturingPoint: number;
    pgTime: number;
    spanTime: number;
    runTime: number;
    stopTime: number;
    offsetTime: number;
}

export interface ProcessingObject {
    id: string,
    name: string
}

export interface Order {
    orderId: string;
    poNumber: string;
    createdDate: string;
    updatedDate: string;
    status: number;
}
export interface DrawingCode {
    drawingCodeId: string;
    drawingCodeName: string;
    status: number;
    createdDate: string;
    updatedDate: string;
}

export interface Group {
    groupId: string;
    groupName: string;
}

export interface UpdateOrderDetail {
    orderCode: string,
    office: string,
    managerGroupId: string,
    orderType: string,
    quantity: number,
    pgTimeGoal: number,
    numberOfSteps: number
    progress: number
}
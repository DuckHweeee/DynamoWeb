export interface ListOrderDetailStatusType {
    orderDetailId: string;
    orderCode: string;
    orderStatus: OrderDetailStatus[];
}
export interface OrderDetailStatus {
    partNumber: number;
    totalStep: number;
    doneStep: number;
}
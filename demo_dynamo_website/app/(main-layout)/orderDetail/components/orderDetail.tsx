"use client";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderDetail } from "../lib/type";
import steps from "./steps";
import dayjs from "dayjs";
import Steps from "./steps";

export interface OrderDetailProps {
    openDetail: boolean;
    onClose: () => void;
    orderDetail: OrderDetail | null
}
const screenScrollArea = "max-[1550px]:!max-h-[75vh] min-[1550px]:!max-h-[90vh]"
export default function DetailOrderDetail({ openDetail, onClose, orderDetail }: OrderDetailProps) {
    // console.log("process")
    // console.log(orderDetail)
    return (
        <Dialog open={openDetail} onOpenChange={onClose}>
            <DialogContent
                className=" !max-w-[600px] bg-[#e5e5e5] py-0 px-2 !left-auto !top-10 h-[90vh]
                 right-0 !translate-x-0 !translate-y-0 gap-y-0"
            >
                <DialogHeader className="px-2 pt-4 pb-2">
                    <DialogTitle className={`flex items-center gap-2 text-2xl font-semibold`}>
                        <span className="text-amber-600">📦</span> Chi tiết mã hàng gia công
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className={`p-1 ${screenScrollArea} `}>
                    {/* Kế hoạch */}
                    <div className="bg-white rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-5 bg-blue-800 rounded"></div>
                            <h3 className="text-blue-800 font-bold text-xl">Mã hàng gia công</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-y-7 text-sm">
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Đối tượng gia công</div>
                                <div className="flex text-[16px] font-medium capitalize">{orderDetail?.orderType ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">ID Mã hàng</div>
                                <div className="flex text-[16px] font-medium"> {orderDetail?.orderCode ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Số lượng</div>
                                <div className="flex text-[16px] font-medium"> {orderDetail?.quantity ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Nhóm quản lý</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.managerGroupName ?? "-"}</div>
                            </div>
                               <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Phòng sản xuất</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.office ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Giờ PG dự kiến</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.pgTimeGoal ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Ngày tạo</div>
                                {dayjs(orderDetail?.createdDate).format("DD/MM/YYYY HH:mm:ss") ?? "-"}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Ngày cập nhật</div>
                                {dayjs(orderDetail?.updatedDate).format("DD/MM/YYYY HH:mm:ss") ?? "-"}
                            </div>
                        </div>
                        <div className="my-6">
                            <Steps stepNumber={(Number(orderDetail?.processTimeSummaryDto?.quantity) / Number(orderDetail?.quantity)) * 100} />
                        </div>

                    </div>

                    <div className="bg-gray-50 rounded-xl py-2 px-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-5 bg-blue-800 rounded"></div>
                            <h3 className="text-blue-800 font-bold text-xl">Tính tổng lô hàng</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 text-sm">
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Số lượng gia công</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.processTimeSummaryDto?.quantity ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Tổng số nguyên công</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.processTimeSummaryDto?.productionStep ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Tổng điểm gia công</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.processTimeSummaryDto?.manufacturingPoint ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Tổng giờ PG</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.processTimeSummaryDto?.pgTime ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Tổng thời phí</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.processTimeSummaryDto?.spanTime ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Tổng giờ chạy</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.processTimeSummaryDto?.runTime ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Tổng giờ dừng</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.processTimeSummaryDto?.stopTime ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Tổng giờ chạy offset</div>
                                <div className="flex text-[16px] font-medium">{orderDetail?.processTimeSummaryDto?.offsetTime ?? "-"}</div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="flex justify-end">
                    <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white py-7 px-10 cursor-pointer text-xl">
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

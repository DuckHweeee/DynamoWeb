"use client";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Process } from "../lib/type";
import ProgressSteps from "./ProgressSteps";
import dayjs from "dayjs";
import Steps from "../../orderDetail/components/steps";

export interface OrderDetailProps {
    openDetail: boolean;
    onClose: () => void;
    process: Process | null
}
const screenScrollArea = "max-[1550px]:!max-h-[75vh] min-[1550px]:!max-h-[90vh]"
export default function DetailProcess({ openDetail, onClose, process }: OrderDetailProps) {

    // Calculate progress based on process status and time
    const calculateProgress = (process: Process | null): number => {
        if (process?.processStatus === 3) {
            return 100;
        }

        if (process?.processStatus === 1) {
            return 0;
        }

        if (process?.startTime && process?.pgTime) {
            const currentTime = new Date().getTime();
            const startTime = new Date(process.startTime).getTime();
            const progress = ((currentTime - startTime) / (process.pgTime * 3600000)) * 100;

            return Math.max(0, Math.min(100, progress));
        }

        return 0;
    };

    const progress = calculateProgress(process);
  
    return (
        <Dialog open={openDetail} onOpenChange={onClose}>
            <DialogContent
                className=" !max-w-[600px] bg-[#e5e5e5] py-0 px-2 !left-auto !top-2 h-[98vh]
                 right-0 !translate-x-0 !translate-y-0 gap-y-0"
            >
                <DialogHeader className="px-2 pt-4 pb-2">
                    <DialogTitle className={`flex items-center gap-2 text-2xl font-semibold`}>
                        <span className="text-amber-600">📦</span> Chi tiết đơn hàng
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className={`p-1 ${screenScrollArea} `}>
                    {/* Kế hoạch */}
                    <div className="bg-white rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-5 bg-blue-800 rounded"></div>
                            <h3 className="text-blue-800 font-bold text-xl">Kế hoạch</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-y-2 text-sm">
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Đối tượng gia công</div>
                                <div className="flex text-[16px] font-medium capitalize">{process?.processType ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Mã hàng</div>
                                <div className="flex text-[16px] font-medium"> {process?.orderDetailDto?.orderCode ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Số nguyên công</div>
                                <div className="flex text-[16px] font-medium"> {process?.partNumber ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Thứ tự nguyên công</div>
                                <div className="flex text-[16px] font-medium">{process?.stepNumber ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Điểm nguyên công</div>
                                <div className="flex text-[16px] font-medium">{process?.manufacturingPoint ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Giờ PG</div>
                                <div className="flex text-[16px] font-medium">{process?.pgTime ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">KH Máy</div>
                                <div className="flex text-[16px] font-medium">{process?.planDto?.machineId ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">KH Người vận hành</div>
                                <div className="flex text-[16px] font-medium">{process?.planDto?.staffId ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">KH bắt đầu</div>
                                <div className="flex text-[16px] font-medium">
                                    {dayjs(process?.planDto?.startTime).format("DD/MM/YYYY HH:mm:ss") ?? "-"}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">KH kết thúc</div>
                                <div className="flex text-[16px] font-medium">
                                    {dayjs(process?.planDto?.endTime).format("DD/MM/YYYY HH:mm:ss") ?? "-"}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Ngày tạo</div>
                                <div className="flex text-[16px] font-medium"> {dayjs(process?.planDto?.createdDate).format("DD/MM/YYYY") ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Người lập kế hoạch</div>
                                <div className="flex text-[16px] font-medium">Cần hỏi lại</div>
                            </div>
                        </div>
                    </div>

                    {/* Đánh giá */}
                    <div className="bg-gray-50 rounded-xl py-2 px-4 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-5 bg-blue-800 rounded"></div>
                            <h3 className="text-blue-800 font-bold text-xl">Đánh giá</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm">
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Nhân viên thực hiện</div>
                                <div className="flex text-[16px] font-medium">Chờ lấy nhân viên</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Máy thực hiện</div>
                                <div className="flex text-[16px] font-medium">{process?.machineDto?.machineName ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Thời điểm bắt đầu</div>
                                <div className="flex text-[16px] font-medium">{process?.createdDate ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Thời điểm kết thúc</div>
                                <div className="flex text-[16px] font-medium">{process?.updatedDate ?? "-"}</div>
                            </div>
                            {/* <div className="flex flex-col">
                                <div className="flex font-semibold text-lg text-[#c0c0c0]">Hiện trạng</div>
                                <div className="flex text-[16px] font-medium">{data.danhGia.hienTrang}</div>
                            </div> */}
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Thực thi</div>
                                <div className="flex text-[16px] font-medium">{process?.processStatus === 2 ? "Yes" : "No"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Người đánh giá</div>
                                <div className="flex text-[16px] font-medium">{process?.planDto?.remark ?? "-"}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Ngày đánh giá</div>
                                <div className="flex text-[16px] font-medium">{process?.planDto?.remarkTime ?? "-"}</div>
                            </div>
                        </div>
                        <Steps stepNumber={progress} />
                    </div>

                    {/* Tổng giờ hoạt động */}
                    {/* <div className="bg-gray-50 rounded-xl py-2 px-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-5 bg-blue-800 rounded"></div>
                            <h3 className="text-blue-800 font-bold text-xl">Tổng giờ hoạt động</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm">
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Thời phí</div>
                                <div className="flex text-[16px] font-medium">Đợi thông tin</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Giờ chạy</div>
                                <div className="flex text-[16px] font-medium">Đợi thông tin</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Giờ dừng</div>
                                <div className="flex text-[16px] font-medium">Đợi thông tin</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Giờ chạy PG</div>
                                <div className="flex text-[16px] font-medium">Đợi thông tin</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-lg text-[#c0c0c0]">Giờ chạy offset</div>
                                <div className="flex text-[16px] font-medium">Đợi thông tin</div>
                            </div>
                        </div>
                    </div> */}
                </ScrollArea>

                <div className="flex justify-end py-2">
                    <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white py-5 px-6 cursor-pointer">
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

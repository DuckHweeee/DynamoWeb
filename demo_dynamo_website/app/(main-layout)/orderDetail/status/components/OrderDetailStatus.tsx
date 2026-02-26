import { Card } from "@/components/ui/card";
import { ListOrderDetailStatusType, OrderDetailStatus } from "../lib/type";
import { ClipboardList } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function OrderCard({
  order,
}: {
  order: ListOrderDetailStatusType;
}) {
  const totalStep = order.orderStatus.reduce((s, x) => s + x.totalStep, 0);
  const doneStep = order.orderStatus.reduce((s, x) => s + x.doneStep, 0);
  const percent = Math.round((doneStep / totalStep) * 100);
  const percentColor =
    percent < 60
      ? "bg-red-200 text-red-700"
      : percent < 80
        ? "bg-yellow-200 text-yellow-700"
        : "bg-green-200 text-green-700";

  return (
    <Card className="p-4 bg-white/20 backdrop-blur border border-white/20 shadow-lg rounded-[10px] shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <span className="border px-3 py-1 bg-white rounded-md"> <ClipboardList size={21} /></span>
          <span className="border px-3 py-1 bg-white rounded-md">{order.orderCode}</span>
        </div>

        <div
          className={`${percentColor} px-2 py-1 rounded-sm font-bold text-sm`}
        >
          {percent}%
        </div>
      </div>
      <div className="w-full h-px bg-gray-300" />
      {/* Table header */}
      <div className="flex justify-between text-gray-600 text-sm font-medium">
        <div className="w-1/4 text-white">Thứ tự</div>
        <div className="w-full text-center text-white">Trạng thái</div>
      </div>

      <div className="mt-2 space-y-3">
        {order.orderStatus.map((item: OrderDetailStatus, index: number) => {
          const progress = Math.round((item.doneStep / item.totalStep) * 100);
          return (
            <div key={index} className="flex items-between gap-3">
              {/* Circle number */}
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-base mr-7">
                <span>{item.partNumber}</span>
              </div>

              {/* Progress section */}
              <div className="flex-1">
                <div className="w-full h-3 bg-  gray-200 rounded-full overflow-hidden">
                  <Progress
                    value={progress}
                    className={`w-full ${progress < 50
                      ? "[&>div]:!bg-red-500"
                      : progress < 80
                        ? "[&>div]:!bg-yellow-500"
                        : "[&>div]:!bg-green-500"
                      }`}
                  />
                </div>
                <div className="flex justify-between text-base text-white mt-1 ">

                  {item.doneStep}/{item.totalStep} chi tiết

                  <span>{item.doingStep} đang thực hiện</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>

  );
}

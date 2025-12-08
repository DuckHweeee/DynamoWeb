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
    <Card className="p-4 rounded-xl shadow-md border w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <ClipboardList size={20} />
          {order.orderCode}
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
        <div className="w-1/4">Thứ tự</div>
        <div className="w-full text-center">Trạng thái</div>
      </div>

      <div className="mt-2 space-y-3">
        {order.orderStatus.map((item: OrderDetailStatus, index: number) => {
          const progress = Math.round((item.doneStep / item.totalStep) * 100);
          return (
            <div key={index} className="flex items-between gap-3">
              {/* Circle number */}
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-base mr-7">
                {item.partNumber}
              </div>

              {/* Progress section */}
              <div className="flex-1">
                <div className="w-full h-3 bg-  gray-200 rounded-full overflow-hidden">
                  <Progress
                    value={progress}
                    className={`w-full ${
                      progress < 50
                        ? "[&>div]:!bg-red-500"
                        : progress < 80
                        ? "[&>div]:!bg-yellow-500"
                        : "[&>div]:!bg-green-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-base text-gray-500 mt-1 ">
                  <span>
                    {item.doneStep}/{item.totalStep} chi tiết
                  </span>
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

import { ListOrderDetailStatusType } from "../lib/type";
import OrderCard from "./OrderDetailStatus";

export default function OrderList({ data }: { data: ListOrderDetailStatusType[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {data.map((order) => (
        <OrderCard key={order.orderDetailId} order={order} />
      ))}
    </div>
  );
}
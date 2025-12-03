"use client";

import axios from "axios";
import { toast } from "sonner";

export async function deleteOrderDetail(
  orderDetailId: number | string,
  refetch: () => void
) {
  try {
    if (!orderDetailId) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa mục này không?");
    if (!confirmed) return;

    const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;

    await axios.delete(`${urlLink}/api/order-detail/${orderDetailId}`);

    toast.success("Xóa thành công!");

    await refetch();
  } catch (error) {
    console.error(error);
    toast.error("Xóa thất bại, vui lòng thử lại.");
  }
}
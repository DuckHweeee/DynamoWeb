"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FlexibleCombobox } from "./FlexibleCombobox";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { OrderDetail, UpdateOrderDetail } from "../lib/type";
import { processingObjectList } from "../lib/data";
import { useOrder } from "../hooks/useOrder";
import { useDrawingCode } from "../hooks/useDrawingCode";
import { useGroup } from "../hooks/useGroup";
type EditOrderDetailFormProps = {
  initialData: OrderDetail;
  onUpdate: (updated: OrderDetail) => void;
  onCancel: () => void;
};
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function EditOrderDetailForm({
  initialData,
  onUpdate,
  onCancel,
}: EditOrderDetailFormProps) {
  // console.log("initialData")
  // console.log(initialData)
  const { data: orderList } = useOrder();
  const { data: drawingCodeList } = useDrawingCode();
  const { data: groupList } = useGroup();

  const [updateOrderDetail, setUpdateOrderDetail] = useState<UpdateOrderDetail>(
    {
      orderCode: "",
      office: "",
      managerGroupId: "",
      orderType: "",
      quantity: 0,
      pgTimeGoal: 0,
      numberOfSteps: 0,
      progress: 0,
    }
  );
  const officeList = [
    { name: "MOLD", value: "MOLD" },
    { name: "PIN", value: "PIN" },
    { name: "D_INSERT", value: "D_INSERT" },
  ];
  const progressList = [
    { name: "Đang chờ", value: 1 },
    { name: "Đang thực hiện", value: 2 },
    { name: "Đã hoàn thành", value: 3 },
  ];

  useEffect(() => {
    if (initialData) {
      setUpdateOrderDetail({
        orderCode: initialData.orderCode ?? "",
        office: initialData.office ?? "",
        managerGroupId: initialData.managerGroupId ?? "",
        orderType: initialData.orderType ?? "",
        quantity: initialData.quantity ?? null,
        pgTimeGoal: initialData.pgTimeGoal ?? null,
        numberOfSteps: initialData.numberOfSteps ?? null,
        progress: initialData.progress ?? 0,
      });
    }
  }, [initialData]);
  const handleUpdate = async () => {
    if (
      !updateOrderDetail.orderCode ||
      !updateOrderDetail.office ||
      !updateOrderDetail.managerGroupId ||
      !updateOrderDetail.orderType ||
      !updateOrderDetail.quantity ||
      !updateOrderDetail.pgTimeGoal ||
      !updateOrderDetail.numberOfSteps ||
      !updateOrderDetail.progress
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    console.log("updateOrderDetail", updateOrderDetail);
    try {
      const response = await fetch(
        `${urlLink}/api/order-detail/${initialData.orderDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderCode: updateOrderDetail.orderCode,
            office: updateOrderDetail.office,
            managerGroupId: updateOrderDetail.managerGroupId,
            orderType: updateOrderDetail.orderType,
            pgTimeGoal: Number(updateOrderDetail.pgTimeGoal),
            quantity: Number(updateOrderDetail.quantity),
            numberOfSteps: Number(updateOrderDetail.numberOfSteps),
            progress: Number(updateOrderDetail.progress),
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gửi thất bại.");
      }
      toast.success("Chỉnh sửa thành công!");
      location.reload();
      onCancel();
      setUpdateOrderDetail({
        orderCode: "",
        office: "",
        managerGroupId: "",
        orderType: "",
        quantity: 0,
        pgTimeGoal: 0,
        numberOfSteps: 0,
        progress: 0,
      });
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi.");
    }
  };
  return (
    <div className="space-y-3">
      <div className="grid gap-2 grid-cols-2">
        <div className="grid gap-1">
          <Label htmlFor="process" className="text-lg">
            ID mã hàng
          </Label>
          {/* <FlexibleCombobox
                        options={orderList}
                        value={updateOrderDetail.orderId}
                        onChange={(val) => setUpdateOrderDetail({ ...updateOrderDetail, orderId: val })}
                        displayField="poNumber"
                        valueField="orderId"
                        placeholder="Chọn mã đơn hàng"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    /> */}
          <Input
            id="orderDetailId"
            type="text"
            placeholder="Nhập ID mã hàng"
            className="!text-xl !placeholder-gray-300"
            value={updateOrderDetail.orderCode}
            onChange={(e) =>
              setUpdateOrderDetail({
                ...updateOrderDetail,
                orderCode: e.target.value,
              })  
            }
          />
        </div>
        {/* <div className="grid gap-1">
                    <Label htmlFor="staff" className="text-lg">Mã Bản Vẽ</Label>
                    <FlexibleCombobox
                        options={drawingCodeList}
                        value={updateOrderDetail.drawingCodeId}
                        onChange={(val) => setUpdateOrderDetail({ ...updateOrderDetail, drawingCodeId: val })}
                        displayField="drawingCodeName"
                        valueField="drawingCodeId"
                        placeholder="Chọn mã bản vẽ"
                        allowCustom={false}
                        widthSelect={"w-[320]"}
                    />
                </div> */}
        <div className="grid gap-1">
          <Label htmlFor="partNumber" className="text-lg">
            Đối Tượng Gia Công
          </Label>
          <FlexibleCombobox
            options={processingObjectList}
            value={updateOrderDetail.orderType}
            onChange={(val) =>
              setUpdateOrderDetail({ ...updateOrderDetail, orderType: val })
            }
            displayField="name"
            valueField="name"
            placeholder="Chọn đối tượng gia công"
            allowCustom={false}
            widthSelect={"w-[320]"}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="quantity" className="text-lg">
            Số lượng nguyên công(Chỉ có thể tăng)
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder="Số Lượng"
            className="!text-xl !placeholder-gray-300"
            value={updateOrderDetail.numberOfSteps}
            onChange={(e) =>
              setUpdateOrderDetail({
                ...updateOrderDetail,
                numberOfSteps: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="quantity" className="text-lg">
            Số Lượng
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder="Số Lượng"
            className="!text-xl !placeholder-gray-300"
            value={updateOrderDetail.quantity}
            onChange={(e) =>
              setUpdateOrderDetail({
                ...updateOrderDetail,
                quantity: Number(e.target.value),
              })
            }
            disabled
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="managerGroupName" className="text-lg">
            Nhóm
          </Label>
          <FlexibleCombobox
            options={groupList}
            value={updateOrderDetail.managerGroupId}
            onChange={(val) =>
              setUpdateOrderDetail({
                ...updateOrderDetail,
                managerGroupId: val,
              })
            }
            displayField="groupName"
            valueField="groupId"
            placeholder="Chọn nhóm"
            allowCustom={false}
            widthSelect={"w-[320]"}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="managerGroupName" className="text-lg">
            Phòng sản xuất
          </Label>
          <FlexibleCombobox
            options={officeList}
            value={updateOrderDetail.office}
            onChange={(val) =>
              setUpdateOrderDetail({ ...updateOrderDetail, office: val })
            }
            displayField="name"
            valueField="value"
            placeholder="Chọn nhóm"
            allowCustom={false}
            widthSelect={"w-[320]"}
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="pgTime" className="text-lg">
            PG Dự Kiến(Phút)
          </Label>
          <Input
            id="pgTime"
            type="number"
            placeholder="Giờ PG dự kiến"
            className="!text-xl !placeholder-gray-300"
            value={updateOrderDetail.pgTimeGoal}
            onChange={(e) =>
              setUpdateOrderDetail({
                ...updateOrderDetail,
                pgTimeGoal: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="managerGroupName" className="text-lg">
            Trạng thái
          </Label>
          <FlexibleCombobox
            options={progressList}
            value={updateOrderDetail.progress.toString()}
            onChange={(val) =>
              setUpdateOrderDetail({
                ...updateOrderDetail,
                progress: Number(val),
              })
            }
            displayField="name"
            valueField="value"
            placeholder="Chọn nhóm"
            allowCustom={false}
            widthSelect={"w-[320]"}
          />
        </div>
      </div>
      {/* <div className="flex justify-between ">
                <div className="flex text-xl items-center pl-6 font-medium w-fit ">
                    <span className="pr-3">
                        Trạng Thái:
                    </span>
                    <Select
                        value={updateStaff?.status?.toString()}
                        onValueChange={(value) =>
                            setUpdateStaff((prev) => ({ ...prev, status: Number(value) }))
                        }
                    >
                        <SelectTrigger
                            className={`w-auto text-lg [&>span]:text-[16px] gap-5 ${updateStaff?.status === 1
                                ? "bg-[#E7F7EF] text-[#0CAF60]"
                                : "bg-[#FFE6E6] text-[#fb5656]"
                                }`}
                        >
                            <SelectValue placeholder="Chọn nhóm" />
                        </SelectTrigger>
                        <SelectContent id="nhom">
                            <SelectGroup>
                                {statusList.map((g) => (
                                    <SelectItem
                                        className="text-lg"
                                        key={g.id}
                                        value={g.id.toString()}
                                    >
                                        {g.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                        Hủy
                    </Button>
                    <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer">
                        Lưu thay đổi
                    </Button>
                </div>
            </div> */}
      <div className="flex gap-4 pt-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          className="text-xl py-6 px-10 cursor-pointer"
        >
          Hủy
        </Button>
        <Button
          onClick={handleUpdate}
          className="bg-[#074695] hover:bg-[#0754B4] text-xl py-6 px-10 cursor-pointer"
        >
          Lưu
        </Button>
      </div>
    </div>
  );
}

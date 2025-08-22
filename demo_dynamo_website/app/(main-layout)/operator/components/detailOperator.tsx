"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Staff } from "@/lib/type"
import { useStaffKPI } from "../hooks/useStaffWithKPI"
import { KPI } from "../kpi/lib/type"
import { SelectYear } from "./SelectYear"
import { SelectMonth } from "./SelectMonth"

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type DetailStaffFormProps = {
    onCancel: () => void
    staff: Staff
}
export default function DetailStaffForm({
    onCancel,
    staff
}: DetailStaffFormProps) {
    const { data: staffKPI } = useStaffKPI()
    const idStaffString = staff.id;

    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [displayKPI, setDisplayKPI] = useState<KPI | null>(null);

    // Lấy năm và tháng lần đầu load
    useEffect(() => {
        if (staff.staffKpiDtos && !selectedYear && !selectedMonth) {
            setSelectedYear(String(staff.staffKpiDtos.year));
            setSelectedMonth(String(staff.staffKpiDtos.month));
        }
    }, [staff, selectedYear, selectedMonth]);

    // Dữ liệu ban đầu
    useEffect(() => {
        if (staff.staffKpiDtos) {
            setDisplayKPI({
                kpiId: Number(staff.staffKpiDtos.kpiId),
                year: Number(staff.staffKpiDtos.year),
                month: Number(staff.staffKpiDtos.month),
                pgTimeGoal: Number(staff.staffKpiDtos.pgTimeGoal),
                machineTimeGoal: Number(staff.staffKpiDtos.machineTimeGoal),
                manufacturingPoint: Number(staff.staffKpiDtos.manufacturingPoint),
                oleGoal: Number(staff.staffKpiDtos.oleGoal),
                workGoal: Number(staff.staffKpiDtos.workGoal),
                kpi: Number(staff.staffKpiDtos.kpi),
                staffId: String(staff.staffId),
                staffName: String(staff.staffName),
                groupId: String(staff.staffKpiDtos.groupId),
                groupName: String(staff.staffKpiDtos.groupName),
                staffStatus: Number(staff.status),
                id: Number(staff.id),
            });
        }
    }, [staff]);

    // Cập nhật thông khi chọn tháng/năm
    useEffect(() => {
        if (selectedYear && selectedMonth) {
            const kpiFound = staffKPI.find(
                (item) =>
                    item.year.toString() === selectedYear &&
                    item.month.toString() === selectedMonth &&
                    item.staffId === idStaffString
            );
            setDisplayKPI(kpiFound || null);
        } else {
            setDisplayKPI(null);
        }
    }, [selectedYear, selectedMonth, staffKPI, idStaffString]);

    return (
        <>
            {/* Màng hinh nhỏ bằng laptop */}
            <div className="hidden max-[1550px]:block">
                <div className="grid gap-3 w-full">
                    <div className="grid gap-7">
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin nhân viên</div>
                            <div className="grid gap-4 grid-cols-3">
                                <div className="grid">
                                    <Label htmlFor="staffId" className="text-lg !font-normal">Mã nhân viên</Label>
                                    <Input
                                        id="staffId"
                                        placeholder="Mã nhân viên"
                                        readOnly
                                        inputMode="numeric"
                                        value={String(staff.staffId) ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />

                                </div>
                                <div className="grid">
                                    <Label htmlFor="name" className="text-lg !font-normal">Họ và tên</Label>
                                    <Input
                                        id="name"
                                        placeholder="Tên nhân viên"
                                        readOnly
                                        value={staff.staffName}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="shortName" className="text-lg !font-normal">Tên tắt</Label>
                                    <Input
                                        id="shortName"
                                        placeholder="Tên tắt"
                                        readOnly
                                        value={staff?.shortName ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="phong_ban" className="text-lg !font-normal">Phòng ban</Label>
                                    <Input
                                        id="shortName"
                                        placeholder="Tên tắt"
                                        readOnly
                                        value={staff.staffOffice?.toLowerCase() ?? ""}
                                        className="!text-lg placeholder:text-[16px] capitalize"
                                    />
                                </div>
                                {/* {selectedKPI && ( */}
                                <div className="grid">
                                    <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                    <Input
                                        id="shortName"
                                        placeholder="nhom"
                                        readOnly
                                        value={displayKPI?.groupName.toLowerCase() ?? ""}
                                        className="!text-lg placeholder:text-[16px] capitalize"
                                    />
                                </div>
                                {/* )} */}

                                <div className="grid">
                                    <Label htmlFor="cong_viec" className="text-lg !font-normal">Công việc</Label>
                                    <Input
                                        id="cong_viec"
                                        placeholder="Công Việc"
                                        value={staff.staffSection ?? ""}
                                        readOnly
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mục tiêu nhân viên */}
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu nhân viên</div>
                            <div className="grid gap-4 grid-cols-2 pb-3">
                                <div className="flex flex-row items-center gap-2">
                                    <Label htmlFor="name" className="text-lg !font-normal">
                                        Năm
                                    </Label>
                                    <SelectYear
                                        value={selectedYear}
                                        onChange={(value) => setSelectedYear(value)}
                                        totalYears={5}
                                        placeholder="Chọn năm"
                                    />

                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                    <SelectMonth
                                        value={selectedMonth}
                                        onChange={(value) => setSelectedMonth(value)}
                                    // showAllOption={true}
                                    />
                                </div>
                            </div>
                            {/* {selectedKPI && ( */}
                            <div className="grid gap-4 grid-cols-3">
                                <div className="grid">
                                    <Label htmlFor="kpi" className="text-lg !font-normal">KPI</Label>
                                    <Input
                                        id="kpi"
                                        className="!text-lg"
                                        placeholder="Mục tiêu làm việc"
                                        type="number"
                                        inputMode="numeric"
                                        value={displayKPI?.kpi ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="workGoal" className="text-lg !font-normal">Mục tiêu nhân viên làm việc</Label>
                                    <Input
                                        id="workGoal"
                                        placeholder="Mục tiêu làm việc"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        value={displayKPI?.workGoal ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="pgTimeGoal" className="text-lg !font-normal">Mục tiêu giờ PG</Label>
                                    <Input
                                        id="pgTimeGoal"
                                        placeholder="Mục tiêu giờ PG"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        value={displayKPI?.pgTimeGoal ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="machineTimeGoal" className="text-lg !font-normal">Mục tiêu giờ máy</Label>
                                    <Input
                                        id="machineTimeGoal"
                                        placeholder="Mục tiêu giờ máy"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        value={displayKPI?.machineTimeGoal ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="manufacturingPoint" className="text-lg !font-normal">Mục tiêu điểm gia công</Label>
                                    <Input
                                        id="manufacturingPoint"
                                        placeholder="Mục tiêu điểm gia công"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        value={displayKPI?.manufacturingPoint ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="oleGoal" className="text-lg !font-normal">Mục tiêu Ole</Label>
                                    <Input
                                        id="oleGoal"
                                        placeholder="Mục tiêu Ole"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        readOnly
                                        value={displayKPI?.oleGoal ?? ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between ">
                        <div className="flex text-xl items-center pl-3 font-medium w-fit ">
                            <span>
                                Trạng Thái:
                            </span>
                            <Input
                                type="text" // đổi thành text để hiển thị chữ
                                readOnly
                                value={
                                    staff?.status === 1
                                        ? "Đang làm"
                                        : staff?.status === 0
                                            ? "Đã nghỉ"
                                            : ""
                                }
                                className={`w-auto !text-xl [&>span]:text-[16px] items-center border-0 shadow-none ${staff?.status === 1
                                    ? " text-[#0CAF60]"
                                    : " text-[#fb5656]"
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Màng hinh lớn hơn laptop */}
            <div className="hidden min-[1550px]:block">
                <div className="grid gap-3 w-full">
                    <div className="grid gap-7">
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin nhân viên</div>
                            <div className="grid gap-4 grid-cols-3">
                                <div className="grid">
                                    <Label htmlFor="staffId" className="text-lg !font-normal">Mã nhân viên</Label>
                                    <Input
                                        id="staffId"
                                        placeholder="Mã nhân viên"
                                        readOnly
                                        inputMode="numeric"
                                        value={String(staff.staffId) ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />

                                </div>
                                <div className="grid">
                                    <Label htmlFor="name" className="text-lg !font-normal">Họ và tên</Label>
                                    <Input
                                        id="name"
                                        placeholder="Tên nhân viên"
                                        readOnly
                                        value={staff.staffName}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="shortName" className="text-lg !font-normal">Tên tắt</Label>
                                    <Input
                                        id="shortName"
                                        placeholder="Tên tắt"
                                        readOnly
                                        value={staff?.shortName ?? ""}
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="phong_ban" className="text-lg !font-normal">Phòng ban</Label>
                                    <Input
                                        id="shortName"
                                        placeholder="Tên tắt"
                                        readOnly
                                        value={staff.staffOffice?.toLowerCase() ?? ""}
                                        className="!text-lg placeholder:text-[16px] capitalize"
                                    />
                                </div>
                                {/* {selectedKPI && ( */}
                                <div className="grid">
                                    <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                                    <Input
                                        id="shortName"
                                        placeholder="nhom"
                                        readOnly
                                        value={displayKPI?.groupName.toLowerCase() ?? ""}
                                        className="!text-lg placeholder:text-[16px] capitalize"
                                    />
                                </div>
                                {/* )} */}

                                <div className="grid">
                                    <Label htmlFor="cong_viec" className="text-lg !font-normal">Công việc</Label>
                                    <Input
                                        id="cong_viec"
                                        placeholder="Công Việc"
                                        value={staff.staffSection ?? ""}
                                        readOnly
                                        className="!text-lg placeholder:text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mục tiêu nhân viên */}
                        <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                            <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu nhân viên</div>
                            <div className="grid gap-4 grid-cols-2 pb-3">
                                <div className="flex flex-row items-center gap-2">
                                    <Label htmlFor="name" className="text-lg !font-normal">
                                        Năm
                                    </Label>
                                    <SelectYear
                                        value={selectedYear}
                                        onChange={(value) => setSelectedYear(value)}
                                        totalYears={5}
                                        placeholder="Chọn năm"
                                    />

                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                    <SelectMonth
                                        value={selectedMonth}
                                        onChange={(value) => setSelectedMonth(value)}
                                    // showAllOption={true}
                                    />
                                </div>
                            </div>
                            {/* {selectedKPI && ( */}
                            <div className="grid gap-4 grid-cols-3">
                                <div className="grid">
                                    <Label htmlFor="kpi" className="text-lg !font-normal">KPI</Label>
                                    <Input
                                        id="kpi"
                                        className="!text-lg"
                                        placeholder="Mục tiêu làm việc"
                                        type="number"
                                        inputMode="numeric"
                                        value={displayKPI?.kpi ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="workGoal" className="text-lg !font-normal">Mục tiêu nhân viên làm việc</Label>
                                    <Input
                                        id="workGoal"
                                        placeholder="Mục tiêu làm việc"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        value={displayKPI?.workGoal ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="pgTimeGoal" className="text-lg !font-normal">Mục tiêu giờ PG</Label>
                                    <Input
                                        id="pgTimeGoal"
                                        placeholder="Mục tiêu giờ PG"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        value={displayKPI?.pgTimeGoal ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="machineTimeGoal" className="text-lg !font-normal">Mục tiêu giờ máy</Label>
                                    <Input
                                        id="machineTimeGoal"
                                        placeholder="Mục tiêu giờ máy"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        value={displayKPI?.machineTimeGoal ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="manufacturingPoint" className="text-lg !font-normal">Mục tiêu điểm gia công</Label>
                                    <Input
                                        id="manufacturingPoint"
                                        placeholder="Mục tiêu điểm gia công"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        value={displayKPI?.manufacturingPoint ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="grid">
                                    <Label htmlFor="oleGoal" className="text-lg !font-normal">Mục tiêu Ole</Label>
                                    <Input
                                        id="oleGoal"
                                        placeholder="Mục tiêu Ole"
                                        type="number"
                                        inputMode="numeric"
                                        className="!text-lg"
                                        readOnly
                                        value={displayKPI?.oleGoal ?? ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between ">
                        <div className="flex text-xl items-center pl-3 font-medium w-fit ">
                            <span>
                                Trạng Thái:
                            </span>
                            <Input
                                type="text" // đổi thành text để hiển thị chữ
                                readOnly
                                value={
                                    staff?.status === 1
                                        ? "Đang làm"
                                        : staff?.status === 0
                                            ? "Đã nghỉ"
                                            : ""
                                }
                                className={`w-auto !text-xl [&>span]:text-[16px] items-center border-0 shadow-none ${staff?.status === 1
                                    ? " text-[#0CAF60]"
                                    : " text-[#fb5656]"
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

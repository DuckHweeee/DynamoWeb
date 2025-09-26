"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroups } from "@/hooks/useGroup";
import { ReportTimeOperatorDetail } from "./components/ReportTimeOperatorDetail";
import TableOperatorDetail from "./components/TableOperatorDetail";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DateRangeSelectorDetail from "./components/DateRangeSelectorDetail";
import { Button } from "@/components/ui/button";
import { Download, UserRoundSearch, } from "lucide-react";
import { useStaffStatisticHistoryProcess, useStaffStatisticWorking, useStaffStatisticWorkingDetail } from "./hook/useStaffStatisticDetail";
import { BarChartOperatorDetail, } from "./components/BarChartOperatorDetail";
import { toast } from "sonner";
import { StaffStatistic } from "../lib/type";
import { useRouter } from 'next/navigation';
const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function OperationDetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

    // Lấy giá trị từ URL
    const startDateFromUrl = searchParams.get("startDate") || "";
    const endDateFromUrl = searchParams.get("endDate") || "";
    const groupIdFromUrl = searchParams.get("groupId") || "";
    const staffIdFromUrl = searchParams.get("staffId") || "";

    const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
    const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
    const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
    const [selectedStaff, setSelectedStaff] = useState<number | null>(
        staffIdFromUrl ? Number(staffIdFromUrl) : null
    );

    // Sync từ URL
    useEffect(() => {
        setSelectedStartDate(startDateFromUrl);
        setSelectedEndDate(endDateFromUrl);
        setSelectedGroup(groupIdFromUrl);
        setSelectedStaff(Number(staffIdFromUrl));
    }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, staffIdFromUrl]);

    // const queryParams = useMemo(() => {
    //     if (!selectedGroup || !selectedStartDate || !selectedEndDate) return null;
    //     return {
    //         group: selectedGroup,
    //         startDate: selectedStartDate,
    //         endDate: selectedEndDate,
    //         id: selectedStaff,
    //     };
    // }, [selectedGroup, selectedStartDate, selectedEndDate, selectedStaff]);

    const { data: groupList = [] } = useGroups();

    const [dataOverview, setDataOverview] = useState<StaffStatistic | null>(null);

    const { data: dataOverviewDefault } = useStaffStatisticWorking(
        selectedStaff ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? ""
    );
    useEffect(() => {
        if (dataOverviewDefault) {
            setDataOverview(dataOverviewDefault);
        }
    }, [dataOverviewDefault]);

    const { data: dataWorkingDetail } = useStaffStatisticWorkingDetail(
        groupIdFromUrl ?? "",
        selectedStaff ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? ""
    );
    let staffList = dataWorkingDetail?.staffDto;
    const { data: dataHistoryProcess } = useStaffStatisticHistoryProcess(
        selectedStaff ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? ""
    );


    const selectedStaffName = staffList?.find((st) => st.id === selectedStaff)?.staffName;
    // const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;
    const handleSubmit = async () => {
        try {
            const response = await fetch(`${url}/api/staff-detail/detail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groupId: selectedGroup,
                    startDate: selectedStartDate,
                    endDate: selectedEndDate,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không thể lấy dữ liệu");
            }

            const result = await response.json();
            setDataOverview(result);
            const newUrl = `?groupId=${selectedGroup}&startDate=${selectedStartDate}&endDate=${selectedEndDate}&staffId=${result.staffId}`;
            router.replace(newUrl);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    return (
        <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow">
            <div className="">
                <div className="flex justify-between items-center mr-5">
                    <p className="text-3xl font-semibold">Thống kê nhân viên vận hành</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-950 hover:bg-blue-650"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-row py-3 gap-15 border-b justify-end">
                    <DateRangeSelectorDetail
                        startDate={selectedStartDate}
                        endDate={selectedEndDate}
                        onChange={({ startDate, endDate, timeType }) => {
                            setSelectedStartDate(startDate);
                            setSelectedEndDate(endDate);
                            setSelectedTimeType(timeType);
                        }}
                    />
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 tracking-wide ">Nhóm</label>
                        <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
                            <SelectTrigger className="w-[180px] text-lg cursor-pointer">
                                <SelectValue placeholder="Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {groupList.map((m) => (
                                        <SelectItem className="text-lg text-blue-950 cursor-pointer" key={m.groupId} value={String(m.groupId)}>
                                            {m.groupName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 tracking-wide">
                            Nhân viên
                        </label>
                        <Select
                            value={selectedStaff ? String(selectedStaff) : ""}
                            onValueChange={(val) => setSelectedStaff(val ? Number(val) : 0)}
                        >
                            <SelectTrigger className="w-fit text-lg rounded-md transition cursor-pointer">
                                <SelectValue placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}>
                                    {selectedStaffName ||
                                        `Tổng số: ${staffList?.length || 0} nhân viên`}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {staffList?.map((st) => (
                                        <SelectItem
                                            key={st.id}
                                            value={String(st.id)}
                                            className={`text-lg text-blue-950 cursor-pointer ${selectedStaff === st.id ? "bg-gray-100" : ""
                                                }`}
                                        >
                                            {st.staffName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col pt-6">
                        <Button
                            onClick={handleSubmit}
                            variant="outline"
                            size="lg"
                            className="text-lg font-normal cursor-pointer text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 h-9"
                        >
                            <UserRoundSearch className="h-4 w-4 mr-1" />
                            Lọc nhóm mới
                        </Button>
                    </div>
                </div>
            </div>

            {/* Các component con */}
            {dataOverview && (
                <ReportTimeOperatorDetail type={selectedTimeType} data={dataOverview} />
            )}

            {/* Render charts chỉ khi có data */}
            {dataWorkingDetail && (
                <BarChartOperatorDetail
                    title="Thống kê công việc người vận hành"
                    description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu"
                    dataChart={dataWorkingDetail}
                />
            )}

            {dataHistoryProcess && (
                <TableOperatorDetail
                    title="Danh sách thống kê người vận hành"
                    dataHistoryProcess={dataHistoryProcess}
                />
            )}
        </div>
    );
}
"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroups } from "@/hooks/useGroup";
import { ReportTimeOperatorDetail } from "./components/ReportTimeOperatorDetail";
import { BarChartOperatorDetail } from "./components/BarChartOperatorDetail";
import TableOperatorDetail from "./components/TableOperatorDetail";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DateRangeSelectorDetail from "./components/DateRangeSelectorDetail";
import { Button } from "@/components/ui/button";
import { Download, UserRoundSearch, } from "lucide-react";

interface myStaff {
    staffFullName: string;
    staffId: string;
}

const myDataStaff: myStaff[] = [
    { staffFullName: "Nguyễn Văn Lợi", staffId: "S400" },
    { staffFullName: "Lê Văn Đức", staffId: "S700" },
    { staffFullName: "Đoàn Thi Trang", staffId: "S500" },
    { staffFullName: "Nguyễn Huy", staffId: "S650" },
    { staffFullName: "Nguyễn Thị Lan", staffId: "S550" },
];

export default function OperationDetail() {
    const searchParams = useSearchParams();

    // Lấy giá trị từ URL
    const startDateFromUrl = searchParams.get("startDate") || "";
    const endDateFromUrl = searchParams.get("endDate") || "";
    const groupIdFromUrl = searchParams.get("groupId") || "";
    const staffIdFromUrl = searchParams.get("staffId") || "";

    const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
    const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
    const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
    const [selectedStaff, setSelectedStaff] = useState<string>(staffIdFromUrl);

    // Sync từ URL
    useEffect(() => {
        setSelectedStartDate(startDateFromUrl);
        setSelectedEndDate(endDateFromUrl);
        setSelectedGroup(groupIdFromUrl);
        setSelectedStaff(staffIdFromUrl);
    }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, staffIdFromUrl]);

    const queryParams = useMemo(() => {
        if (!selectedGroup || !selectedStartDate || !selectedEndDate) return null;
        return {
            group: selectedGroup,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
        };
    }, [selectedGroup, selectedStartDate, selectedEndDate]);

    // API staff list (mock data hiện tại)
    const staffList = myDataStaff;

    const { data: groupList = [] } = useGroups();

    const selectedStaffName = staffList?.find((st) => String(st.staffId) === selectedStaff)?.staffFullName;
    const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

    return (
        <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow">
            <div className="">
                <div className="flex justify-between items-center mr-5">
                    <p className="text-3xl font-semibold">Thống kê vận hành chi tiết</p>
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
                        onChange={({ startDate, endDate }) => {
                            setSelectedStartDate(startDate);
                            setSelectedEndDate(endDate);
                        }}
                    />
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label>
                        <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
                            <SelectTrigger className="w-[180px] text-lg ">
                                <SelectValue placeholder="Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {groupList.map((m) => (
                                        <SelectItem className="text-lg text-blue-950" key={m.groupId} value={String(m.groupId)}>
                                            {m.groupName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 tracking-wide">Nhân hân viên</label>
                        <Select value={selectedStaff} onValueChange={(val) => setSelectedStaff(val)}>
                            <SelectTrigger className="w-fit text-lg rounded-md transition">
                                <SelectValue placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}>
                                    {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {staffList?.map((st) => (
                                        <SelectItem className="text-lg text-blue-950" key={st.staffId} value={String(st.staffId)}>
                                            {st.staffFullName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col pt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 h-9"
                        >
                            <UserRoundSearch className="h-4 w-4 mr-1" />
                            Lọc nhân viên
                        </Button>
                    </div>
                </div>
            </div>

            {/* Các component con */}
            <ReportTimeOperatorDetail />
            <BarChartOperatorDetail
                title="Tổng Thời Gian Thực PG Của Từng Máy Trong Nhóm (Giờ)"
                description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu"
            />
            <TableOperatorDetail title="Danh sách thống kê người vận hành" description="Danh sách người vận hành" />
        </div>
    );
}

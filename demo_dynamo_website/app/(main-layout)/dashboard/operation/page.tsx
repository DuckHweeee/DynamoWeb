"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGroups } from "@/hooks/useGroup";
import { useRouter } from "next/navigation";
import { useStaffStatistic } from "./hooks/useStaffStatistic";
import { useStaffOverview } from "./hooks/useStaffOverview";
import DateRangeSelector from "./components/DateRangeSelector";
import { ReportTimeOperator } from "./components/ReportTimeOperator";
import { DivergingBarChart } from "./components/DivergingBarChart";
import { StaffOverview } from "./lib/type";
import StaffTable from "./components/StaffTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useExportExcel } from "../../../../hooks/useExportExcel";

export default function Operation() {
  const router = useRouter();

  const [selectedStartDate, setStartDate] = useState<string>();
  const [selectedEndDate, setSelectedEndDate] = useState<string>();
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

  // Tạo queryParams để truyền vào hook useStaffStatistic
  const queryParams = useMemo(() => {
    if (!selectedGroup || !selectedStartDate || !selectedEndDate) {
      return null;
    }
    return {
      groupId: selectedGroup,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    };
  }, [selectedGroup, selectedStartDate, selectedEndDate]);

  // Gọi API lấy dữ liệu thống kê nhân viên Statistic
  const { data: dataStatistic } = useStaffStatistic(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? ""
  );

  // Gọi API lấy dữ liệu thống kê nhân viên Overview
  const { data: dataOverview } = useStaffOverview(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? ""
  );

  // console.log("Data Overview:", dataOverview);
  // Lấy danh sách nhân viên từ tất nhóm
  const staffList = dataStatistic?.staffDto;

  // Lấy danh sách nhóm
  const { data: groupList } = useGroups();

  // Lấy nhóm đầu tiên làm nhóm mặc định khi load trang
  useEffect(() => {
    if (groupList.length > 0 && !selectedGroup) {
      setSelectedGroup(String(groupList[0].groupId));
    }
  }, [groupList, selectedGroup]);

  // Lấy tên nhân viên và nhóm đã chọn để hiển thị
  // const selectedStaffName = staffList?.find(st => String(st?.staffId) === selectedStaff)?.staffName;
  const selectedGroupName = groupList?.find(
    (g) => String(g.groupId) === selectedGroup
  )?.groupName;

  // Handler chuyển đến trang chi tiết
  const handleStaffSelection = (id: string) => {
    setSelectedStaff(id);
    // Tạo URL với query params để truyền thông tin filter hiện tại
    const searchParams = new URLSearchParams();
    if (selectedStartDate) searchParams.set("startDate", selectedStartDate);
    if (selectedEndDate) searchParams.set("endDate", selectedEndDate);
    if (selectedGroup) searchParams.set("groupId", selectedGroup);
    searchParams.set("staffId", id);
    // Chuyển đến trang operatorDetail với thông tin
    router.push(
      `/dashboard/operation/operatorDetail?${searchParams.toString()}`
    );
  };

  // Chuyển đổi dữ liệu từ StaffOverview sang định dạng dữ liệu biểu đồ
  function transformData<T extends Record<string, any>>(
    staffData: T[],
    targetKey: keyof T,
    realKey: keyof T
  ) {
    return staffData.map((s) => ({
      name: s.staffFullName,
      target: s[targetKey] as number,
      real: s[realKey] as number,
    }));
  }
  const chartConfigs = [
    {
      title: (groupName: string) => `Tổng giờ PG trong ${groupName}`,
      description: "Thống kê tổng giờ PG của nhân viên",
      targetKey: "pgTimeGoal",
      realKey: "pgTime",
    },
    {
      title: (groupName: string) => `Tổng giờ máy trong ${groupName}`,
      description: "Tổng giờ máy của từng nhân viên",
      targetKey: "machineTimeGoal",
      realKey: "machineTime",
    },
    {
      title: (groupName: string) => `Tổng giờ OLE trong ${groupName}`,
      description: "OLE của từng nhân viên",
      targetKey: "oleGoal",
      realKey: "ole",
    },
    {
      title: (groupName: string) => `Tổng KPI trong ${groupName}`,
      description: "KPI của từng nhân viên",
      targetKey: "kpiGoal",
      realKey: "kpi",
    },
  ];

  // Optimize groupList and selectedGroupName calculations
  const memoizedGroupList = useMemo(() => groupList || [], [groupList]);
  const memoizedSelectedGroupName = useMemo(
    () =>
      memoizedGroupList.find((g) => String(g.groupId) === selectedGroup)
        ?.groupName,
    [memoizedGroupList, selectedGroup]
  );

  // Optimize staffList calculation
  const memoizedStaffList = useMemo(() => dataStatistic?.staffDto || [], [
    dataStatistic,
  ]);

  // Optimize chart data transformation
  const memoizedChartData = useMemo(
    () =>
      chartConfigs.map((cfg) => ({
        title: cfg.title(memoizedSelectedGroupName ?? ""),
        description: cfg.description,
        data: transformData(
          dataOverview,
          cfg.targetKey as keyof StaffOverview,
          cfg.realKey as keyof StaffOverview
        ),
      })),
    [dataOverview, memoizedSelectedGroupName]
  );

  // const { exportExcel, loading, error } = useExportExcel(selectedGroup, selectedStartDate, selectedEndDate);

  return (
    <>
      <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow">
        <div>
          <div className="flex justify-between items-center mr-5">
            <p className="text-3xl font-semibold">Thống kê vận hành</p>
            <Button
              variant="outline"
              size="sm"
              className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-900 hover:bg-blue-650"
            // onClick={exportExcel}
            >
              Xuất file
              {/* <Download className="h-4 w-4" /> */}
            </Button>
          </div>
          <div className="flex flex-row py-3 gap-15 justify-end">
            <DateRangeSelector
              onChange={({ startDate, endDate, timeType }) => {
                setStartDate(startDate);
                setSelectedEndDate(endDate);
                setSelectedTimeType(timeType);
              }}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 tracking-wide">
                Nhóm
              </label>
              <Select
                value={selectedGroup ?? ""}
                onValueChange={(val) => setSelectedGroup(val)}
              >
                <SelectTrigger className="w-[180px] text-lg cursor-pointer">
                  <SelectValue placeholder="Nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {groupList.map((m) => (
                      <SelectItem
                        key={m.groupId}
                        value={String(m.groupId)}
                        className={`text-lg text-blue-950 cursor-pointer ${String(selectedGroup) === String(m.groupId)
                          ? "bg-gray-100"
                          : ""
                          }`}
                      >
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
                value={selectedStaff}
                onValueChange={handleStaffSelection}
              >
                <SelectTrigger className="w-fit text-lg px-4 rounded-md  transition cursor-pointer">
                  <SelectValue
                    placeholder={`Tổng số: ${staffList?.length || 0} nhân viên`}
                  >
                    {/* {selectedStaffName || `Tổng số: ${staffList?.length || 0} nhân viên`} */}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {staffList?.map((st) => (
                      <SelectItem
                        className="text-xl text-blue-950 cursor-pointer"
                        key={st.staffName}
                        value={String(st.id)}
                      >
                        {st.staffName}
                      </SelectItem>
                    )) || []}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {dataStatistic && (
          <ReportTimeOperator type={selectedTimeType} data={dataStatistic} />
        )}

        <DivergingBarChart
          title={`Tổng điểm gia công trong ${selectedGroupName}`}
          description="Thống kê tổng điểm của từng nhân viên"
          data={transformData(
            dataOverview,
            "manufacturingPointGoal",
            "totalManufacturingPoint"
          )}
        />
        <div className="grid grid-cols-2 gap-4 my-5">
          {chartConfigs.map((cfg, idx) => (
            <DivergingBarChart
              key={idx}
              title={cfg.title(selectedGroupName ?? "")}
              description={cfg.description}
              data={transformData(
                dataOverview,
                cfg.targetKey as keyof StaffOverview,
                cfg.realKey as keyof StaffOverview
              )}
            />
          ))}
        </div>
        <StaffTable
          title="Danh sách thống kê người vận hành"
          description="Danh sách người vận hành"
          staffList={dataOverview}
        />
      </div>
    </>
  );
}

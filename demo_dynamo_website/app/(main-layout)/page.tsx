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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStaffStatistic } from "./dashboard/operation/hooks/useStaffStatistic";
import { useStaffOverview } from "./dashboard/operation/hooks/useStaffOverview";
import { DivergingBarChart } from "./dashboard/operation/components/DivergingBarChart";
import DateRangeSelector from "./dashboard/components/DateRangeSelector";
import { ReportTimeOperator } from "./dashboard/operation/components/ReportTimeOperator";
import StaffTable from "./dashboard/operation/components/StaffTable";
import { StaffOverview } from "./dashboard/operation/lib/type";


export default function Operation() {
  const router = useRouter();

  const [selectedStartDate, setStartDate] = useState<string>();
  const [selectedEndDate, setSelectedEndDate] = useState<string>();
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedTimeType, setSelectedTimeType] = useState<string>("day");
  const [selectedShiftType, setSelectedShiftType] = useState<string>("FULL");

  const [selectedChartType, setSelectedChartType] =
    useState<string>("manufacturingPoint");

  const queryParams = useMemo(() => {
    if (!selectedGroup || !selectedStartDate || !selectedEndDate) return null;
    return {
      groupId: selectedGroup,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      shiftCode: selectedShiftType,
    };
  }, [selectedGroup, selectedStartDate, selectedEndDate, selectedShiftType]);

  const { data: dataStatistic } = useStaffStatistic(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? "",
    queryParams?.shiftCode ?? ""
  );

  const { data: dataOverview } = useStaffOverview(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? "",
    queryParams?.shiftCode ?? ""
  );

  const staffList = dataStatistic?.staffDto ?? [];
  const { data: groupList } = useGroups();

  useEffect(() => {
    if (groupList.length > 0 && !selectedGroup) {
      setSelectedGroup(String(groupList[0].groupId));
    }
  }, [groupList, selectedGroup]);

  const selectedGroupName = groupList?.find(
    (g) => String(g.groupId) === selectedGroup
  )?.groupName;

  const handleStaffSelection = (id: string) => {
    setSelectedStaff(id);
    const searchParams = new URLSearchParams();
    if (selectedStartDate) searchParams.set("startDate", selectedStartDate);
    if (selectedEndDate) searchParams.set("endDate", selectedEndDate);
    if (selectedGroup) searchParams.set("groupId", selectedGroup);
    searchParams.set("staffId", id);
    router.push(`/dashboard/operation/operatorDetail?${searchParams.toString()}`);
  };

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
      key: "manufacturingPoint",
      label: "Tổng điểm gia công",
      title: (groupName: string) => `Tổng điểm gia công trong ${groupName}`,
      description: "Thống kê tổng điểm của từng nhân viên",
      targetKey: "manufacturingPointGoal",
      realKey: "totalManufacturingPoint",
    },
    {
      key: "pgTime",
      label: "Giờ PG",
      title: (groupName: string) => `Tổng giờ PG trong ${groupName}`,
      description: "Thống kê tổng giờ PG của nhân viên",
      targetKey: "pgTimeGoal",
      realKey: "pgTime",
    },
    {
      key: "machineTime",
      label: "Giờ máy",
      title: (groupName: string) => `Tổng giờ máy trong ${groupName}`,
      description: "Tổng giờ máy của từng nhân viên",
      targetKey: "machineTimeGoal",
      realKey: "machineTime",
    },
    {
      key: "ole",
      label: "OLE",
      title: (groupName: string) => `Tổng OLE trong ${groupName}`,
      description: "OLE của từng nhân viên",
      targetKey: "oleGoal",
      realKey: "ole",
    },
    {
      key: "kpi",
      label: "KPI",
      title: (groupName: string) => `Tổng KPI trong ${groupName}`,
      description: "KPI của từng nhân viên",
      targetKey: "kpiGoal",
      realKey: "kpi",
    },
  ];

  const selectedChartConfig = chartConfigs.find(
    (c) => c.key === selectedChartType
  );

  return (
    <div className="m-2 px-4 py-5 rounded-[20px] bg-white/10 backdrop-blur border border-white/20 shadow-xl shadow-md ">
      <div className="flex gap-3 justify-between py-3 pb-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-700 
                bg-[length:100%_2px] bg-no-repeat bg-left-bottom pb-6">
        <div className="flex gap-3">
          <DateRangeSelector
            onChange={({ startDate, endDate, timeType, shiftCode }) => {
              setStartDate(startDate);
              setSelectedEndDate(endDate);
              setSelectedTimeType(timeType);
              setSelectedShiftType(shiftCode);
            }}
          />
          <Select
            value={selectedGroup ?? ""}
            onValueChange={(val) => setSelectedGroup(val)}
          >
            <SelectTrigger className="w-[175px] text-base cursor-pointer p-5 bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow text-white">
              <SelectValue placeholder="Nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {groupList.map((m) => (
                  <SelectItem key={m.groupId} value={String(m.groupId)}>
                    {m.groupName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedStaff} onValueChange={handleStaffSelection}>
            <SelectTrigger className="w-auto text-base cursor-pointer p-5 bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow text-white [&_span]:!text-white ">
              <SelectValue placeholder={`Tổng số: ${staffList.length} NV`}
                className="!text-white" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {staffList.map((st) => (
                  <SelectItem key={st.id} value={String(st.id)}>
                    {st.staffName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          {/* <Button
            variant="outline"
            size="lg"
            className="items-center cursor-pointer 
             px-6 text-base transition-all bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow text-white" >
            Xuất file
          </Button> */}
        </div>
      </div>

      {dataStatistic && (
        <ReportTimeOperator type={selectedTimeType} data={dataStatistic} />
      )}
      <div className="grid grid-cols-5 gap-6 ">
        <div className="col-span-2">
          {selectedChartConfig && (
            <Card className="w-full shadow-md my-3 bg-white/20 backdrop-blur-lg border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <p className="text-base font-bold text-white">
                    {selectedChartConfig.title(selectedGroupName ?? "")}
                  </p>
                  <p className="text-sm text-white">
                    {selectedChartConfig.description}
                  </p>
                </div>

                {/* 🔽 Select box nằm trong header của chart */}
                <Select
                  value={selectedChartType}
                  onValueChange={(val) => setSelectedChartType(val)}
                >
                  <SelectTrigger className="w-[220px] text-white ">
                    <SelectValue placeholder="Chọn loại thống kê" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {chartConfigs.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardHeader>

              <CardContent>
                <DivergingBarChart
                  title=""
                  description=""
                  data={transformData(
                    dataOverview ?? [],
                    selectedChartConfig.targetKey as keyof StaffOverview,
                    selectedChartConfig.realKey as keyof StaffOverview
                  )}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <div className="col-span-3">

          <StaffTable
            title="Danh sách thống kê người vận hành"
            description="Danh sách người vận hành"
            staffList={dataOverview}
          />

        </div>
      </div>
    </div>
  );
}


"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import OperatorStatus from "./components/OperatorStatus"
import { useEffect, useState } from "react"
import { useGroups } from "@/hooks/useGroup"
import { useOperatorStatus } from "./hook/useOperatorStatus"

const mockMachines = [
    { name: "Nguyen Van A", operator: "Nguyen Van A", code: "1123", machine: "Machine 1", status: "Đang Chạy", pg: 180 },
    { name: "Nguyen Van A", operator: "Nguyen Van A", code: "1123", machine: "Machine 1", status: "Dừng", pg: 180 },
    { name: "Nguyen Van A", operator: "Nguyen Van A", code: "1123", machine: "Machine 1", status: "Lỗi", pg: 180 },
    { name: "Nguyen Van A", operator: "Nguyen Van A", code: "1123", machine: "Machine 1", status: "Tắt", pg: 180 },
    { name: "Nguyen Van A", operator: "Nguyen Van A", code: "1123", machine: "Machine 1", status: "Đang Chạy", pg: 180 },
    { name: "Nguyen Van A", operator: "Nguyen Van A", code: "1123", machine: "Machine 1", status: "Đang Chạy", pg: 180 },
    { name: "Machine 2", operator: "Nguyen Van A", code: "1154", machine: "", status: "Dừng", pg: 180 },
    { name: "Machine 3", operator: "Nguyen Van A", code: "1176", machine: "", status: "Lỗi", pg: 360 },
    { name: "Machine 4", operator: "Nguyen Van A", code: "1134", machine: "", status: "Tắt", pg: 180 },
    // ...thêm máy tùy ý
]

export default function DashboardPage() {
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const { data: groupList } = useGroups()
    useEffect(() => {
        if (groupList && groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId));
        }
    }, [groupList, selectedGroup]);
    const { data: operatorStatusList } = useOperatorStatus(selectedGroup ?? "")
    console.log("operatorStatusList", operatorStatusList)
    return (
        <div className="m-2 px-4 py-3 bg-white rounded-[10px] shadow">
            {/* <MachineSummary />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {mockMachines.map((m, i) => (
                    <MachineCard key={i} {...m} />
                ))}
            </div> */}
            <div className="flex flex-row items-center justify-between py-4">
                <div className="w-2/3">
                    <p className="text-2xl font-bold">Hiện Trạng Người Vận hành</p>
                </div>
                <div className="w-1/3 flex items-center justify-end gap-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label>
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
                                                ? "bg-gray-200"
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
                </div>
            </div>
            {operatorStatusList && (
                <OperatorStatus dataOperatorStatus={operatorStatusList} />
            )}
        </div>
    )
}
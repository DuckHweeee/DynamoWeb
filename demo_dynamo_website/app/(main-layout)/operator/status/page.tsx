"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import OperatorStatus from "./components/OperatorStatus"
import { useEffect, useState } from "react"
import { useGroups } from "@/hooks/useGroup"
import { useOperatorStatus } from "./hook/useOperatorStatus"

export default function DashboardPage() {
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const { data: groupList } = useGroups()
    useEffect(() => {
        if (groupList && groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId));
        }
    }, [groupList, selectedGroup]);
    const { data: operatorStatusList } = useOperatorStatus(selectedGroup ?? "")
    return (
        <div className="m-2 px-4 py-3 bg-white rounded-[10px] shadow">
            <div className="flex flex-row items-center justify-between py-4 border-b border-red-300 mb-4">
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
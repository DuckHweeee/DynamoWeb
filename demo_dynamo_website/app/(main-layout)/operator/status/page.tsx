"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import OperatorStatus from "./components/OperatorStatus"
import { useEffect, useState } from "react"
import { useGroups } from "@/hooks/useGroup"
import { useOperatorStatus } from "./hook/useOperatorStatus"
import { useOperatorStatusWS } from "./hook/useOperatorStatusWS"

export default function DashboardPage() {
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const { data: groupList } = useGroups()
    useEffect(() => {
        if (groupList && groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId));
        }
    }, [groupList, selectedGroup]);
    const { data: operatorStatusListApi } = useOperatorStatus(selectedGroup ?? "");
    const wsDataByGroup = useOperatorStatusWS();
    const operatorStatusList =
        wsDataByGroup[selectedGroup ?? ""] ??
        operatorStatusListApi ??
        [];
    return (
        <div className="m-2 px-4 py-3 bg-white/10 backdrop-blur
            border border-white/20
            shadow-xl">
            <div className="flex flex-row items-center justify-between border-b pb-4 border-red-300 mb-6">
                <div className="w-2/3">
                </div>
                <div className="w-1/3 flex items-center justify-end gap-5">
                    <div className="space-y-1">
                        <Select
                            value={selectedGroup ?? ""}
                            onValueChange={(val) => setSelectedGroup(val)}
                        >
                            <SelectTrigger className="w-[175px] text-base cursor-pointer p-5  text-white bg-white/10 backdrop-blur border border-white/20 shadow-xl ">
                                <SelectValue placeholder="Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {groupList.map((m) => (
                                        <SelectItem
                                            key={m.groupId}
                                            value={String(m.groupId)} 
                                            className={`text-lg text-blue-950 cursor-pointer ${String(selectedGroup) === String(m.groupId)
                                                ? "bg-white/10 backdrop-blur border border-white/20 shadow-xl"
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
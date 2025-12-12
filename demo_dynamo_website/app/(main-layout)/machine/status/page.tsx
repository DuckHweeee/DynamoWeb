"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import MachineStatus from "./components/MachineStatus"
import { useGroups } from "@/hooks/useGroup"
import { useEffect, useState } from "react"
import { useMachineStatus } from "./hook/useMachineStatus"

export default function StatusMachine() {
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const { data: groupList } = useGroups()

    useEffect(() => {
        if (groupList && groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId));
        }
    }, [groupList, selectedGroup]);

    const { data: machineStatusList } = useMachineStatus(selectedGroup ?? "")


    return (
        <div className="m-2 px-4 py-3 bg-white rounded-[10px] shadow">
            <div className="flex flex-row items-center justify-between py-4 border-b border-blue-300">
                <div className="w-2/3">
                    <p className="text-2xl font-bold">Hiện Trạng Máy</p>
                </div>
                <div className="w-1/3 flex items-center justify-end gap-5">
                    {/* <Input
                        placeholder="Tìm kiếm"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm !text-[20px]"
                    /> */}
                    {/* <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Tìm kiếm"
                            // value={globalFilter}
                            // onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10"
                        />
                    </div> */}
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
            <MachineStatus dataMachineStatus={machineStatusList} />
        </div>
    )
}
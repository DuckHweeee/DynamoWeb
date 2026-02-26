"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import OrderDetailStatus from "./components/OrderDetailStatus"
import { useGroups } from "@/hooks/useGroup"
import { useEffect, useState } from "react"
import OrderList from "./components/OrderList"
import { useOrderDetailStatus } from "./hooks/useOrderDetailStatus"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"


//import { useMachineStatus } from "./hook/useMachineStatus"

export default function StatusMachine() {
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const { data: groupList } = useGroups()
    const [keyword, setKeyword] = useState("");

    // const { data: listOrderData } = useOrderDetailStatus()
    const {
        data,
        page,
        totalPages,
        nextPage,
        prevPage,
        loading,
        search
    } = useOrderDetailStatus(12);

    useEffect(() => {
        if (groupList && groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId));
        }
    }, [groupList, selectedGroup]);

    // const { data: machineStatusList } = useMachineStatus(selectedGroup ?? "")


    return (
        <div className="m-2 px-4 py-3  bg-white/10 backdrop-blur
            border border-white/20
            shadow-xl rounded-[10px] shadow ">
            <div className="flex flex-row items-center justify-between py-4 ">
                <div className="w-2/3">
                    {/* <p className="text-2xl font-bold pb-4 pl-2">Hiện Trạng Mã Hàng</p> */}
                </div>
                <div className="w-1/3 flex items-center justify-end gap-2">
                    {/* <Input
                        placeholder="Tìm kiếm"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm !text-[20px]"
                    /> */}
                    <div className="relative max-w-sm w-full items-center flex justify-center">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Tìm kiếm"
                            value={keyword}
                            onChange={(e) => {
                                const value = e.target.value;
                                setKeyword(value);
                                search(value); // 🔥 DÒNG QUYẾT ĐỊNH
                            }}
                            className="pl-10 py-5"
                        />
                    </div>
                    <div className="space-y-1">
                        {/* <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label> */}
                        <Select
                            value={selectedGroup ?? ""}
                            onValueChange={(val) => setSelectedGroup(val)}
                        >
                            <SelectTrigger className="w-[180px] text-lg text-white cursor-pointer py-5.5 bg-white/10 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow ">
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
            <OrderList data={data} />
            <div className="flex justify-center items-center gap-4 mt-6">
                <Button onClick={prevPage} disabled={page === 0} className="bg-white/10 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow">
                    Trước
                </Button>

                <span className="text-white">
                    Trang {page + 1} / {totalPages}
                </span>

                <Button onClick={nextPage} disabled={page + 1 >= totalPages} className="bg-white/10 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow">
                    Sau
                </Button>
            </div>
        </div>
    )
}
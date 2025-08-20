"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { Machine2 } from "@/lib/type"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectYear } from "./SelectYear"
import { SelectMonth } from "./SelectMonth"
import { useGroup } from "../hooks/useMachine"

type AddMachineFormProps = {
    onAdd: (machine: Machine2) => void
    onCancel: () => void
}
interface NewMachine {
    machineName: string,
    machineType: string,
    machineGroup: string,
    machineOffice: string,
    year: number | null,
    month: number | null,
    groupId: string,
    machineMiningTarget: number | null,
    oee: number | null

}
export default function AddMachineForm({ onAdd, onCancel }: AddMachineFormProps) {
    const { data: group, loading, error } = useGroup("machine")
    const [newMachine, setNewMachine] = useState<NewMachine>({
        machineName: "",
        machineType: "",
        machineGroup: "",
        machineOffice: "",
        year: null,
        month: null,
        groupId: "",
        machineMiningTarget: null,
        oee: null
    })

    // const handleSubmit = () => {
    //     if (!newMachine.id || !newMachine.name || !newMachine.ma_may) {
    //         toast.error("Vui lòng nhập đầy đủ thông tin.")
    //         return
    //     }

    //     onAdd(newMachine)

    //     // Reset form
    //     setNewMachine({
    //         id: "",
    //         name: "",
    //         loai_may: "",
    //         ma_may: "",
    //     })
    // }

    return (
        <div className="grid gap-3 w-full h-full">
            {/* <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="id">STT</Label>
                    <Input
                        id="id"
                        placeholder="STT"
                    // value={newMachine.id}
                    // onChange={(e) => setNewMachine({ ...newMachine, id: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Tên máy</Label>
                    <Input
                        id="name"
                        placeholder="Tên máy"
                    // value={newMachine.name}
                    // onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="loai_may">Loại máy</Label>
                    <Input
                        id="loai_may"
                        placeholder="Loại máy"
                    // value={newMachine.loai_may}
                    // onChange={(e) => setNewMachine({ ...newMachine, loai_may: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="ma_may">Mã máy</Label>
                    <Input
                        id="ma_may"
                        placeholder="Mã máy"
                    // value={newMachine.ma_may}
                    // onChange={(e) => setNewMachine({ ...newMachine, ma_may: e.target.value })}
                    />
                </div>
            </div> */}

            <div className="grid gap-7">
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin máy</div>
                    <div className="grid gap-4 grid-cols-2">
                        <div className="grid">
                            <Label htmlFor="name" className="text-lg !font-normal">Tên máy</Label>
                            <Input
                                id="name"
                                placeholder="Tên máy"
                                value={newMachine.machineName}
                                onChange={(e) => setNewMachine({ ...newMachine, machineName: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="cong_viec" className="text-lg !font-normal">Phòng quản lý</Label>
                            {/* <Input
                                id="cong_viec"
                                placeholder="Phòng quản lý"
                                value={newMachine.machineOffice}
                                onChange={(e) => setNewMachine({ ...newMachine, machineOffice: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            /> */}
                            <Select
                                value={newMachine.groupId?.toString() ?? ""}
                                onValueChange={(value) => setNewMachine({ ...newMachine, groupId: value })}
                            >
                                <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent id="nhom">
                                    <SelectGroup>
                                        {group.map((g) => (
                                            <SelectItem className="text-lg" key={g.groupId} value={g.groupId.toString()}>
                                                {g.groupName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid">
                            <Label htmlFor="shortName" className="text-lg !font-normal">Loại máy</Label>
                            <Input
                                id="shortName"
                                placeholder="Loại máy"
                                value={newMachine.machineType}
                                onChange={(e) => setNewMachine({ ...newMachine, machineType: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="phong_ban" className="text-lg !font-normal">Nhóm máy</Label>
                            <Input
                                id="phong_ban"
                                placeholder="Nhóm máy"
                                value={newMachine.machineGroup}
                                onChange={(e) => setNewMachine({ ...newMachine, machineGroup: e.target.value })}
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                    </div>
                </div>

                {/* Mục tiêu nhân viên */}
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu</div>
                    <div className="grid gap-4 grid-cols-3 pb-3">
                        <div className="grid">
                            <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                            <Select
                                value={newMachine.groupId?.toString() ?? ""}
                                onValueChange={(value) => setNewMachine({ ...newMachine, groupId: value })}
                            >
                                <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent id="nhom">
                                    <SelectGroup>
                                        {group.map((g) => (
                                            <SelectItem className="text-lg" key={g.groupId} value={g.groupId.toString()}>
                                                {g.groupName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid">
                            <Label htmlFor="year" className="text-lg !font-normal">Năm</Label>
                            <SelectYear
                                value={newMachine.year?.toString() ?? undefined}
                                onChange={(value) =>
                                    setNewMachine({ ...newMachine, year: Number(value) })
                                }
                                totalYears={5}
                                placeholder="Chọn năm"
                            />
                        </div>
                        <div className="grid">
                            <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                            <SelectMonth
                                value={newMachine.month?.toString() ?? undefined}
                                onChange={(value) =>
                                    setNewMachine({ ...newMachine, month: Number(value) })
                                }
                            // showAllOption={true}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                        <div className="grid">
                            <Label htmlFor="kpi" className="text-lg !font-normal">Mục tiêu khai thác máy</Label>
                            <Input
                                id="kpi"
                                placeholder="Mục tiêu khai thác máy"
                                type="number"
                                inputMode="numeric"
                                value={newMachine.machineMiningTarget !== null ? newMachine.machineMiningTarget.toString() : ""}
                                onChange={(e) =>
                                    setNewMachine({
                                        ...newMachine,
                                        machineMiningTarget: e.target.value === "" ? null : Number(e.target.value),
                                    })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="workGoal" className="text-lg !font-normal">OEE</Label>
                            <Input
                                id="kpi"
                                placeholder="OEE"
                                type="number"
                                inputMode="numeric"
                                value={newMachine.oee !== null ? newMachine.oee.toString() : ""}
                                onChange={(e) =>
                                    setNewMachine({
                                        ...newMachine,
                                        machineMiningTarget: e.target.value === "" ? null : Number(e.target.value),
                                    })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-2 justify-end">
                <Button
                    // onClick={handleSubmit} 
                    className="bg-[#074695] hover:bg-[#0754B4]">
                    Lưu
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { SelectYear } from "../../components/SelectYear"
import { SelectMonth } from "../../components/SelectMonth"
import { FlexibleCombobox } from "./FlexibleCombobox"
import { useGroup, useMachine } from "../../../../../hooks/useMachine"
import { KPI } from "../../lib/type"
const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type AddKPIMachineFormProps = {
    onAdd: (staff: KPI) => void
    onCancel: () => void
}
interface NewKPIMachine {
    year: number | null,
    month: number | null,
    oee: number | null,
    machineMiningTarget: number | null,
    machineId: number | null,
    groupId: string
}

export default function AddNewKPI({ onAdd, onCancel }: AddKPIMachineFormProps) {
    const [newKPIMachine, setNewKPIMachine] = useState<NewKPIMachine>({
        year: null,
        month: null,
        oee: null,
        machineMiningTarget: null,
        machineId: null,
        groupId: ""
    })
    const handleSubmit = async () => {
        if (
            !newKPIMachine.year ||
            !newKPIMachine.month ||
            !newKPIMachine.oee ||
            !newKPIMachine.machineMiningTarget ||
            !newKPIMachine.machineId ||
            !newKPIMachine.groupId
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        try {
            console.log("newKPIStaff")
            console.log(newKPIMachine)
            alert("ahihi")
            const response = await fetch(
                `${urlLink}/api/machine-kpi`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        year: newKPIMachine.year,
                        month: newKPIMachine.month,
                        oee: newKPIMachine.oee,
                        machineMiningTarget: newKPIMachine.machineMiningTarget,
                        machineId: newKPIMachine.machineId,
                        machineStatus: 0,
                        groupId: newKPIMachine.groupId,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại.");
            }
            toast.success("Thêm KPI thành công!");
            location.reload()
            onCancel();
            setNewKPIMachine({
                year: null,
                month: null,
                oee: null,
                machineMiningTarget: null,
                machineId: null,
                groupId: "",
            });
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    const { data: group } = useGroup()
    const { data: machine } = useMachine()

    return (
        <div className="grid gap-3 w-full">
            {/* <div className="grid gap-8"> */}
            <div className="grid gap-2 px-3 relative rounded-sm border-2 pt-5 pb-6 ">
                <div className="text-2xl pb-1 font-medium !top-[-20] absolute bg-white px-1 ml-2">Thông tin mục tiêu</div>
                <div className="grid gap-4 grid-cols-2">
                    <div className="grid">
                        <Label htmlFor="staffId" className="text-lg !font-normal">Tên Máy</Label>
                        <FlexibleCombobox
                            options={machine || []}
                            value={newKPIMachine.machineId ? String(newKPIMachine.machineId) : ""}
                            onChange={(val) => setNewKPIMachine({ ...newKPIMachine, machineId: Number(val) })}
                            displayField="machineName"
                            valueField="machineId"
                            placeholder="Chọn máy"
                            allowCustom={false}
                        />
                    </div>

                    <div className="grid">
                        <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                        <Select
                            value={newKPIMachine.groupId?.toString() ?? ""}
                            onValueChange={(value) => setNewKPIMachine({ ...newKPIMachine, groupId: value })}
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
                </div>
                <div className="grid gap-4 grid-cols-2 pb-3">
                    <div className="grid">
                        <Label htmlFor="year" className="text-lg !font-normal">Năm</Label>
                        <SelectYear
                            value={newKPIMachine.year?.toString() ?? undefined}
                            onChange={(value) =>
                                setNewKPIMachine({ ...newKPIMachine, year: Number(value) })
                            }
                            totalYears={5}
                            placeholder="Chọn năm"
                        />
                    </div>
                    <div className="grid">
                        <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                        <SelectMonth
                            value={newKPIMachine.month?.toString() ?? undefined}
                            onChange={(value) =>
                                setNewKPIMachine({ ...newKPIMachine, month: Number(value) })
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
                            value={newKPIMachine.machineMiningTarget !== null ? newKPIMachine.machineMiningTarget.toString() : ""}
                            onChange={(e) =>
                                setNewKPIMachine({
                                    ...newKPIMachine,
                                    machineMiningTarget: e.target.value === "" ? null : Number(e.target.value),
                                })
                            }
                            className="!text-lg placeholder:text-[16px]"
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="workGoal" className="text-lg !font-normal">OEE</Label>
                        <Input
                            className="!text-lg placeholder:text-[16px]"
                            id="workGoal"
                            placeholder="Mục tiêu làm việc"
                            type="number"
                            inputMode="numeric"
                            value={newKPIMachine.oee !== null ? newKPIMachine.oee.toString() : ""}
                            onChange={(e) =>
                                setNewKPIMachine({ ...newKPIMachine, oee: Number(e.target.value) })
                            }
                        />
                    </div>
                </div>
            </div>
            {/* </div> */}
            <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={onCancel} className="text-xl py-6 px-10 cursor-pointer">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} className="text-xl bg-[#074695] hover:bg-[#0754B4] py-6 px-10 cursor-pointer">
                    Lưu
                </Button>

            </div>
        </div>
    )
}






"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Staff } from "@/lib/type"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

type AddStaffFormProps = {
    onAdd: (staff: Staff) => void
    onCancel: () => void
}

export default function AddOperatorForm({ onAdd, onCancel }: AddStaffFormProps) {
    const [newStaff, setNewStaff] = useState<Staff>({
        id: "",
        staffId: null,
        staffName: "",
        staffOffice: "",
        groupName: "",
        staffSection: "",
        shortName: "",
        status: 1,
        groupId: "",
    })


    const handleSubmit = () => {
        if (!newStaff.id || !newStaff.id || !newStaff.staffName) {
            toast.error("Vui lòng chọn đầy đủ thông tin.");
            return
        }
        onAdd(newStaff)
        setNewStaff({
            id: "",
            staffId: null,
            staffName: "",
            staffOffice: "",
            groupName: "",
            staffSection: "",
            shortName: "",
            status: 1,
            groupId: "",
        })
    }

    return (
        <div className=" w-full">
            <div>
                <div className="text-2xl">Thông tin nhân viên</div>
                <div className="grid gap-4 grid-cols-2">
                    <div className="grid gap-1">
                        <Label htmlFor="id" className="text-xl">Mã nhân viên</Label>
                        <Input
                            id="id"
                            placeholder="Mã nhân viên"
                            value={newStaff.id}
                            onChange={(e) => setNewStaff({ ...newStaff, id: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="name" className="text-xl">Tên nhân viên</Label>
                        <Input
                            id="name"
                            placeholder="Tên nhân viên"
                            value={newStaff.staffName}
                            onChange={(e) => setNewStaff({ ...newStaff, staffName: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="phong_ban" className="text-xl">Phòng ban</Label>
                        <Input
                            id="phong_ban"
                            placeholder="Phòng ban"
                            value={newStaff.staffOffice}
                            onChange={(e) => setNewStaff({ ...newStaff, staffOffice: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="nhom" className="text-xl">Nhóm</Label>
                        <Input
                            id="nhom"
                            placeholder="Nhóm"
                            value={newStaff.groupName}
                            onChange={(e) => setNewStaff({ ...newStaff, groupName: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="cong_viec" className="text-xl">Công việc</Label>
                        <Input
                            id="cong_viec"
                            placeholder="Công Việc"
                            value={newStaff.staffSection}
                            onChange={(e) => setNewStaff({ ...newStaff, staffSection: e.target.value })}
                        />
                    </div>
                </div>
            </div>



            <div className="flex gap-4 pt-2 justify-end">
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button onClick={handleSubmit} className="bg-[#074695] hover:bg-[#0754B4]">
                    Lưu
                </Button>

            </div>
        </div>
    )
}

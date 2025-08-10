"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { StaffWithKPI, StaffKPI, Staff } from "@/lib/type"
import { useStaffWithKPI } from "../hook/useStaffWithKPI"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGroup } from "../hook/useStaff"
import { toast } from "sonner"

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;
type EditStaffFormProps = {
    onUpdate: (updated: StaffWithKPI) => void
    onCancel: () => void
    idStaffString: string
}
export default function EditStaffForm({
    onUpdate,
    onCancel,
    idStaffString,
}: EditStaffFormProps) {
    // Lấy các group hiện có
    const { data: group, loading, error } = useGroup("staff")

    // Staff With KPI
    const { data: staffWithKPI } = useStaffWithKPI()
    const [staff, setStaff] = useState<StaffWithKPI>()

    const [updateStaff, setUpdateStaff] = useState<Staff>({
        id: "",
        staffId: null,
        staffName: "",
        staffOffice: "",
        groupName: "",
        staffSection: "",
        shortName: "",
        status: null,
        groupId: "",
    })
    const [updateStaffKPI, setUpdateStaffKPI] = useState<StaffKPI>({
        year: null,
        month: null,
        pgTimeGoal: null,
        machineTimeGoal: null,
        manufacturingPoint: null,
        oleGoal: null,
        workGoal: null,
        kpi: null,
    })

    // Lấy KPI đầu tiên
    const kpi = staff?.staffKpiDtos?.[0]

    useEffect(() => {
        if (!staffWithKPI || idStaffString === undefined) return
        const matchedStaff = staffWithKPI.find(s => s.id === idStaffString)
        setStaff(matchedStaff)

        if (matchedStaff) {
            const { staffId, staffName, staffOffice, groupName, staffSection, shortName, status, groupId } = matchedStaff
            setUpdateStaff({ id: matchedStaff.id, staffId, staffName, staffOffice, groupName, staffSection, shortName, status, groupId })

            if (matchedStaff.staffKpiDtos && matchedStaff.staffKpiDtos.length > 0) {
                setUpdateStaffKPI({ ...matchedStaff.staffKpiDtos[0] })
            }
        }
    }, [staffWithKPI, idStaffString])

    console.log("staffWithKPI")
    console.log(staffWithKPI)
    console.log("updateStaffKPI")
    console.log(updateStaffKPI)
    console.log("staff")
    console.log(staff)
    console.log("staffID")
    console.log(staff?.id)


    const handleUpdate = async () => {
        // Kiểm tra thông tin bắt buộc của Staff
        if (
            !updateStaff.staffId ||
            !updateStaff.staffName.trim() ||
            !updateStaff.staffOffice.trim() ||
            !updateStaff.groupId ||
            !updateStaff.staffSection.trim()
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin nhân viên.");
            return;
        }

        // Kiểm tra thông tin bắt buộc của StaffKPI
        if (
            updateStaffKPI.pgTimeGoal === null ||
            updateStaffKPI.machineTimeGoal === null ||
            updateStaffKPI.manufacturingPoint === null ||
            updateStaffKPI.oleGoal === null ||
            updateStaffKPI.workGoal === null ||
            updateStaffKPI.kpi === null
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin mục tiêu nhân viên.");
            return;
        }

        try {
            const response = await fetch(
                `${urlLink}/api/staff/${staff?.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: staff?.id,
                        staffId: updateStaff.staffId,
                        staffName: updateStaff.staffName,
                        shortName: updateStaff.shortName,
                        staffOffice: updateStaff.staffOffice,
                        staffSection: updateStaff.staffSection,
                        groupId: updateStaff.groupId,

                        year: updateStaffKPI.year,
                        month: updateStaffKPI.month,
                        pgTimeGoal: updateStaffKPI.pgTimeGoal,
                        machineTimeGoal: updateStaffKPI.machineTimeGoal,
                        manufacturingPoint: updateStaffKPI.manufacturingPoint,
                        oleGoal: updateStaffKPI.oleGoal,
                        workGoal: updateStaffKPI.workGoal,
                        kpi: updateStaffKPI.kpi,
                        // staffId: staff?.id,
                        kpiId: updateStaffKPI.kpiId
                    }),
                }
            );
            // const response2 = await fetch(
            //     `${urlLink}/api/staff-kpi/${staff?.id}`,
            //     {
            //         method: "PUT",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify({
            //             year: updateStaffKPI.year,
            //             month: updateStaffKPI.month,
            //             pgTimeGoal: updateStaffKPI.pgTimeGoal,
            //             machineTimeGoal: updateStaffKPI.machineTimeGoal,
            //             manufacturingPoint: updateStaffKPI.manufacturingPoint,
            //             oleGoal: updateStaffKPI.oleGoal,
            //             workGoal: updateStaffKPI.workGoal,
            //             kpi: updateStaffKPI.kpi,
            //             staffId: staff?.id,
            //             kpiId: updateStaffKPI.kpiId
            //         }),
            //     }
            // );


            //             if (!response.ok || !response2.ok) {
            //   const errorData = await (!response.ok ? response : response2).json();
            //   throw new Error(errorData.message || "Gửi thất bại.");
            // }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gửi thất bại ở response 1.");
            }

            // if (!response2.ok) {
            //     const errorData = await response2.json();
            //     throw new Error(errorData.message || "Gửi thất bại ở response 2.");
            // }
            toast.success("Thêm nhân viên và KPI thành công!");
            location.reload()
            onCancel();
        } catch (error) {
            // console.error("Lỗi khi cập gửi:", error);
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    }


    return (
        <div className="grid gap-3 w-full">
            <div className="grid gap-7">
                <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                    <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Thông tin nhân viên</div>
                    <div className="grid gap-4 grid-cols-3">
                        <div className="grid">
                            <Label htmlFor="staffId" className="text-lg !font-normal">Mã nhân viên</Label>
                            {/* <Input
                                id="staffId"
                                placeholder="Mã nhân viên"
                                type="number"
                                inputMode="numeric"
                                value={staff?.staffId ?? ""}
                                onChange={(e) =>
                                    setUpdateStaff({ ...updateStaff, staffId: Number(e.target.value) })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            /> */}
                            <Input
                                id="staffId"
                                className="!text-lg"
                                value={updateStaff.staffId ?? ""}
                                onChange={(e) =>
                                    setUpdateStaff({
                                        ...updateStaff,
                                        staffId: e.target.value === "" ? null : Number(e.target.value)
                                    })
                                }
                            />
                        </div>
                        <div className="grid">
                            <Label htmlFor="name" className="text-lg !font-normal">Họ và tên</Label>
                            <Input
                                id="name"
                                placeholder="Tên nhân viên"
                                value={updateStaff.staffName ?? ""}
                                onChange={(e) =>
                                    setUpdateStaff({
                                        ...updateStaff,
                                        staffName: e.target.value,
                                    })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>
                        <div className="grid">
                            <Label htmlFor="shortName" className="text-lg !font-normal">Tên tắt</Label>
                            <Input
                                id="shortName"
                                placeholder="Tên tắt"
                                // value={staff?.shortName}
                                // onChange={(e) => setUpdateStaff({ ...updateStaff, shortName: e.target.value })}
                                value={updateStaff.shortName ?? ""}
                                onChange={(e) =>
                                    setUpdateStaff({
                                        ...updateStaff,
                                        shortName: e.target.value,
                                    })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>
                        <div className="grid">
                            <Label htmlFor="phong_ban" className="text-lg !font-normal">Phòng ban</Label>
                            <Input
                                id="phong_ban"
                                placeholder="Phòng ban"
                                // value={staff?.staffOffice}
                                // onChange={(e) =>
                                //     setUpdateStaff({ ...updateStaff, staffOffice: e.target.value })
                                // }
                                value={updateStaff.staffOffice ?? ""}
                                onChange={(e) =>
                                    setUpdateStaff({
                                        ...updateStaff,
                                        staffOffice: e.target.value,
                                    })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>

                        <div className="grid">
                            <Label htmlFor="nhom" className="text-lg !font-normal">Nhóm</Label>
                            <Select
                                value={updateStaff.groupId?.toString()}
                                onValueChange={(value) =>
                                    setUpdateStaff((prev) => ({ ...prev, groupId: value }))
                                }
                            >
                                <SelectTrigger className="w-auto text-lg [&>span]:text-[16px]">
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent id="nhom">
                                    <SelectGroup>
                                        {group.map((g) => (
                                            <SelectItem
                                                className="text-lg"
                                                key={g.groupId}
                                                value={g.groupId.toString()}
                                            >
                                                {g.groupName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>

                        <div className="grid">
                            <Label htmlFor="cong_viec" className="text-lg !font-normal">Công việc</Label>
                            <Input
                                id="cong_viec"
                                placeholder="Công Việc"
                                // value={staff?.staffSection}
                                // onChange={(e) =>
                                //     setUpdateStaff({ ...updateStaff, staffSection: e.target.value })
                                // }
                                value={updateStaff.staffSection ?? ""}
                                onChange={(e) =>
                                    setUpdateStaff({
                                        ...updateStaff,
                                        staffSection: e.target.value,
                                    })
                                }
                                className="!text-lg placeholder:text-[16px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Mục tiêu nhân viên */}
                {kpi && (
                    <div className="px-3 relative rounded-sm border-2 pt-5 pb-6">
                        <div className="text-2xl pb-1 font-medium !top-[-18] absolute bg-white px-2">Mục tiêu nhân viên</div>
                        <div className="grid gap-4 grid-cols-2 pb-3">
                            <div className="flex flex-row items-center gap-2">
                                <Label htmlFor="name" className="text-lg !font-normal">
                                    Năm
                                </Label>
                                <Input
                                    type="number"
                                    value={kpi.year ?? ""}
                                    placeholder="Năm"
                                    readOnly
                                    className="placeholder:text-[10px] !text-xl"
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <Label htmlFor="name" className="text-lg !font-normal">Tháng</Label>
                                <Input
                                    type="number"
                                    value={kpi.month ?? ""}
                                    readOnly
                                    placeholder="Tháng"
                                    className="placeholder:text-[10px] !text-lg"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-3">
                            <div className="grid">
                                <Label htmlFor="kpi" className="text-lg !font-normal">KPI</Label>
                                <Input
                                    id="kpi"
                                    className="!text-lg"
                                    placeholder="Mục tiêu làm việc"
                                    type="number"
                                    inputMode="numeric"
                                    value={updateStaffKPI.kpi ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaffKPI({ ...updateStaffKPI, kpi: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="workGoal" className="text-lg !font-normal">Mục tiêu nhân viên làm việc</Label>
                                <Input
                                    id="workGoal"
                                    placeholder="Mục tiêu làm việc"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    // value={kpi.workGoal ?? ""}
                                    // onChange={(e) => setUpdateStaffKPI("workGoal", Number(e.target.value))}
                                    value={updateStaffKPI.workGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaffKPI({ ...updateStaffKPI, workGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="pgTimeGoal" className="text-lg !font-normal">Mục tiêu giờ PG</Label>
                                <Input
                                    id="pgTimeGoal"
                                    placeholder="Mục tiêu giờ PG"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    // value={kpi.pgTimeGoal ?? ""}
                                    // onChange={(e) => updateKPIField("pgTimeGoal", Number(e.target.value))}
                                    value={updateStaffKPI.pgTimeGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaffKPI({ ...updateStaffKPI, pgTimeGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="machineTimeGoal" className="text-lg !font-normal">Mục tiêu giờ máy</Label>
                                <Input
                                    id="machineTimeGoal"
                                    placeholder="Mục tiêu giờ máy"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    // value={kpi.machineTimeGoal ?? ""}
                                    // onChange={(e) => updateKPIField("machineTimeGoal", Number(e.target.value))}
                                    value={updateStaffKPI.machineTimeGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaffKPI({ ...updateStaffKPI, machineTimeGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="manufacturingPoint" className="text-lg !font-normal">Mục tiêu điểm gia công</Label>
                                <Input
                                    id="manufacturingPoint"
                                    placeholder="Mục tiêu điểm gia công"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    // value={kpi.manufacturingPoint ?? ""}
                                    // onChange={(e) => updateKPIField("manufacturingPoint", Number(e.target.value))}
                                    value={updateStaffKPI.manufacturingPoint ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaffKPI({ ...updateStaffKPI, manufacturingPoint: e.target.value === "" ? null : Number(e.target.value) })
                                    }

                                />
                            </div>
                            <div className="grid">
                                <Label htmlFor="oleGoal" className="text-lg !font-normal">Mục tiêu Ole</Label>
                                <Input
                                    id="oleGoal"
                                    placeholder="Mục tiêu Ole"
                                    type="number"
                                    inputMode="numeric"
                                    className="!text-lg"
                                    // value={kpi.oleGoal ?? ""}
                                    // onChange={(e) => updateKPIField("oleGoal", Number(e.target.value))}
                                    value={updateStaffKPI.oleGoal ?? ""}
                                    onChange={(e) =>
                                        setUpdateStaffKPI({ ...updateStaffKPI, oleGoal: e.target.value === "" ? null : Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>
                    </div>


                )}
            </div>
            {/* <div className="grid grid-cols-2 gap-4">


            </div> */}

            {/* KPI Section */}
            {/* {kpi && (
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-300">
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold text-gray-700">Thông tin KPI</h3>
                    </div>


                    <div className="space-y-1">
                        <Label>OLE Goal</Label>
                        <Input
                            type="number"
                            value={kpi.oleGoal ?? ""}
                            // onChange={(e) => updateKPIField("oleGoal", Number(e.target.value))}
                            placeholder="OLE Goal"
                            className="text-base placeholder:text-[10px]"
                        />
                    </div>


                </div>
            )} */}

            {/* Nút */}
            <div className="flex justify-end gap-3">
                <Button onClick={handleUpdate} className="bg-[#074695] hover:bg-[#0754B4]">
                    Lưu thay đổi
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
            </div>
        </div>
    )
}

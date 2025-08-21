import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import OperatorStatus from "../components/OperatorStatus"

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
                <div className="w-1/3 flex items-center gap-5">
                    {/* <Input
                        placeholder="Tìm kiếm"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm !text-[20px]"
                    /> */}
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Tìm kiếm"
                            // value={globalFilter}
                            // onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select>
                        <SelectTrigger className="w-[180px] bg-[#004799] !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                            <SelectValue placeholder="Nhóm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {/* <SelectLabel>Fruits</SelectLabel> */}
                                <SelectItem value="apple">Nhóm 1</SelectItem>
                                <SelectItem value="banana">Nhóm 2</SelectItem>
                                <SelectItem value="blueberry">Nhóm 3</SelectItem>
                                <SelectItem value="grapes">Nhóm 4</SelectItem>
                                <SelectItem value="pineapple">Nhóm 5</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <OperatorStatus />
        </div>
    )
}
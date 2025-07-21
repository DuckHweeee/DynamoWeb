import { MachineProcessBarChart } from "../component/machineProcessBarChart";
import OperatorTable from "../component/operatorTable";
import { ReportTime } from "../component/reporTime";

export default function OperationChart() {
    return (
        <>
            {/* Thống kê vận hành */}
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
                <ReportTime title={"Thống kê vận hành"} description={"12 người vận hành"} />

                <div className="grid grid-cols-2 gap-5 my-5">
                    {/* <MachineRunBarChart /> */}
                    <MachineProcessBarChart title="Tổng giờ làm việc của từng người vận hành" description="Description" />
                    <MachineProcessBarChart title="Tổng điểm của từng người vận hành" description="Description" />
                    <MachineProcessBarChart title="Tổng số nguyên công của từng người vận hành" description="Description" />
                    <MachineProcessBarChart title="KPI của từng người vận hành trong nhóm" description="Description" />
                </div>
                <OperatorTable title="Danh sách người vận hành" description="Tất cả các máy" />
            </div >
        </>
    )
}
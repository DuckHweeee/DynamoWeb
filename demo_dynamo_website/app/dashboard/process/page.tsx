import OperatorTable from "../component/operatorTable";
import { ReportTime } from "../component/reporTime";

export default function ProcessChart() {
    return (
        <>
            {/* Thống kê Process */}
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
                <ReportTime title={"Thống kê Process "} description={"12 nguyên công"} />
                <OperatorTable title="Danh sách thống kê nhân viên" description="Tất cả các máy" />
            </div >
        </>
    )

}
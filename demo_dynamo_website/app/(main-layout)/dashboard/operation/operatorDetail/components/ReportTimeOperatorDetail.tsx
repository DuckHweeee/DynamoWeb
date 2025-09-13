import { MonitorDot, TrendingDown, TrendingUp } from "lucide-react";

export function ReportTimeOperatorDetail() {
    return (
        <>
            <div className="my-5 flex gap-3 items-center justify-between">
                <div className="inline-block rounded-sm bg-white px-5 py-4 shadow-md border w-full">

                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-red-500 text-lg font-medium">-3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">2h 30m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Làm
                            <TrendingDown size={14} className="ml-1 text-red-500" />
                        </p>
                        {/* <p className="text-sm text-gray-400">30 phút</p> */}
                    </div>
                </div>

                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-red-500 text-lg font-medium">-5.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">124</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Điểm
                            <TrendingDown size={14} className="ml-1 text-red-500" />
                        </p>
                        {/* <p className="text-sm text-gray-400">10 điểm / người</p> */}
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-lg font-medium">+5.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">24</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Số Nguyên Công
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        {/* <p className="text-sm text-gray-400">2 nguyên công / người</p> */}
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-lg font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">24</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng KPI
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        {/* <p className="text-sm text-gray-400">2 / người</p> */}
                    </div>
                </div>
            </div>
        </>
    )
}
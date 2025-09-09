import { MonitorDot, TrendingDown, TrendingUp } from "lucide-react";

export function ReportTime({ title, description }: { title: string; description: string }) {
    return (
        <>
            <div className="flex flex-row items-center justify-between mt-2">
                <p className="text-3xl font-semibold">{title}</p>

                <div className="flex gap-15 flex-row items-center justify-between">
                    <p className="text-xl font-medium">Tổng Số: </p>
                    <p className="text-3xl font-bold text-[#074695]">{description}</p>
                </div>
            </div>

            <div className="my-5 flex gap-3 items-center justify-between">
                <div className="inline-block rounded-sm bg-white px-5 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-red-500 text-lg font-medium">-3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">2h 30m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Chạy Tháng
                            <TrendingDown size={14} className="ml-1 text-red-500" />
                        </p>
                        <p className="text-sm text-gray-400">30 phút / người</p>
                    </div>
                </div>

                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-red-500 text-lg font-medium">-3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">5h 35m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Dừng Tháng
                            <TrendingDown size={14} className="ml-1 text-red-500" />
                        </p>
                        <p className="text-sm text-gray-400">45 phút / người</p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-lg font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">6h 45m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Lỗi Tháng
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        <p className="text-sm text-gray-400">+20.1% from last month</p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-lg font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">8h 30m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Giờ PG Tháng
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        <p className="text-sm text-gray-400">+20.1% from last month</p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-lg font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">9h 15m</p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            Tổng Số Gia Công Tháng
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        <p className="text-sm text-gray-400">+20.1% from last month</p>
                    </div>
                </div>

            </div>
        </>
    )
}
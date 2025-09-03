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
                        <p className="text-red-500 text-sm font-medium">-3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">1h 30m</p>

                    <div className="mt-2">
                        <p className="text-sm font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Chạy Trong Tháng
                            <TrendingDown size={14} className="ml-1 text-red-500" />
                        </p>
                        <p className="text-xs text-gray-400">+20.1% from last month</p>
                    </div>
                </div>

                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-red-500 text-sm font-medium">-3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">1h 30m</p>

                    <div className="mt-2">
                        <p className="text-sm font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Chạy Trong Tháng
                            <TrendingDown size={14} className="ml-1 text-red-500" />
                        </p>
                        <p className="text-xs text-gray-400">+20.1% from last month</p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-sm font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">1h 30m</p>

                    <div className="mt-2">
                        <p className="text-sm font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Chạy Trong Tháng
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        <p className="text-xs text-gray-400">+20.1% from last month</p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot size={24} className="text-[#343A40]" />
                        <p className="text-green-500 text-sm font-medium">+3.5%</p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">1h 30m</p>

                    <div className="mt-2">
                        <p className="text-sm font-medium text-[#343A40] flex items-center">
                            Tổng Giờ Chạy Trong Tháng
                            <TrendingUp size={14} className="ml-1 text-green-500" />
                        </p>
                        <p className="text-xs text-gray-400">+20.1% from last month</p>
                    </div>
                </div>
            </div>
        </>
    )
}
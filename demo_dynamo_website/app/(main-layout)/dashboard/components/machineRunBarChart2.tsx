import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts"

const legendItems = [
    { name: "Rerun Machine", value: 0.6, fill: "#0033A0" },
    { name: "Main Product Run", value: 0.5, fill: "#F3BC32" },
    { name: "Captive Product Stop", value: 0.79, fill: "#00E676" },
    { name: "Error Machine", value: 0.5, fill: "#FF0000" },
    { name: "Run Machine 5", value: 1.18, fill: "#D9D9D9" },
    { name: "Off Machine 5", value: 1.26, fill: "#ABCAFB" },
    { name: "Machine 6", value: 1.8, fill: "#6BF2E5" },
    { name: "Off Machine 6", value: 0.9, fill: "#00EAFF" },
]

export default function MachineRunBarChart2({ title, description }: { title: string; description: string }) {
    const data = [
        { name: "Rerun Machine", value: 0.6, fill: "#0033A0" },
        { name: "Main Product Run", value: 0.5, fill: "#F3BC32" },
        { name: "Captive Product Stop", value: 0.79, fill: "#00E676" },
        { name: "Error Machine", value: 0.5, fill: "#FF0000" },
        { name: "Run Machine 5", value: 1.18, fill: "#D9D9D9" },
        { name: "Off Machine 5", value: 1.26, fill: "#ABCAFB" },
        { name: "Machine 6", value: 1.8, fill: "#6BF2E5" },
        { name: "Off Machine 6", value: 0.9, fill: "#00EAFF" },
    ]

    return (
        <div className="p-4 bg-white rounded-xl shadow !flex-1/2 border">
            {/* <p className="text-xl font-bold">Tổng Giờ Chạy Trong Tháng Nhóm 1</p>
            <p className="text-sm text-gray-500 mb-4">Tổng thời gian hoạt động của nhóm này</p> */}
            <p className="text-xl font-bold">{title}</p>
            <p className="text-sm text-gray-500 mb-4">{description}</p>

            {/* BIỂU ĐỒ */}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}
                    accessibilityLayer
                    margin={{
                        left: -20,
                    }}>
                    {/* <XAxis dataKey="name" tick={{ fontSize: 12 }} /> */}
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                </BarChart>
            </ResponsiveContainer>
            {/* Hiện chú thích */}
            <div className="mb-4 flex flex-wrap gap-4 bg-white p-3 rounded-lg justify-between ">
                {legendItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-sm text-gray-800 font-medium">
                            {item.name}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

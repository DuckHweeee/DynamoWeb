"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { useEffect, useRef, useState } from "react"
import { MachineOverview } from "../lib/type"
export const description = "A stacked bar chart with a legend"
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig = {
    runTime: {
        label: "Run Time",
        color: "#22c55e",
    },
    stopTime: {
        label: "Stop Time",
        color: "#f59e0b",
    },
    errorTime: {
        label: "Error Time",
        color: "#ef4444",
    },
    emptyTime: {
        label: "Empty Time",
        color: "#3b82f6",
    },
} satisfies ChartConfig

export default function MachineTimeProgress({
    title,
    description,
    dataOverview,
}: {
    title: string
    description: string
    dataOverview: MachineOverview[]
}) {
    const [currentPage, setCurrentPage] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const itemsPerPage = 5
    const totalPages = Math.ceil(dataOverview.length / itemsPerPage)

    // Get current page data
    const currentData = dataOverview.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    )
    const chartData = currentData.map((m) => ({
        name: m.machineName,
        runTime: m.runTime,
        stopTime: m.stopTime,
        errorTime: m.errorTime,
        emptyTime: m.emptyTime,
    }))
   
    // Handle wheel scroll
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) return

            e.preventDefault()

            if (isScrolling) return

            setIsScrolling(true)

            if (e.deltaY > 0 && currentPage < totalPages - 1) {
                // Scroll down - next page
                setCurrentPage(prev => prev + 1)
            } else if (e.deltaY < 0 && currentPage > 0) {
                // Scroll up - previous page
                setCurrentPage(prev => prev - 1)
            }

            // Reset scrolling flag after a delay
            setTimeout(() => setIsScrolling(false), 300)
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false })
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel)
            }
        }
    }, [currentPage, totalPages, isScrolling])
    return (
        <Card className="!w-full shadow-md bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl">
            <CardHeader>
                <CardTitle>Bar Chart - Horizontal</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[410px]">

                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{
                            left: -20,
                            right: 10
                        }}
                    >
                        <CartesianGrid horizontal={false} />

                        <XAxis
                            type="number"
                            axisLine={false}
                            tick={{
                                fontSize: 14, fontWeight: 750, fill: "#fff",
                                style: { fill: "#fff" },
                            }}
                        />

                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tick={{
                                fontSize: 14, fontWeight: 750, fill: "#fff",
                                style: { fill: "#fff" },
                            }}


                        />

                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent className="text-white" />} />
                        <Bar
                            dataKey="runTime"
                            stackId="a"
                            fill="var(--color-runTime)"
                            radius={[10, 0, 0, 10]}
                            
                            


                        />

                        <Bar
                            dataKey="stopTime"
                            stackId="a"
                            fill="var(--color-stopTime)"
                        />

                        <Bar
                            dataKey="errorTime"
                            stackId="a"
                            fill="var(--color-errorTime)"
                        />

                        <Bar
                            dataKey="emptyTime"
                            stackId="a"
                            fill="var(--color-emptyTime)"
                            radius={[0, 10, 10, 0]}
                        />

                    </BarChart>

                </ChartContainer>
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${index === currentPage
                                ? 'bg-blue-500'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

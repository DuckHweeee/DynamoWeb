"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { useState, useEffect, useRef } from "react"

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A horizontal bar chart"

// Extended chart data for pagination demo
const chartData = [
    { name: "I-01", number: 186 },
    { name: "I-02", number: 305 },
    { name: "I-03", number: 237 },
    { name: "I-04", number: 73 },
    { name: "I-05", number: 200 },
    { name: "I-06", number: 150 },
    { name: "I-07", number: 320 },
    { name: "I-08", number: 180 },
    { name: "I-09", number: 95 },
    { name: "I-10", number: 275 },
    { name: "I-11", number: 165 },
    { name: "I-12", number: 290 },
    { name: "I-13", number: 210 },
    { name: "I-14", number: 145 },
    { name: "I-15", number: 330 },
]

const chartConfig = {
    name: {
        color: "#074695",
    },
    number: {
        label: "Tổng số",
    },
} satisfies ChartConfig

export function MachineProcessBarChart({ title, description }: { title: string; description: string }) {
    const [currentPage, setCurrentPage] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const itemsPerPage = 5
    const totalPages = Math.ceil(chartData.length / itemsPerPage)

    // Get current page data
    const currentData = chartData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    )

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
        <Card className="!w-full" ref={containerRef}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-2xl font-bold">{title}</p>
                        <p className="text-xl text-gray-500">{description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Page {currentPage + 1} of {totalPages} | Scroll to navigate
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={currentData}
                        layout="vertical"
                        margin={{
                            left: -60,
                        }}
                    >
                        <XAxis type="number"
                            dataKey="number"
                            // tick={{ fontSize: 15 }}
                            // tickLine={false}
                            // tickMargin={10}
                            // axisLine={true}
                            hide
                        />
                        {/* <CartesianGrid horizontal={false} /> */}
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            width={110}
                            tick={{ fontSize: 18 }}
                        // tickFormatter={(value) => value.slice(0, 7)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="number" fill="var(--color-name)" radius={5}>
                            <LabelList
                                dataKey="number"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={16}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
                
                {/* Pagination dots */}
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentPage 
                                    ? 'bg-blue-600' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            </CardContent>
        </Card >
    )
}

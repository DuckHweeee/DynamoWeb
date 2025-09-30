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

import { MachineOverview } from "../lib/type"

const chartConfig = {
    machineName: {
        label: "Máy",
    },
    numberOfProcesses: {
        label: "Tổng số",
        color: "#074695",
    },
} satisfies ChartConfig

export function MachineProcessBarChart({
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

    // Handle wheel scroll
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) return

            e.preventDefault()

            if (isScrolling) return

            setIsScrolling(true)

            if (e.deltaY > 0 && currentPage < totalPages - 1) {
                setCurrentPage(prev => prev + 1)
            } else if (e.deltaY < 0 && currentPage > 0) {
                setCurrentPage(prev => prev - 1)
            }
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
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={currentData}
                        layout="vertical"
                        margin={{
                            left: -50,
                        }}
                    >
                        <XAxis type="number"
                            dataKey="numberOfProcesses"
                            // tick={{ fontSize: 15 }}
                            // tickLine={false}
                            // tickMargin={10}
                            // axisLine={true}
                            hide
                        />
                        {/* <CartesianGrid horizontal={false} /> */}
                        <YAxis
                            dataKey="machineName"
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
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="numberOfProcesses" fill={chartConfig.numberOfProcesses.color} radius={5}>
                            <LabelList
                                dataKey="numberOfProcesses"
                                position="insideRight"
                                offset={8}
                                className="fill-white"
                                fontSize={18}
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
                            className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${index === currentPage
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

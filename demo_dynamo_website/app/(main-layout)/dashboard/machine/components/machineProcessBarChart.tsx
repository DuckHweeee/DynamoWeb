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
        color: "#3b82f6",
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
        <Card className="!w-full shadow-md bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl  " ref={containerRef}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-base font-semibold text-white">{title}</p>
                        <p className="text-sm text-white">{description}</p>
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
                            left: -70,
                            right: 30
                        }}
                    >
                        <XAxis type="number"
                            dataKey="numberOfProcesses"
                            hide
                        />
                        {/* <CartesianGrid horizontal={false} /> */}
                        <defs>
                            <linearGradient id="processGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4adede" />
                                <stop offset="100%" stopColor=" #1ca7ec" />
                            </linearGradient>
                        </defs>
                        <YAxis
                            dataKey="machineName"
                            type="category"
                            tickLine={true}
                            tickMargin={5}
                            axisLine={false}
                            width={110}
                            tick={{
                                fontSize: 14, fontWeight: 750, fill: "#fff",
                                style: { fill: "#fff" },
                            }}
                        // tickFormatter={(value) => value.slice(0, 7)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="numberOfProcesses" fill="url(#processGradient)" radius={5}>
                            <LabelList
                                dataKey="numberOfProcesses"
                                position="right"
                                offset={8}
                                className="fill-white"
                                fontSize={13}
                                fontWeight={750}
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
                                ? 'bg-blue-500'
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

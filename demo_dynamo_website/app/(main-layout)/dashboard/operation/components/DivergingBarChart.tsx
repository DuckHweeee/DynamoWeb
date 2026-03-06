"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const chartConfig = {
  target: {
    label: "Mục tiêu",
    color: "#369fff",
  },
  real: {
    label: "Thực tế",
    color: "#72e05cff",
  },
} satisfies ChartConfig;

interface DivergingBarChartProps {
  title: string;
  description: string;
  data: { name: string; target: number; real: number }[];
}

type ChartMode = "ranking" | "comparison";

const ITEMS_PER_PAGE = 5;

export function DivergingBarChart({
  title,
  description,
  data,
}: DivergingBarChartProps) {
  const [chartMode, setChartMode] = useState<ChartMode>("ranking");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = [...data].sort((a, b) => b.real - a.real);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleModeChange = (value: string) => {
    setChartMode(value as ChartMode);
    setCurrentPage(1);
  };

  const legendItemsRanking = [
    { name: "Thực tế", fill: "#72e05cff" },
  ];

  const legendItemsComparison = [
    { name: "Mục tiêu", fill: "#369fff" },
    { name: "Thực tế (đạt)", fill: "#72e05cff" },
    { name: "Thực tế (chưa đạt)", fill: "#dc2626" },
  ];

  const chartHeight = 390;

  return (
    <Card className="w-full shadow-md !bg-transparent">
      <CardHeader className="text-white">
        <div className="items-center">
          <p>{title}</p>
          <p>{description}</p>
        </div>
        <RadioGroup
          defaultValue="ranking"
          value={chartMode}
          onValueChange={handleModeChange}
          className="flex gap-6 mt-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ranking" id="ranking" />
            <Label htmlFor="ranking" className="cursor-pointer text-white">
              Xếp hạng thực tế
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comparison" id="comparison" />
            <Label htmlFor="comparison" className="cursor-pointer text-white">
              So sánh với mục tiêu
            </Label>
          </div>
        </RadioGroup>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{
          height: chartHeight, width: "100%", marginLeft: -35,
        }}>
          {chartMode === "ranking" ? (
            <BarChart data={paginatedData} layout="vertical" accessibilityLayer margin={{ right: 30, left: 20 }}>
              <defs>
                <linearGradient id="rankingGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D0E5A5" />
                  <stop offset="100%" stopColor="#86E3C3" />
                </linearGradient>
              </defs>
              <YAxis
                dataKey="name"
                type="category"
                tickLine={true}
                axisLine={false}
                fontSize={14}
                fontWeight={600}
                width={80}
                tick={{
                  fill: "#ffffff",
                  style: { fill: "#fff" },
                }}

              />
              <XAxis type="number" tickLine={true} axisLine={true} tick={{
                fill: "#ffffff",
                style: { fill: "#fff" },
              }} />
              <Bar
                dataKey="real"
                fill="url(#rankingGradient)"
                radius={7}
                barSize={50}
              >
                <LabelList
                  dataKey="real"
                  position="right"
                  fontSize={12}
                  fontWeight={750}
                  className="fill-white"
                />
              </Bar>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="w-[180px]"
                    formatter={(value) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] "
                          style={{ background: "#72e05cff" }}
                        />
                        Thực tế
                        <div className="ml-auto font-mono font-medium">
                          {value}
                        </div>
                      </>
                    )}
                  />
                }
                cursor={false}
              />
            </BarChart>
          ) : (
            <BarChart data={paginatedData} layout="vertical" accessibilityLayer barGap={2} margin={{
              right: 50,
              left: 20
            }}>
              <defs>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="realGreenGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D0E5A5" />
                  <stop offset="100%" stopColor="#86E3C3" />
                </linearGradient>
                <linearGradient id="realRedGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>
              <YAxis
                dataKey="name"
                type="category"
                tickLine={true}
                axisLine={false}
                fontSize={14}
                fontWeight={600}
                width={80}
                tick={{
                  fill: "#ffffff",
                  style: { fill: "#fff" },
                }}
              />
              <XAxis type="number" tickLine={true} axisLine={true}   tick={{
                  fill: "#ffffff",
                  style: { fill: "#fff" },
                }} />
              <Bar
                dataKey="target"
                fill="url(#targetGradient)"
                radius={7}
                barSize={30}

              >
                <LabelList
                  dataKey="target"
                  fontSize={12}
                  className="fill-white"
                  position="right"
                  fontWeight={750}
                />
              </Bar>
              <Bar dataKey="real" radius={7} barSize={30}>
                {paginatedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.real >= entry.target
                        ? "url(#realGreenGradient)"
                        : "url(#realRedGradient)"
                    }
                  />
                ))}
                <LabelList
                  dataKey="real"
                  fontSize={12}
                  position={"right"}
                  className="fill-white"
                  fontWeight={750}

                />
              </Bar>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="w-[180px]"
                    formatter={(value, name) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{
                            background: `var(--color-${name})`,
                          }}
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto font-mono font-medium">
                          {value}
                        </div>
                      </>
                    )}
                  />
                }
                cursor={false}
              />
            </BarChart>
          )}
        </ChartContainer>

        {/* Legend */}
        <div className="mx-6 grid grid-cols-3  p-3 justify-items-center">
          {(chartMode === "ranking" ? legendItemsRanking : legendItemsComparison).map(
            (item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-white font-medium">
                  {item.name}
                </span>
              </div>
            )
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-white">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
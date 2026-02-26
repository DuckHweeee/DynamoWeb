"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { GroupEfficiency } from "../lib/type"

export const description = "A donut chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const mapData = (raw: GroupEfficiency) => [
  { name: "Hiệu suất khai thác máy", value: raw.operationalEfficiency },
  { name: "Hiệu suất PG", value: raw.pgEfficiency },
  { name: "Hiệu suất giá trị", value: raw.valueEfficiency },
  { name: "OEE", value: raw.oee },
  { name: "Tổn thất Offset", value: raw.offsetLoss },
  { name: "Tổn thất NG/khác", value: raw.otherLoss },
];


export function MachinePieChart({
  dataRunTime,
}: {
  dataRunTime: GroupEfficiency;
}) {
  const data = mapData(dataRunTime);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
      {data.map((item, index) => {
        const fillColor =
          item.value < 40
            ? "url(#redGradient)" // red-500
            : item.value < 70
              ? "url(#yellowGradient)"  // yellow-400
              : "url(#greenGradient)"; // green-500
        const pieData = [
          { name: item.name, value: item.value, fill: fillColor },
          { name: "Còn lại", value: 100 - item.value, fill: "#7e7e7e" },
        ];

        const chartConfig = {
          [item.name]: { label: item.name },
        } satisfies ChartConfig;
        return (
          <Card key={index}
            className="flex flex-col h-fit w-auto py-1 shadow-md bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl">
            <CardContent className="flex-1 pb-0 px-1">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <defs>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fca5a5" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>

                    <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fde68a" />
                      <stop offset="100%" stopColor="#facc15" />
                    </linearGradient>

                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#86E3C3" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={pieData}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={80}
                  
                    isAnimationActive
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          const wrapText = (text: string, maxChars: number) => {
                            const words = text.split(" ");
                            const lines: string[] = [];
                            let currentLine = "";

                            words.forEach((word) => {
                              if ((currentLine + word).length > maxChars) {
                                lines.push(currentLine);
                                currentLine = word + " ";
                              } else {
                                currentLine += word + " ";
                              }
                            });

                            lines.push(currentLine.trim());
                            return lines;
                          };

                          const lines = wrapText(item.name, 15);

                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-white text-2xl font-bold"
                              >
                                {pieData[0].value.toFixed(1)}%
                              </tspan>

                              {lines.map((line, i) => (
                                <tspan
                                  key={i}
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 30 + i * 16}
                                  className="fill-white/80 text-sm"
                                >
                                  {line}
                                </tspan>
                              ))}
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );
      })}

    </div>

  )
}


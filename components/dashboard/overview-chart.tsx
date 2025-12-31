"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts"
import { Card } from "@/components/ui/card"
import { BarChart2 } from "lucide-react"

interface OverviewChartProps {
    data: { day: string; clicks: number }[]
}

const CustomLabel = (props: any) => {
    const { x, y, value } = props
    if (value === 0) return null
    return (
        <g transform={`translate(${x},${y - 20})`}>
            <rect
                x="-25"
                y="-15"
                width="50"
                height="28"
                rx="6"
                fill="black"
                className="filter drop-shadow-lg"
            />
            <text
                x="0"
                y="5"
                textAnchor="middle"
                className="text-[11px] font-semibold fill-white"
            >
                {value}
            </text>
            <path
                d="M -4 13 L 0 17 L 4 13"
                fill="black"
            />
        </g>
    )
}

export function OverviewChart({ data }: OverviewChartProps) {
    const hasData = data && data.some(d => d.clicks > 0)

    if (!hasData) {
        return (
            <div className="h-[450px] w-full bg-[#F8F9FA] rounded-xl flex flex-col items-center justify-center border border-dashed border-gray-200">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-[#F1F3F5]">
                    <BarChart2 className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">No data available for this period</p>
                <p className="text-[13px] text-gray-300 uppercase tracking-widest mt-1">Try selecting a different date range</p>
            </div>
        )
    }

    return (
        <div className="h-[450px] w-full bg-transparent rounded-lg overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 40, right: 30, bottom: 20, left: -20 }}>
                    <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C975" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#00C975" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: '600' }}
                        dy={20}
                        padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                        hide
                        domain={[0, (dataMax: number) => Math.max(dataMax * 1.5, 10)]}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-black px-4 py-2 border-none shadow-2xl rounded-lg">
                                        <p className="text-[11px] font-semibold text-white uppercase tracking-wider">{payload[0].value} clicks</p>
                                    </div>
                                )
                            }
                            return null
                        }}
                        cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#000000"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                        dot={{ fill: '#000000', stroke: '#000000', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#00C975', stroke: 'white', strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke="none"
                        label={<CustomLabel />}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

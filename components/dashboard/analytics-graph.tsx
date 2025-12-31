"use client"

import { useEffect, useState, useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { createClient } from "@/lib/supabase/client"
import { format, startOfDay, eachDayOfInterval, subDays } from "date-fns"
import { BarChart2 } from "lucide-react"

interface AnalyticsGraphProps {
    initialData: { day: string; clicks: number; fullDate: string }[]
    startDate?: Date
    endDate?: Date
}

export function AnalyticsGraph({ initialData, startDate, endDate }: AnalyticsGraphProps) {
    const [data, setData] = useState(initialData)
    const supabase = createClient()

    // Recalculate graph points when a new click is detected
    useEffect(() => {
        const channel = supabase
            .channel('realtime-graph')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'clicks'
                },
                async (payload) => {
                    console.log('Realtime Click for Graph:', payload)

                    const clickDate = new Date(payload.new.created_at)
                    const dayLabel = format(clickDate, 'EEE').toLowerCase()
                    const fullDateLabel = clickDate.toLocaleDateString()

                    setData(prev => prev.map(item => {
                        // Match either the label (e.g. 'wed') or the full date for precision
                        if (item.fullDate === fullDateLabel || item.day === dayLabel) {
                            return { ...item, clicks: item.clicks + 1 }
                        }
                        return item
                    }))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    // Update data if props change (e.g. from date picker)
    useEffect(() => {
        setData(initialData)
    }, [initialData])

    const hasData = useMemo(() => data.some(d => d.clicks > 0), [data])

    // Always render the graph, showing a zero-line if no clicks exist
    return (
        <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C975" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00C975" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                        dy={15}
                        interval={0}
                        padding={{ left: 30, right: 30 }}
                        textAnchor="middle"
                        className="font-outfit uppercase"
                    />
                    <YAxis hide domain={[0, (dataMax: number) => Math.max(dataMax * 1.2, 5)]} />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-black text-white px-4 py-2 rounded-xl shadow-2xl border-none">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#00C975] mb-1">
                                            {payload[0].payload.fullDate}
                                        </p>
                                        <p className="text-lg font-bold font-outfit">
                                            {payload[0].value} <span className="text-xs font-medium text-zinc-400">clicks</span>
                                        </p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#00C975"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                        animationDuration={1000}
                        dot={{ r: 4, fill: '#00C975', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#000', strokeWidth: 2, stroke: '#00C975' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

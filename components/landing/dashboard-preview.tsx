"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, LabelList } from "recharts"
import { Card } from "@/components/ui/card"
import { Monitor, Smartphone, Globe, ArrowUpRight, Copy, Trash2, Edit2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

const data = [
    { day: "mon", clicks: 0 },
    { day: "tue", clicks: 383 },
    { day: "wed", clicks: 637 },
    { day: "thu", clicks: 346 },
    { day: "fri", clicks: 2084 },
    { day: "sat", clicks: 1038 },
    { day: "sun", clicks: 405 },
]

const CustomizedDot = (props: any) => {
    const { cx, cy, value } = props;

    return (
        <g>
            <circle cx={cx} cy={cy} r={8} fill="#333" stroke="none" />
            <circle cx={cx} cy={cy} r={4} fill="#666" stroke="none" />
            {/* Custom label styling if needed, but LabelList is easier */}
        </g>
    );
};

export function DashboardPreview() {
    return (
        <div className="w-full max-w-6xl mx-auto p-2 bg-gradient-to-b from-[#00C975]/20 to-transparent rounded-3xl">
            <Card className="bg-[#F5F5F5] border-none shadow-2xl p-6 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Button variant="outline" className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90 border-none rounded-lg gap-2">
                        <Monitor className="w-4 h-4" />
                        Today
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Area */}
                    <div className="lg:col-span-2 h-[400px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12, fontWeight: '600' }}
                                    dy={10}
                                />
                                <YAxis hide domain={[0, 'dataMax + 500']} />
                                <Line
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#111"
                                    strokeWidth={2}
                                    dot={{ fill: '#333', r: 6, strokeWidth: 0 }}
                                    activeDot={{ r: 8 }}
                                >
                                    <LabelList
                                        dataKey="clicks"
                                        position="top"
                                        offset={15}
                                        className="fill-black font-bold text-sm"
                                        formatter={(value: number) => value > 0 ? value : "0"}
                                    />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                        {/* Custom Labels Backgrounds (Simulated visually or with advanced SVG if needed, kept simple for now) */}
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-[#F0F0F0] p-6 rounded-xl">
                            <p className="text-sm font-semibold text-gray-600 mb-1">Last hour clicks:</p>
                            <p className="text-4xl font-bold text-gray-900">20</p>
                        </div>

                        <div className="bg-[#F0F0F0] p-6 rounded-xl">
                            <p className="text-sm font-semibold text-gray-900 mb-4">Top Performing Tags:</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-white p-2 px-3 rounded text-sm">
                                    <span className="text-gray-600">Banner ads</span>
                                    <span className="text-gray-400">2078</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-2 px-3 rounded text-sm">
                                    <span className="text-gray-600">Thread</span>
                                    <span className="text-gray-400">1493</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-2 px-3 rounded text-sm">
                                    <span className="text-gray-600">Signature</span>
                                    <span className="text-gray-400">573</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom List */}
                <div className="mt-8 space-y-4">
                    <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 px-4 uppercase tracking-wider">
                        <div className="col-span-3">All tags</div>
                        <div className="col-span-3">destination URL</div>
                        <div className="col-span-2">last click</div>
                        <div className="col-span-2">Total click</div>
                        <div className="col-span-2">smart links</div>
                    </div>

                    {/* Row 1 */}
                    <div className="bg-white p-4 rounded-xl items-center grid grid-cols-12 gap-4 hover:shadow-sm transition-shadow">
                        <div className="col-span-3 flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <Tag className="w-5 h-5 text-black transform rotate-90" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Thread</p>
                                <p className="text-xs text-gray-500">https://myforums.net</p>
                            </div>
                        </div>
                        <div className="col-span-3 flex items-center text-xs text-gray-500 truncate">
                            https://mystore.com
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-black"></div> 6min ago
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-gray-600">
                            <ArrowUpRight className="w-3 h-3" /> 1493
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                <Copy className="w-3 h-3" /> https://frme.io/oisns
                            </div>
                            <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
                            <Button size="sm" className="h-7 text-xs bg-black text-white hover:bg-black/80">Edit</Button>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="bg-white p-4 rounded-xl items-center grid grid-cols-12 gap-4 hover:shadow-sm transition-shadow">
                        <div className="col-span-3 flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <Tag className="w-5 h-5 text-black transform rotate-90" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Signature</p>
                                <p className="text-xs text-gray-500">https://myforums.net</p>
                            </div>
                        </div>
                        <div className="col-span-3 flex items-center text-xs text-gray-500 truncate">
                            https://mystore.com
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-black"></div> 2h ago
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-gray-600">
                            <ArrowUpRight className="w-3 h-3" /> 572
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                <Copy className="w-3 h-3" /> https://frme.io/rdins
                            </div>
                            <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
                            <Button size="sm" className="h-7 text-xs bg-black text-white hover:bg-black/80">Edit</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

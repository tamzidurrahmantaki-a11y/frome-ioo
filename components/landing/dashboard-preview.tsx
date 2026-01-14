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
        <div className="w-full max-w-6xl mx-auto p-3 bg-gradient-to-b from-[#00C975]/10 to-transparent rounded-[2.5rem] mt-10">
            <Card className="bg-[#F8F9FA] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-4 md:p-8 rounded-[2rem] overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 mb-8">
                    <h3 className="text-[10px] md:text-sm font-bold tracking-[0.2em] md:tracking-widest text-[#111] uppercase opacity-40">
                        Click Performance
                    </h3>
                    <Button variant="outline" className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90 border-none rounded-xl gap-2 h-10 px-6 font-bold text-xs transition-all active:scale-95 shadow-lg">
                        <Monitor className="w-3.5 h-3.5" />
                        Today
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Area */}
                    <div className="lg:col-span-2 h-[300px] md:h-[400px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888', fontSize: 11, fontWeight: '700' }}
                                    dy={10}
                                />
                                <YAxis hide domain={[0, 'dataMax + 500']} />
                                <Line
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#111"
                                    strokeWidth={3}
                                    dot={{ fill: '#fff', stroke: '#111', strokeWidth: 2, r: 5 }}
                                    activeDot={{ r: 8, fill: '#00C975' }}
                                >
                                    <LabelList
                                        dataKey="clicks"
                                        position="top"
                                        offset={15}
                                        className="fill-black font-extrabold text-[11px]"
                                        formatter={(value: number) => value > 0 ? value : "0"}
                                    />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-[#F0F2F5] p-6 rounded-2xl border border-white/50">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Last hour clicks</p>
                            <p className="text-4xl font-black text-black">20</p>
                        </div>

                        <div className="bg-[#F0F2F5] p-6 rounded-2xl border border-white/50">
                            <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-4">Top Performing Tags</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl text-xs font-bold shadow-sm">
                                    <span className="text-gray-600">Banner ads</span>
                                    <span className="text-[#00C975]">2078</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl text-xs font-bold shadow-sm">
                                    <span className="text-gray-600">Thread</span>
                                    <span className="text-[#00C975]">1493</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl text-xs font-bold shadow-sm">
                                    <span className="text-gray-600">Signature</span>
                                    <span className="text-[#00C975]">573</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom List - Fixed for Mobile */}
                <div className="mt-10 space-y-3">
                    <div className="hidden md:grid grid-cols-12 gap-4 text-[10px] font-black text-gray-400 px-6 uppercase tracking-[0.2em] mb-4">
                        <div className="col-span-3">All tags</div>
                        <div className="col-span-3">destination URL</div>
                        <div className="col-span-2">last click</div>
                        <div className="col-span-2">Total click</div>
                        <div className="col-span-2 text-right">smart links</div>
                    </div>

                    {/* Row 1 */}
                    <div className="bg-white p-4 md:p-5 rounded-[1.25rem] flex flex-col md:grid md:grid-cols-12 gap-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-gray-100/50">
                        <div className="col-span-3 flex items-center gap-4">
                            <div className="bg-[#111] p-2.5 rounded-xl shadow-lg">
                                <Tag className="w-4 h-4 text-[#00C975] transform rotate-90" />
                            </div>
                            <div>
                                <p className="font-extrabold text-black text-sm tracking-tight">Thread Link</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Campaign A</p>
                            </div>
                        </div>
                        <div className="col-span-3 flex items-center text-xs text-gray-400 font-medium truncate md:border-l md:pl-4">
                            mystore.com/summer-sale
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-[11px] font-bold text-gray-500">
                            6m ago
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-sm font-black text-black">
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#00C975]" /> 1,493
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-3">
                            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-black bg-[#F4F6F9] px-3 py-1.5 rounded-lg border border-gray-200">
                                <Copy className="w-3 h-3" /> frm.io/oisns
                            </div>
                            <Button size="sm" className="h-9 px-4 text-xs bg-black text-white hover:bg-black/80 rounded-xl font-bold">Edit</Button>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="bg-white p-4 md:p-5 rounded-[1.25rem] flex flex-col md:grid md:grid-cols-12 gap-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-gray-100/50">
                        <div className="col-span-3 flex items-center gap-4">
                            <div className="bg-[#111] p-2.5 rounded-xl shadow-lg">
                                <Tag className="w-4 h-4 text-[#00C975] transform rotate-90" />
                            </div>
                            <div>
                                <p className="font-extrabold text-black text-sm tracking-tight">Banner Promo</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Twitter Ads</p>
                            </div>
                        </div>
                        <div className="col-span-3 flex items-center text-xs text-gray-400 font-medium truncate md:border-l md:pl-4">
                            app.frome.io/pricing
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-[11px] font-bold text-gray-500">
                            2h ago
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-sm font-black text-black">
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#00C975]" /> 572
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-3">
                            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-black bg-[#F4F6F9] px-3 py-1.5 rounded-lg border border-gray-200">
                                <Copy className="w-3 h-3" /> frm.io/rdins
                            </div>
                            <Button size="sm" className="h-9 px-4 text-xs bg-black text-white hover:bg-black/80 rounded-xl font-bold">Edit</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

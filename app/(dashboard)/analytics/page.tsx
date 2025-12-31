import { ArrowUpRight, Clock, MousePointer2, Users, BarChart3, Globe, Laptop, Smartphone, Monitor, Navigation2, MapPin, Share2 } from "lucide-react"
import { AnalyticsGraph } from "@/components/dashboard/analytics-graph"
import { getDashboardData } from "@/lib/data"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { toSentenceCase } from "@/lib/utils"
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AnalyticsPage({
    searchParams
}: {
    searchParams: Promise<{ from?: string; to?: string }>
}) {
    const params = await searchParams
    const startDate = params.from ? new Date(params.from) : undefined
    const endDate = params.to ? new Date(params.to) : undefined

    const data = await getDashboardData(startDate, endDate)

    if (!data) return null

    const { chartData, stats, demographics } = data

    const heroStats = [
        {
            label: "Total clicks",
            value: stats.total.toLocaleString(),
            icon: MousePointer2,
        },
        {
            label: "Unique visitors",
            value: (stats as any).uniqueVisitors?.toLocaleString() || "0",
            icon: Users,
        },
        {
            label: "Avg. daily clicks",
            value: (stats as any).avgDailyClicks || "0",
            icon: BarChart3,
        },
        {
            label: "Top source",
            value: (stats as any).topReferrer || "Direct",
            icon: Share2,
        }
    ]

    return (
        <RealtimeDashboard>
            <div className="space-y-12 pb-20 bg-white min-h-screen">
                {/* Header & Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                    <div className="space-y-1">
                        <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">Analytics overview</h2>
                        <p className="text-[13px] md:text-sm font-medium text-gray-400">Deep dive into your link performance and audience</p>
                    </div>
                    <DateRangePicker align="right" />
                </div>

                {/* Hero Metrics - 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {heroStats.map((stat) => (
                        <div key={stat.label} className="bg-[#F8F9FA] p-3 rounded-xl border border-[#F1F3F5] h-full">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#F1F3F5]/50 h-full flex flex-col justify-between">
                                <div className="bg-[#E7F6F0] p-3 rounded-xl w-fit mb-4">
                                    <stat.icon className="w-5 h-5 text-[#00C975]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-black truncate tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Chart - Full Width */}
                <div className="px-4">
                    <div className="bg-[#F8F9FA] rounded-xl p-8 md:p-10 border border-[#F1F3F5] flex flex-col min-h-[500px]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-base font-bold text-black">Click performance over time</h3>
                                <p className="text-sm font-medium text-gray-400">Showing data from {startDate?.toLocaleDateString() || 'last 7 days'}</p>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-xl border border-[#F1F3F5] text-xs font-bold text-[#00C975] uppercase tracking-widest shadow-sm">
                                Real-time
                            </div>
                        </div>
                        <div className="flex-1">
                            <AnalyticsGraph initialData={chartData} startDate={startDate} endDate={endDate} />
                        </div>
                    </div>
                </div>

                {/* Deep Data Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                    {/* Left Column: Geography */}
                    <div className="space-y-8">
                        {/* Top Countries */}
                        <div className="bg-[#F8F9FA] p-8 rounded-xl border border-[#F1F3F5]">
                            <div className="flex items-center gap-3 mb-8 px-2">
                                <Globe className="w-5 h-5 text-gray-400" />
                                <h3 className="text-sm font-bold text-black uppercase tracking-widest">Top countries</h3>
                            </div>
                            <div className="space-y-3">
                                {demographics.country.map((item: any) => (
                                    <div key={item.name} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-[#F1F3F5]/50">
                                        <span className="text-black font-semibold text-sm">{item.name}</span>
                                        <div className="flex items-center gap-6">
                                            <span className="text-gray-400 font-bold text-[12px]">{item.count}</span>
                                            <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold min-w-[3.5rem] text-center">
                                                {item.pct}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Cities */}
                        <div className="bg-[#F8F9FA] p-8 rounded-xl border border-[#F1F3F5]">
                            <div className="flex items-center gap-3 mb-8 px-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <h3 className="text-sm font-bold text-black uppercase tracking-widest">Top cities</h3>
                            </div>
                            <div className="space-y-3">
                                {(demographics as any).city?.map((item: any) => (
                                    <div key={item.name} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-[#F1F3F5]/50">
                                        <span className="text-black font-semibold text-sm">{item.name}</span>
                                        <div className="flex items-center gap-6">
                                            <span className="text-gray-400 font-bold text-[12px]">{item.count}</span>
                                            <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold min-w-[3.5rem] text-center">
                                                {item.pct}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Technology */}
                    <div className="space-y-8">
                        <div className="bg-[#F8F9FA] p-8 rounded-xl border border-[#F1F3F5]">
                            <div className="flex items-center gap-3 mb-8 px-2">
                                <Laptop className="w-5 h-5 text-gray-400" />
                                <h3 className="text-sm font-bold text-black uppercase tracking-widest">Technology Stack</h3>
                            </div>

                            <div className="space-y-8">
                                {/* Devices */}
                                <div className="space-y-3">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-2 italic">Devices</p>
                                    {demographics.device.map((item: any) => (
                                        <div key={item.name} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-[#F1F3F5]/50">
                                            <span className="text-black font-semibold text-sm">{item.name}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-400 font-bold text-[11px]">{item.count}</span>
                                                <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold min-w-[3.2rem] text-center">
                                                    {item.pct}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Browsers */}
                                <div className="space-y-3">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-2 italic">Browsers</p>
                                    {demographics.browser.map((item: any) => (
                                        <div key={item.name} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-[#F1F3F5]/50">
                                            <span className="text-black font-semibold text-sm">{item.name}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-400 font-bold text-[11px]">{item.count}</span>
                                                <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold min-w-[3.2rem] text-center">
                                                    {item.pct}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* OS */}
                                <div className="space-y-3">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-2 italic">Operating Systems</p>
                                    {demographics.os.map((item: any) => (
                                        <div key={item.name} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-[#F1F3F5]/50">
                                            <span className="text-black font-semibold text-sm">{item.name}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-400 font-bold text-[11px]">{item.count}</span>
                                                <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold min-w-[3.2rem] text-center">
                                                    {item.pct}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Traffic Sources (Referrers) - Full Width */}
                <div className="px-4">
                    <div className="bg-[#F8F9FA] p-8 md:p-10 rounded-xl border border-[#F1F3F5]">
                        <div className="flex items-center gap-3 mb-10 px-2">
                            <Share2 className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-bold text-black uppercase tracking-widest">Traffic sources & referrers</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {demographics.referrers?.map((item: any) => (
                                <div key={item.name} className="bg-white p-6 rounded-xl shadow-sm border border-[#F1F3F5]/50 flex items-center justify-between group hover:border-[#00C975]/30 transition-all">
                                    <div className="space-y-1">
                                        <span className="text-black font-bold text-sm block">{item.name}</span>
                                        <span className="text-[12px] font-medium text-gray-400">Visitor counts: {item.count}</span>
                                    </div>
                                    <div className="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold min-w-[4rem] text-center group-hover:bg-[#00C975] transition-colors">
                                        {item.pct}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </RealtimeDashboard>
    )
}

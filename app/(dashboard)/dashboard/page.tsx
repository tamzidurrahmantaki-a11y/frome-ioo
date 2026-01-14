import { Button } from "@/components/ui/button"
import { Calendar, Tag, Clock, Navigation2, Search, MousePointer2, PieChart } from "lucide-react"
import { AnalyticsGraph } from "@/components/dashboard/analytics-graph"
import { getDashboardData } from "@/lib/data"
import { RealtimeLinkList } from "@/components/dashboard/realtime-link-list"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard"
import { EmptyState } from "@/components/dashboard/empty-state"

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * DashboardPage - Main view for link management and analytics.
 */
export default async function DashboardPage({
    searchParams
}: {
    searchParams: Promise<{ from?: string; to?: string }>
}) {
    const params = await searchParams
    const startDate = params.from ? new Date(params.from) : undefined
    const endDate = params.to ? new Date(params.to) : undefined

    const data = await getDashboardData(startDate, endDate)

    if (!data) return null

    const { links, chartData, stats, demographics } = data

    return (
        <RealtimeDashboard>
            <div className="space-y-12 pb-20 bg-background">
                {/* Header Area */}
                <div className="px-4">
                    <div className="flex justify-start mb-6">
                        <DateRangePicker align="left" />
                    </div>

                    {/* Top Section: Real-time Graph and Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        <div className="lg:col-span-8 bg-card rounded-xl p-4 md:p-8 border border-border">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Growth Analytics</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#00C975] rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                            <AnalyticsGraph initialData={chartData} startDate={startDate} endDate={endDate} />
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-card p-6 md:p-8 rounded-xl border border-border flex flex-col justify-center">
                                <p className="text-sm font-semibold text-foreground mb-1">Last hour clicks:</p>
                                <p className="text-4xl md:text-6xl font-semibold text-foreground tracking-tighter">{stats.lastHour}</p>
                            </div>

                            <div className="bg-card p-6 md:p-8 rounded-xl border border-border flex-1">
                                <p className="text-sm font-semibold text-foreground mb-6">Top performing tags:</p>
                                <div className="space-y-3">
                                    {links.slice(0, 3).map((link) => (
                                        <div key={link.id} className="bg-background p-4 rounded-lg flex justify-between items-center shadow-sm border border-border/50">
                                            <span className="text-sm font-medium text-foreground truncate max-w-[150px]">{link.title || link.short_slug}</span>
                                            <span className="text-sm font-semibold text-muted-foreground">{link.clicks}</span>
                                        </div>
                                    ))}
                                    {links.length === 0 && (
                                        <EmptyState
                                            title="No links"
                                            description="Your top performing links will appear here once you start tracking."
                                            icon={Search}
                                            className="py-8 bg-background"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Links Management Section */}
                <div className="px-4 space-y-4">
                    {/* Table Header Labels - Sentence Case & Premium Spacing */}
                    <div className="grid grid-cols-12 gap-4 text-[11px] font-bold text-muted-foreground px-8 tracking-tight">
                        <div className="col-span-12 md:col-span-3">All tags</div>
                        <div className="hidden md:block col-span-1">Destination url</div>
                        <div className="hidden lg:block col-span-2">Last click</div>
                        <div className="hidden lg:block col-span-1">Total click</div>
                        <div className="hidden xl:block col-span-2">Created date</div>
                        <div className="hidden xl:block col-span-3 text-right px-4">Smart links</div>
                    </div>

                    <RealtimeLinkList initialLinks={links} />
                </div>

                {/* Direct Demographics from Database */}
                <div className="px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Country', data: demographics.country },
                            { title: 'Device', data: demographics.device },
                            { title: 'Operating system', data: demographics.os },
                            { title: 'Browser', data: demographics.browser }
                        ].map((section) => (
                            <div key={section.title} className="bg-card p-6 md:p-8 rounded-xl border border-border">
                                <p className="text-sm font-bold text-foreground mb-6 md:mb-10 px-2">{section.title}</p>
                                <div className="space-y-2">
                                    {section.data.map((item) => (
                                        <div key={item.name} className="bg-background p-3.5 rounded-lg flex items-center justify-between shadow-sm border border-border/50 group hover:border-foreground/10 transition-colors">
                                            <span className="text-foreground font-medium text-[13px] truncate max-w-[100px]">{item.name}</span>
                                            <div className="flex items-center gap-6">
                                                <span className="text-muted-foreground font-medium text-[12px]">{item.count}</span>
                                                <div className="bg-foreground text-background px-3.5 py-1.5 rounded-full text-[11px] font-bold min-w-[3.2rem] text-center">
                                                    {item.pct}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {section.data.length === 0 && (
                                        <EmptyState
                                            title={`No ${section.title.toLowerCase()} data`}
                                            description="Start collecting clicks to see demographic insights."
                                            icon={PieChart}
                                            className="py-10 bg-background"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </RealtimeDashboard>
    )
}

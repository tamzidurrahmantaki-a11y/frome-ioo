import { Share2, MessageCircle, Send, Users, BarChart3, Globe, Mail, Shield, Zap, Disc, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SupportPage() {
    const helpItems = [
        {
            title: "How To Create A Tracking Link",
            description: "Learn How To Generate Your Unique Tracking Link In Seconds And Start Monitoring Traffic Instantly."
        },
        {
            title: "How To Analyze Traffic Data",
            description: "Understand Key Metrics Like Clicks, Referrers, And Locations To Make Smarter Decisions Based On Your Link Performance."
        },
        {
            title: "Link Expiration Or Deletion",
            description: "Set An Expiration Date Or Delete Links Anytime To Stay In Full Control Of Your Shared URLs."
        },
        {
            title: "UTM Parameters Explained",
            description: "Discover How To Use UTM Tags To Track Campaigns Across Platforms And Gain Deeper Marketing Insights."
        }
    ]

    const faqs = [
        "How Accurate Is The Traffic Data?",
        "What Kind Of Devices/Browsers Are Supported?",
        "Can I Track Traffic From Social Media?",
        "Is There A Link Limit In The Free Plan?",
        "Can I Integrate This With Google Analytics?"
    ]

    return (
        <div className="max-w-[1200px] space-y-20 pb-20 bg-white min-h-screen font-sans">
            {/* Help Center Section */}
            <div className="px-4 space-y-8">
                <h1 className="text-2xl font-bold text-black tracking-tight">Help Center</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {helpItems.map((item, i) => (
                        <div key={i} className={i === 3 ? "md:col-start-1" : ""}>
                            <div className="bg-[#F8F9FA] p-8 rounded-xl h-full border border-transparent hover:border-[#F1F3F5] transition-all">
                                <h3 className="text-sm font-bold text-black mb-3 leading-tight">{item.title}</h3>
                                <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="px-4 space-y-6">
                <h2 className="text-2xl font-bold text-black tracking-tight">FAQ</h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-[#F8F9FA] p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <p className="text-[12px] font-bold text-black/80">{faq}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Ticket Section */}
            <div className="px-4 space-y-10">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-black tracking-tight">Support Ticket Form</h2>
                    <p className="text-gray-400 font-medium text-sm">
                        We're Here To Help You 24/7. If You Have Questions, Our Team Is Always Ready.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-black">Id Name :</label>
                                <Input
                                    placeholder="Your Name"
                                    className="bg-[#F8F9FA] border-none h-14 rounded-xl px-6 focus-visible:ring-1 focus-visible:ring-black placeholder:text-gray-300 font-medium text-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-black">Gmail :</label>
                                <Input
                                    placeholder="gmail@gmail.com"
                                    className="bg-[#F8F9FA] border-none h-14 rounded-xl px-6 focus-visible:ring-1 focus-visible:ring-black placeholder:text-gray-300 font-medium text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[14px] font-bold text-black">Message :</label>
                            <Textarea
                                placeholder="send your massage"
                                className="bg-[#F8F9FA] border-none min-h-[180px] rounded-xl p-6 focus-visible:ring-1 focus-visible:ring-black placeholder:text-gray-300 font-medium text-sm resize-none"
                            />
                        </div>
                        <Button className="w-40 bg-black hover:bg-black/90 text-white rounded-lg h-10 font-bold text-xs">
                            Send
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="px-4 space-y-6">
                <h2 className="text-2xl font-bold text-black tracking-tight">Contact</h2>
                <div className="flex items-center gap-6">
                    <button className="text-black hover:scale-110 transition-transform">
                        <Disc className="w-6 h-6 fill-current" />
                    </button>
                    <button className="text-black hover:scale-110 transition-transform">
                        <Send className="w-6 h-6" />
                    </button>
                    <button className="text-black hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}

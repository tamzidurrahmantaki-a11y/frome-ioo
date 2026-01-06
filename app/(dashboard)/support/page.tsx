"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, BookOpen, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

// FAQ Data
const faqs = [
    { question: "How Accurate Is The Traffic Data?", answer: "Our tracking system uses advanced fingerprinting and server-side analysis to ensure 99.9% accuracy, filtering out bots and crawlers." },
    { question: "What Kind Of Devices/Browsers Are Supported?", answer: "We support tracking across all modern browsers (Chrome, Safari, Firefox, Edge) and devices including Desktop, Mobile, and Tablets." },
    { question: "Can I Track Traffic From Social Media?", answer: "Yes! Frome.io works perfectly on Instagram, Twitter, TikTok, and LinkedIn bios or posts." },
    { question: "Is There A Link Limit In The Free Plan?", answer: "The Free plan allows up to 50 active links. You can upgrade to Pro for unlimited link generation." },
    { question: "Can I Integrate This With Google Analytics?", answer: "Currently, we offer standalone analytics, but UTM parameter support allows you to feed data into GA4 seamlessly." },
]

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <div className="max-w-6xl mx-auto space-y-20 pb-20">

            {/* Help Center Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-black">Help Center</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "How To Create A Tracking Link", desc: "Learn How To Generate Your Unique Tracking Link In Seconds And Start Monitoring Traffic Instantly." },
                        { title: "How To Analyze Traffic Data", desc: "Understand Key Metrics Like Clicks, Referrers, And Locations To Make Smarter Decisions Based On Your Link Performance." },
                        { title: "Link Expiration Or Deletion", desc: "Set An Expiration Date Or Delete Links Anytime To Stay In Full Control Of Your Shared URLs." },
                        { title: "UTM Parameters Explained", desc: "Discover How To Use UTM Tags To Track Campaigns Across Platforms And Gain Deeper Marketing Insights." },
                    ].map((card, i) => (
                        <div key={i} className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-xl h-full hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                            <h3 className="font-bold text-base text-black mb-3 leading-tight">{card.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-black">Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-[#fcfcfc] border border-gray-100 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-sm text-gray-800">{faq.question}</span>
                                {openFaq === index ? (
                                    <ChevronUp className="w-5 h-5 text-[#00C975] shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                )}
                            </button>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out px-6 bg-white",
                                    openFaq === index ? "max-h-40 py-5 opacity-100 border-t border-gray-100" : "max-h-0 py-0 opacity-0"
                                )}
                            >
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Still Need Help? Section */}
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-black">Still Need Help?</h2>
                    <p className="text-gray-500 text-sm">Choose the best way to get in touch with our support team</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Email Support Card */}
                    <div className="group bg-gradient-to-br from-[#fcfcfc] to-white border border-gray-100 p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="w-14 h-14 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-6 group-hover:bg-[#00C975]/20 transition-colors">
                            <Mail className="w-7 h-7 text-[#00C975]" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-lg text-black mb-2">Email Support</h3>
                        <p className="text-sm text-gray-500 mb-4">Get help via email within 24 hours</p>
                        <a href="mailto:support@frome.io" className="text-sm font-semibold text-[#00C975] hover:underline">
                            support@frome.io
                        </a>
                    </div>

                    {/* Live Chat Card */}
                    <div className="group bg-gradient-to-br from-[#fcfcfc] to-white border border-gray-100 p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="w-14 h-14 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-6 group-hover:bg-[#00C975]/20 transition-colors">
                            <MessageSquare className="w-7 h-7 text-[#00C975]" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-lg text-black mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-500 mb-4">Instant support available 24/7</p>
                        <button className="text-sm font-semibold text-[#00C975] hover:underline">
                            Start Chat →
                        </button>
                    </div>

                    {/* Documentation Card */}
                    <div className="group bg-gradient-to-br from-[#fcfcfc] to-white border border-gray-100 p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="w-14 h-14 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-6 group-hover:bg-[#00C975]/20 transition-colors">
                            <BookOpen className="w-7 h-7 text-[#00C975]" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-lg text-black mb-2">Documentation</h3>
                        <p className="text-sm text-gray-500 mb-4">Comprehensive guides and tutorials</p>
                        <button className="text-sm font-semibold text-[#00C975] hover:underline">
                            View Docs →
                        </button>
                    </div>
                </div>
            </div>

            {/* Support Ticket Form */}
            <div className="space-y-10 border-t border-gray-100 pt-20">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-black">Submit A Support Ticket</h2>
                    <p className="text-gray-500 text-sm">We're Here To Help You 24/7. Our Team Will Respond As Soon As Possible.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
                    {/* Left Column: Inputs */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-black">Your Name</Label>
                            <Input
                                placeholder="John Doe"
                                className="bg-[#fcfcfc] border-gray-100 h-12 rounded-lg focus:border-[#00C975] focus:ring-[#00C975]"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-black">Email Address</Label>
                            <Input
                                type="email"
                                placeholder="john@example.com"
                                className="bg-[#fcfcfc] border-gray-100 h-12 rounded-lg focus:border-[#00C975] focus:ring-[#00C975]"
                            />
                        </div>
                    </div>

                    {/* Right Column: Message */}
                    <div className="space-y-3 h-full flex flex-col">
                        <Label className="text-sm font-bold text-black">Message</Label>
                        <textarea
                            placeholder="Describe your issue or question..."
                            className="flex-1 w-full bg-[#fcfcfc] border border-gray-100 rounded-lg p-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C975] focus:border-transparent min-h-[160px] md:min-h-0 resize-none"
                        />
                    </div>
                </div>

                <Button className="h-12 px-10 bg-black text-white font-bold rounded-lg hover:bg-black/90 transition-colors">
                    Send Message
                </Button>
            </div>
        </div>
    )
}

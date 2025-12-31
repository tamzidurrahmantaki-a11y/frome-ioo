"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Mail, User, ChevronDown, ChevronUp } from "lucide-react"
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
                        <div key={i} className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-xl h-full hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg text-black mb-3">{card.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-black">FAQ</h2>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-[#fcfcfc] border border-gray-100 rounded-lg overflow-hidden transition-all duration-200"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className="font-bold text-sm text-gray-800">{faq.question}</span>
                                {openFaq === index ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                            </button>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out px-5 bg-white",
                                    openFaq === index ? "max-h-40 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
                                )}
                            >
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Ticket Form */}
            <div className="space-y-10">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-black">Support Ticket Form</h2>
                    <p className="text-gray-500 text-sm">We're Here To Help You 24/7. If You Have Questions, Our Team Is Always Ready.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
                    {/* Left Column: Inputs */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-black">Id Name :</Label>
                            <Input
                                placeholder="Your Name"
                                className="bg-[#fcfcfc] border-gray-100 h-12 rounded-lg"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-black">Gmail :</Label>
                            <Input
                                placeholder="gmail@gmail.com"
                                className="bg-[#fcfcfc] border-gray-100 h-12 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right Column: Message */}
                    <div className="space-y-3 h-full flex flex-col">
                        <Label className="text-sm font-bold text-black">Message :</Label>
                        <textarea
                            placeholder="send your massage"
                            className="flex-1 w-full bg-[#fcfcfc] border border-gray-100 rounded-lg p-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 min-h-[160px] md:min-h-0 resize-none"
                        />
                    </div>
                </div>

                <Button className="h-11 px-10 bg-black text-white font-bold rounded-lg hover:bg-black/90">
                    Send
                </Button>
            </div>

            {/* Contact Footer */}
            <div className="space-y-6 border-t border-gray-100 pt-10">
                <h3 className="text-xl font-bold text-black">Contact</h3>
                <div className="flex gap-6">
                    <a href="#" className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gamepad-2"><line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="15" x2="15.01" y1="13" y2="13" /><line x1="18" x2="18.01" y1="11" y2="11" /><rect width="20" height="12" x="2" y="6" rx="2" /></svg>
                    </a>
                    <a href="#" className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                    </a>
                    <a href="#" className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

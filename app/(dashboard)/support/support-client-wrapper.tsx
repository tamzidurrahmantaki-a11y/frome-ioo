"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function SupportClientWrapper({ faqs }: { faqs: any[] }) {
    const [openFaq, setOpenFaq] = useState<string | null>(null)

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-black">Frequently Asked Questions</h2>
            <div className="space-y-3">
                {faqs.length > 0 ? (
                    faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-[#fcfcfc] border border-gray-100 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-sm text-gray-800">{faq.question}</span>
                                {openFaq === faq.id ? (
                                    <ChevronUp className="w-5 h-5 text-[#00C975] shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                )}
                            </button>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out px-6 bg-white",
                                    openFaq === faq.id ? "max-h-40 py-5 opacity-100 border-t border-gray-100" : "max-h-0 py-0 opacity-0"
                                )}
                            >
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No FAQs available yet.</p>
                )}
            </div>
        </div>
    )
}

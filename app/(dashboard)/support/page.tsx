import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, BookOpen, ChevronDown, ChevronUp, Link as LinkIcon, BarChart3, Trash2, Tag, ExternalLink } from "lucide-react"
import { SupportClientWrapper } from "./support-client-wrapper"
import { createClient } from "@/lib/supabase/server"

// Helper to map icon names to components
const IconMap: any = {
    Link: LinkIcon,
    BarChart: BarChart3,
    Trash: Trash2,
    Tag: Tag,
    Mail: Mail,
    MessageSquare: MessageSquare,
    BookOpen: BookOpen,
    HelpCircle: ExternalLink
}

export default async function SupportPage() {
    const supabase = await createClient()

    // parallel fetching
    const [cardsRes, faqsRes, contactsRes, settingsRes] = await Promise.all([
        supabase.from('support_cards').select('*').eq('is_active', true).order('order_index', { ascending: true }),
        supabase.from('faqs').select('*').eq('is_active', true).order('order_index', { ascending: true }),
        supabase.from('support_contacts').select('*').eq('is_active', true),
        supabase.from('support_settings').select('*')
    ])

    const cards = cardsRes.data || []
    const faqs = faqsRes.data || []
    const contacts = contactsRes.data || []
    const settings = settingsRes.data || []

    const rulesText = settings.find(s => s.setting_key === 'rules_text')?.setting_value

    // Process contacts for easier rendering
    const emailContact = contacts.find(c => c.contact_type === 'email')
    const chatContact = contacts.find(c => c.contact_type === 'live_chat')
    const docsContact = contacts.find(c => c.contact_type === 'documentation')

    return (
        <div className="max-w-6xl mx-auto space-y-20 pb-20">
            {/* Rules / Info Box if exists */}
            {rulesText && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Support Information</h3>
                        <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">{rulesText}</p>
                    </div>
                </div>
            )}

            {/* Help Center Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-black">Help Center</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.length > 0 ? (
                        cards.map((card, i) => {
                            const Icon = IconMap[card.icon_name || 'HelpCircle'] || ExternalLink
                            return (
                                <div key={card.id} className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-xl h-full hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-6">
                                        <Icon className="w-6 h-6 text-[#00C975]" />
                                    </div>
                                    <h3 className="font-bold text-base text-black mb-3 leading-tight">{card.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-gray-500">No help topics available.</p>
                    )}
                </div>
            </div>

            {/* FAQ Section (Client Component for Interactivity) */}
            <SupportClientWrapper faqs={faqs} />

            {/* Still Need Help? Section */}
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-black">Still Need Help?</h2>
                    <p className="text-gray-500 text-sm">Choose the best way to get in touch with our support team</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Email Support Card */}
                    {emailContact && (
                        <div className="group bg-gradient-to-br from-[#fcfcfc] to-white border border-gray-100 p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <div className="w-14 h-14 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-6 group-hover:bg-[#00C975]/20 transition-colors">
                                <Mail className="w-7 h-7 text-[#00C975]" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-lg text-black mb-2">{emailContact.label || 'Email Support'}</h3>
                            <p className="text-sm text-gray-500 mb-4">Get help via email within 24 hours</p>
                            <a href={`mailto:${emailContact.contact_value}`} className="text-sm font-semibold text-[#00C975] hover:underline">
                                {emailContact.contact_value}
                            </a>
                        </div>
                    )}

                    {/* Live Chat Card */}
                    {chatContact && (
                        <div className="group bg-gradient-to-br from-[#fcfcfc] to-white border border-gray-100 p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <div className="w-14 h-14 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-6 group-hover:bg-[#00C975]/20 transition-colors">
                                <MessageSquare className="w-7 h-7 text-[#00C975]" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-lg text-black mb-2">{chatContact.label || 'Live Chat'}</h3>
                            <p className="text-sm text-gray-500 mb-4">Instant support available 24/7</p>
                            <a href={chatContact.contact_value} target="_blank" className="text-sm font-semibold text-[#00C975] hover:underline">
                                Start Chat →
                            </a>
                        </div>
                    )}

                    {/* Documentation Card */}
                    {docsContact && (
                        <div className="group bg-gradient-to-br from-[#fcfcfc] to-white border border-gray-100 p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <div className="w-14 h-14 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-6 group-hover:bg-[#00C975]/20 transition-colors">
                                <BookOpen className="w-7 h-7 text-[#00C975]" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-lg text-black mb-2">{docsContact.label || 'Documentation'}</h3>
                            <p className="text-sm text-gray-500 mb-4">Comprehensive guides and tutorials</p>
                            <a href={docsContact.contact_value} target="_blank" className="text-sm font-semibold text-[#00C975] hover:underline">
                                View Docs →
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Support Ticket Form */}
            <div className="space-y-10 border-t border-gray-100 pt-20">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-black">Submit A Support Ticket</h2>
                    <p className="text-gray-500 text-sm">We're Here To Help You 24/7. Our Team Will Respond As Soon As Possible.</p>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
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

                    <div className="md:col-span-2">
                        <Button className="h-12 px-10 bg-black text-white font-bold rounded-lg hover:bg-black/90 transition-colors">
                            Send Message
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

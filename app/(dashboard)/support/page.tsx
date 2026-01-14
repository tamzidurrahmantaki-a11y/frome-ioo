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
                <div className="bg-card border border-border rounded-xl p-8 flex items-start gap-6 shadow-xl shadow-black/20">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <MessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg text-foreground tracking-tight">Support Information</h3>
                        <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">{rulesText}</p>
                    </div>
                </div>
            )}

            {/* Help Center Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Help Center</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.length > 0 ? (
                        cards.map((card, i) => {
                            const Icon = IconMap[card.icon_name || 'HelpCircle'] || ExternalLink
                            return (
                                <div key={card.id} className="bg-card border border-border p-8 rounded-xl h-full hover:shadow-lg hover:border-foreground/10 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-base text-foreground mb-3 leading-tight">{card.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-muted-foreground">No help topics available.</p>
                    )}
                </div>
            </div>

            {/* FAQ Section (Client Component for Interactivity) */}
            <SupportClientWrapper faqs={faqs} />

            {/* Still Need Help? Section */}
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Still Need Help?</h2>
                    <p className="text-muted-foreground text-sm">Choose the best way to get in touch with our support team</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Email Support Card */}
                    {emailContact && (
                        <div className="group bg-card border border-border p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Mail className="w-7 h-7 text-primary" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-2">{emailContact.label || 'Email Support'}</h3>
                            <p className="text-sm text-muted-foreground mb-4">Get help via email within 24 hours</p>
                            <a href={`mailto:${emailContact.contact_value}`} className="text-sm font-semibold text-primary hover:underline">
                                {emailContact.contact_value}
                            </a>
                        </div>
                    )}

                    {/* Live Chat Card */}
                    {chatContact && (
                        <div className="group bg-card border border-border p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="w-7 h-7 text-primary" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-2">{chatContact.label || 'Live Chat'}</h3>
                            <p className="text-sm text-muted-foreground mb-4">Instant support available 24/7</p>
                            <a href={chatContact.contact_value} target="_blank" className="text-sm font-semibold text-primary hover:underline">
                                Start Chat →
                            </a>
                        </div>
                    )}

                    {/* Documentation Card */}
                    {docsContact && (
                        <div className="group bg-card border border-border p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <BookOpen className="w-7 h-7 text-primary" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-2">{docsContact.label || 'Documentation'}</h3>
                            <p className="text-sm text-muted-foreground mb-4">Comprehensive guides and tutorials</p>
                            <a href={docsContact.contact_value} target="_blank" className="text-sm font-semibold text-primary hover:underline">
                                View Docs →
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Support Ticket Form */}
            <div className="space-y-10 border-t border-border pt-20">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Submit A Support Ticket</h2>
                    <p className="text-muted-foreground text-sm">We're Here To Help You 24/7. Our Team Will Respond As Soon As Possible.</p>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
                    {/* Left Column: Inputs */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-foreground">Your Name</Label>
                            <Input
                                placeholder="John Doe"
                                className="bg-card border-border h-12 rounded-lg focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-foreground">Email Address</Label>
                            <Input
                                type="email"
                                placeholder="john@example.com"
                                className="bg-card border-border h-12 rounded-lg focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Right Column: Message */}
                    <div className="space-y-3 h-full flex flex-col">
                        <Label className="text-sm font-bold text-foreground">Message</Label>
                        <textarea
                            placeholder="Describe your issue or question..."
                            className="flex-1 w-full bg-card border border-border rounded-lg p-4 text-sm placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[160px] md:min-h-0 resize-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Button className="h-12 px-10 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
                            Send Message
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

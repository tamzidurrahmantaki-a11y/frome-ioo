import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupportCards } from "@/app/actions/admin/manage-support-cards"
import { getFaqs } from "@/app/actions/admin/manage-faqs"
import { getContacts } from "@/app/actions/admin/manage-contacts"
import { getSettings } from "@/app/actions/admin/manage-settings"
import { SupportCardEditor } from "@/components/admin/support-card-editor"
import { FaqEditor } from "@/components/admin/faq-editor"
import { ContactListEditor } from "@/components/admin/contact-list-editor"
import { SettingsEditor } from "@/components/admin/settings-editor"
import { FileText, HelpCircle, MessageSquare, Settings } from "lucide-react"

export default async function ContentPage() {
    // Fetch all data in parallel
    const [cardsRes, faqsRes, contactsRes, settingsRes] = await Promise.all([
        getSupportCards(),
        getFaqs(),
        getContacts(),
        getSettings()
    ])

    const cards = cardsRes.success ? cardsRes.data || [] : []
    const faqs = faqsRes.success ? faqsRes.data || [] : []
    const contacts = contactsRes.success ? contactsRes.data || [] : []
    const settings = settingsRes.success ? settingsRes.data || [] : []

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2 italic uppercase">Content Management</h1>
                <p className="text-muted-foreground font-medium">Manage support page content and platform features.</p>
            </div>

            <Tabs defaultValue="help-center" className="w-full">
                <TabsList className="bg-muted/50 border border-border/50 p-1.5 rounded-2xl w-full md:w-auto grid grid-cols-2 md:inline-flex h-auto gap-1">
                    <TabsTrigger value="help-center" className="rounded-xl px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all">
                        <FileText className="w-4 h-4 mr-2" />
                        Help Center
                    </TabsTrigger>
                    <TabsTrigger value="faqs" className="rounded-xl px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        FAQs
                    </TabsTrigger>
                    <TabsTrigger value="contacts" className="rounded-xl px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contacts
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-xl px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    <TabsContent value="help-center" className="space-y-6 focus-visible:outline-none">
                        <SupportCardEditor cards={cards} />
                    </TabsContent>

                    <TabsContent value="faqs" className="space-y-6 focus-visible:outline-none">
                        <FaqEditor faqs={faqs} />
                    </TabsContent>

                    <TabsContent value="contacts" className="space-y-6 focus-visible:outline-none">
                        <ContactListEditor contacts={contacts} />
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6 focus-visible:outline-none">
                        <SettingsEditor section="general" settings={settings} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

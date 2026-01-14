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
                <h1 className="text-3xl font-bold text-black mb-2">Content Management</h1>
                <p className="text-gray-500">Manage support page content and settings</p>
            </div>

            <Tabs defaultValue="help-center" className="w-full">
                <TabsList className="bg-white border border-gray-100 p-1 rounded-xl w-full md:w-auto grid grid-cols-2 md:inline-flex">
                    <TabsTrigger value="help-center" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Help Center
                    </TabsTrigger>
                    <TabsTrigger value="faqs" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        FAQs
                    </TabsTrigger>
                    <TabsTrigger value="contacts" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contacts
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white">
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
                        <SettingsEditor settings={settings} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

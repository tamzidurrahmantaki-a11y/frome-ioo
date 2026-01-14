import { FaqEditor } from "@/components/admin/faq-editor"
import { getFaqs } from "@/app/actions/admin/manage-faqs"

export const dynamic = 'force-dynamic'

export default async function AdminSupportPage() {
    const { data: faqs } = await getFaqs()

    // Ensure faqs is an array
    const faqList = Array.isArray(faqs) ? faqs : []

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-light tracking-tight text-black dark:text-white mb-2">Support Center</h1>
                <p className="text-gray-500 dark:text-gray-400 font-light">Manage FAQs and Help Content.</p>
            </div>

            <FaqEditor faqs={faqList} />
        </div>
    )
}

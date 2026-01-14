import { getPayments } from '@/app/actions/admin/manage-payments'
import { PaymentTable } from '@/components/admin/payment-table'

export default async function PaymentsPage() {
    const result = await getPayments()
    const payments = result.success ? result.data || [] : []

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">Payments & Subscriptions</h1>
                <p className="text-gray-500">Monitor crypto transactions and manage user plans</p>
            </div>

            <PaymentTable payments={payments as any[]} />
        </div>
    )
}

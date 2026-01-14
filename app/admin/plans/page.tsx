import { PlansManager } from '@/components/admin/plans-manager'
import { getPlans } from '@/app/actions/admin/manage-plans'

export const dynamic = 'force-dynamic'

export default async function AdminPlansPage() {
    const { data: plans } = await getPlans()

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-light tracking-tight text-black dark:text-white mb-2">Subscription Plans</h1>
                <p className="text-gray-500 dark:text-gray-400 font-light">Manage your pricing tiers and features.</p>
            </div>

            <PlansManager initialPlans={plans || []} />
        </div>
    )
}

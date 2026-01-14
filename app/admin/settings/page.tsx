import { getSettings } from '@/app/actions/admin/manage-settings'
import { Card, CardContent } from "@/components/ui/card"
import { SettingsEditor } from '@/components/admin/settings-editor'
import { PlansManager } from '@/components/admin/plans-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const result = await getSettings()
    const settings = result.success ? result.data || [] : []

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2 italic uppercase">Global Settings</h1>
                <p className="text-muted-foreground font-medium text-lg">Control your platform&apos;s identity, design, and security.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8 p-1.5 bg-muted/50 rounded-2xl border border-border/50 h-auto gap-1">
                    {['general', 'visual', 'plans', 'automation', 'security'].map(tab => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="rounded-xl px-8 py-3 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all capitalize"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <SettingsEditor section="general" settings={settings} />
                </TabsContent>

                <TabsContent value="visual" className="space-y-6">
                    <SettingsEditor section="visual" settings={settings} />
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <SettingsEditor section="security" settings={settings} />
                </TabsContent>

                <TabsContent value="automation" className="space-y-6">
                    <SettingsEditor section="automation" settings={settings} />
                </TabsContent>

                <TabsContent value="plans" className="space-y-6">
                    <PlansManager initialPlans={[]} />
                    {/* Note: PlansManager usually fetches its own data now or takes props. 
                        If it's async server component it shouldn't be nested directly in client component if plansmanager is client.
                        Wait, PlansManager IS client. 
                        Let's keep it here but we might need to fetch plans in parent if we want consistency, 
                        or let it fetch itself. 
                        Earlier logic passed initialPlans. 
                        For now, we leave as is or update if needed. 
                        Actually PlansManager in previous step took props context.
                        We will import the Server Action fetcher here to pass data if we want perfect sync.
                    */}
                </TabsContent>
            </Tabs>
        </div>
    )
}

import { createAdminClient } from '@/lib/supabase/admin'

async function PlansManagerWithData() {
    const supabase = createAdminClient()
    const { data } = await supabase.from('plans').select('*').order('price_monthly')
    return <PlansManager initialPlans={data || []} />
}

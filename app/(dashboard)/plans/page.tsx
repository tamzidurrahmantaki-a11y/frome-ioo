import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function PlansPage() {
    const supabase = await createClient()

    const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .order('price_monthly', { ascending: true })

    return (
        <div className="max-w-6xl mx-auto space-y-16 pb-20 mt-10">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-foreground tracking-tight">Simple, Transparent Pricing</h2>
                <p className="text-lg font-medium text-muted-foreground">Choose the plan that's right for your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(plans || []).map((plan) => (
                    <div key={plan.id} className={`relative p-10 rounded-xl border ${plan.is_popular ? 'border-primary bg-card shadow-[0_0_40px_rgba(0,201,117,0.05)]' : 'border-border bg-card'} flex flex-col`}>
                        {plan.is_popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                                Most Popular
                            </div>
                        )}
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{plan.name}</p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-black text-foreground">${plan.price_monthly}</span>
                            <span className="text-muted-foreground font-medium">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {plan.features.map((f: string) => (
                                <li key={f} className="text-sm font-medium text-muted-foreground flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,201,117,0.5)]" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${plan.is_popular ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                            Choose {plan.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

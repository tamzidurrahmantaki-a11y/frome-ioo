export default function PlansPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-16 pb-20 mt-10">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-black tracking-tight">Simple, Transparent Pricing</h2>
                <p className="text-lg font-medium text-gray-400">Choose the plan that's right for your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: 'Free', price: '$0', features: ['50 Links/mo', 'Basic Analytics', '7 Days History'] },
                    { name: 'Pro', price: '$19', features: ['Unlimited Links', 'Advanced Analytics', '30 Days History', 'Custom Domains'], featured: true },
                    { name: 'Business', price: '$49', features: ['Team Collaboration', 'API Access', 'Enterprise Analytics', 'Dedicated Support'] }
                ].map((plan) => (
                    <div key={plan.name} className={`relative p-10 rounded-xl border ${plan.featured ? 'border-black bg-white shadow-2xl' : 'border-gray-100 bg-[#fcfcfc]'} flex flex-col`}>
                        {plan.featured && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{plan.name}</p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-black text-black">{plan.price}</span>
                            <span className="text-gray-400 font-medium">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {plan.features.map(f => (
                                <li key={f} className="text-sm font-medium text-gray-600 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${plan.featured ? 'bg-black text-white hover:bg-black/90' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                            Choose {plan.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

'use client'

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Loader2, Copy, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function TrackInput() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (!user) {
            router.push('/login?mode=signup')
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto mt-10 space-y-4">
            <form onSubmit={handleAction} className="relative flex items-center group">
                <input
                    type="text"
                    required
                    placeholder="paste your link here..."
                    className="w-full h-16 pl-6 pr-36 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#00C975]/30 transition-all text-lg shadow-2xl backdrop-blur-sm"
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-2 h-12 px-10 bg-[#00C975] hover:bg-[#00C975]/90 text-black font-bold rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(0,201,117,0.2)]"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track Now'}
                </Button>
            </form>

            <div className="flex items-center justify-center gap-6 mt-4 opacity-40">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
                    <CheckCircle2 className="w-3 h-3 text-[#00C975]" />
                    Real-time
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
                    <CheckCircle2 className="w-3 h-3 text-[#00C975]" />
                    Anonymous
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
                    <CheckCircle2 className="w-3 h-3 text-[#00C975]" />
                    Instant
                </div>
            </div>
        </div>
    )
}

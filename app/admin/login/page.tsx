'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminLogin } from './actions'
import { toast } from 'sonner' // Assuming sonner is installed as per package.json

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await adminLogin(formData)

        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            setLoading(false)
        } else if (result?.success) {
            toast.success('Welcome back, Owner.')
            router.push('/admin')
            router.refresh()
        } else {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 selection:bg-primary selection:text-primary-foreground">
            <div className="w-full max-w-md space-y-10 rounded-3xl border border-border/50 bg-card p-12 shadow-2xl shadow-black/40 animate-in fade-in zoom-in duration-700">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tighter italic uppercase text-foreground">Admin Portal</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">
                        Secure Authentication System
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Owner Email"
                            required
                            className="bg-background/50 border-border/40 text-foreground placeholder:text-muted-foreground/20 h-12 rounded-xl focus-visible:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="password" title="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="bg-background/50 border-border/40 text-foreground placeholder:text-muted-foreground/20 h-12 rounded-xl focus-visible:ring-primary/20"
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/50">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-[11px] tracking-[0.2em] rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Access Dashboard"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

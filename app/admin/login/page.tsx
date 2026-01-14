"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // Check if user is admin
            if (data.user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', data.user.id)
                    .single()

                if (profile?.role !== 'admin') {
                    await supabase.auth.signOut()
                    toast.error("Access denied. Admin privileges required.")
                    setLoading(false)
                    return
                }

                toast.success("Welcome back, Admin")
                router.push('/admin')
                router.refresh()
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to login")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#00C975]/20">
                        <ShieldCheck className="w-8 h-8 text-[#00C975]" />
                    </div>
                    <h1 className="text-2xl font-bold text-black">Admin Portal</h1>
                    <p className="text-gray-500 mt-2 text-sm">Secure access for platform management</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            placeholder="admin@frome.io"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 border-gray-200 focus:border-black focus:ring-black"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Password</Label>
                        </div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 border-gray-200 focus:border-black focus:ring-black"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-black text-white hover:bg-black/90 font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Access Dashboard
                    </Button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                        ← Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    )
}

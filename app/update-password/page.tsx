'use client'

import React, { useState, Suspense } from 'react'
import Link from "next/link"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Lock, KeyRound } from 'lucide-react'
import { toast } from 'sonner'

function UpdatePasswordForm() {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setLoading(false)
            return
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            })

            if (updateError) {
                throw updateError
            }

            toast.success("Password updated successfully")
            router.push('/login?message=Password updated successfully')
        } catch (err: any) {
            setError(err.message || "Failed to update password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-2">
                <Link href="/" className="text-2xl font-bold tracking-widest text-[#00C975]">
                    FROME.IO
                </Link>
                <div className="flex justify-center mt-6 mb-2">
                    <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5 shadow-inner">
                        <KeyRound className="w-8 h-8 text-[#00C975]" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Set new password
                </h2>
                <p className="text-zinc-500 text-sm">
                    Your new password must be different to previously used passwords.
                </p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl shadow-2xl">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs text-center font-medium animate-in fade-in zoom-in duration-300">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-400 font-medium ml-1">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 bg-black/40 border-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-[#00C975] h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-zinc-400 font-medium ml-1">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pl-10 bg-black/40 border-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-[#00C975] h-11"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00C975] hover:bg-[#00C975]/90 text-black font-bold h-11 text-md shadow-lg shadow-[#00C975]/10 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                'Reset Password'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/5 pb-6 pt-4">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm text-zinc-400 font-medium hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function UpdatePasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 selection:bg-[#00C975] selection:text-black">
            <Suspense fallback={
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="w-32 h-8 bg-zinc-800 rounded"></div>
                    <div className="w-full max-w-sm h-96 bg-zinc-800 rounded-xl"></div>
                </div>
            }>
                <UpdatePasswordForm />
            </Suspense>
        </div>
    )
}

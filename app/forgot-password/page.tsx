'use client'

import React, { useState, Suspense } from 'react'
import Link from "next/link"
import { forgotPassword } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail } from 'lucide-react'

function ForgotPasswordForm() {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        await forgotPassword(formData)
        setLoading(false)
    }

    if (message) {
        return (
            <div className="w-full max-w-sm text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-[#00C975]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-[#00C975]" />
                </div>
                <h2 className="text-3xl font-bold text-white">Check your email</h2>
                <p className="text-zinc-400">
                    {message}
                </p>
                <Link href="/login" className="block w-full">
                    <Button
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/5"
                    >
                        Back to Sign In
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-2">
                <Link href="/" className="text-2xl font-bold tracking-widest text-[#00C975]">
                    FROME.IO
                </Link>
                <h2 className="text-3xl font-bold tracking-tight text-white mt-8">
                    Forgot password?
                </h2>
                <p className="text-zinc-500 text-sm">
                    No worries, we'll send you reset instructions.
                </p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl shadow-2xl">
                <CardContent className="pt-6">
                    <form action={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-400 font-medium ml-1">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="bg-black/40 border-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-[#00C975] h-11"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00C975] hover:bg-[#00C975]/90 text-black font-bold h-11 text-md shadow-lg shadow-[#00C975]/10"
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

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 selection:bg-[#00C975] selection:text-black">
            <Suspense fallback={
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="w-32 h-8 bg-zinc-800 rounded"></div>
                    <div className="w-64 h-64 bg-zinc-800 rounded-xl"></div>
                </div>
            }>
                <ForgotPasswordForm />
            </Suspense>
        </div>
    )
}

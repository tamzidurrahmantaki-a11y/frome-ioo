'use client'

import React, { useState, Suspense } from 'react'
import Link from "next/link"
import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation'

function LoginForm() {
    const searchParams = useSearchParams()

    // Check initial mode from URL
    const initialMode = searchParams.get('mode') === 'signup' ? false : true
    const [isLogin, setIsLogin] = useState(initialMode)

    const [loading, setLoading] = useState(false)
    const [checkEmail, setCheckEmail] = useState(false)
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    async function handleAuth(formData: FormData) {
        setLoading(true)
        if (isLogin) {
            await login(formData)
        } else {
            await signup(formData)
            // Show check email message after signup attempt
            setCheckEmail(true)
        }
        setLoading(false)
    }

    if (checkEmail) {
        return (
            <div className="w-full max-w-sm text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-[#00C975]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-[#00C975]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Check your email</h2>
                <p className="text-zinc-400">
                    We've sent a verification link to your email address. Please click the link to confirm your account.
                </p>
                <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5"
                    onClick={() => { setCheckEmail(false); setIsLogin(true) }}
                >
                    Back to Sign In
                </Button>
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
                    {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-zinc-500 text-sm">
                    {isLogin ? 'Enter your details to access your dashboard.' : 'Start tracking your links intelligently today.'}
                </p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl shadow-2xl">
                <CardContent className="pt-6">
                    <form action={handleAuth} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs text-center font-medium">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-xs text-center font-medium">
                                {message}
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
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-zinc-400 font-medium">Password</Label>
                                {isLogin && (
                                    <Link href="/forgot-password" className="text-xs text-[#00C975] hover:underline font-medium">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
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
                                isLogin ? 'Sign In' : 'Get Started'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/5 pb-6 pt-4">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-zinc-400 font-medium hover:text-white transition-colors"
                    >
                        {isLogin ? (
                            <>Don&apos;t have an account? <span className="text-[#00C975]">Sign up</span></>
                        ) : (
                            <>Already have an account? <span className="text-[#00C975]">Sign in</span></>
                        )}
                    </button>
                </CardFooter>
            </Card>

            <p className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-600 text-[10px] text-center uppercase tracking-[0.2em] font-bold">
                SECURE AUTHENTICATION BY SUPABASE
            </p>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 selection:bg-[#00C975] selection:text-black">
            <Suspense fallback={
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="w-32 h-8 bg-zinc-800 rounded"></div>
                    <div className="w-64 h-64 bg-zinc-800 rounded-xl"></div>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    )
}

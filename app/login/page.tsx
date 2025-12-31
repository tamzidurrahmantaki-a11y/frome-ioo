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
    const [isLogin, setIsLogin] = useState(true)
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-2">
                <Link href="/" className="text-2xl font-bold tracking-widest text-[#00C975]">
                    FROME.IO
                </Link>
                <h2 className="text-3xl font-bold tracking-tight text-white mt-8">
                    {isLogin ? 'Sign in' : 'Create an account'}
                </h2>
                <p className="text-zinc-500 text-sm">
                    {isLogin ? 'Welcome back! Please enter your details.' : 'Join us and start tracking your clicks.'}
                </p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl shadow-2xl">
                <CardContent className="pt-6">
                    <form className="space-y-6">
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
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-zinc-400 font-medium">Password</Label>
                                {isLogin && (
                                    <Link href="#" className="text-xs text-[#00C975] hover:underline font-medium">
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
                            formAction={isLogin ? login : signup}
                            className="w-full bg-[#00C975] hover:bg-[#00C975]/90 text-black font-bold h-11 text-md shadow-lg shadow-[#00C975]/10"
                        >
                            {isLogin ? 'Sign In' : 'Get Started'}
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

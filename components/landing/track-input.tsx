'use client'

import { Button } from "@/components/ui/button"
import { createLink } from "@/app/actions/create-link"
import { useState } from "react"
import { Loader2, Copy, CheckCircle2, AlertCircle } from "lucide-react"

export function TrackInput() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<null | { slug: string, originalUrl: string }>(null)
    const [copied, setCopied] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const res = await createLink(formData)
            if (res?.error) {
                setError(res.error)
            } else if (res?.success && res.slug) {
                setResult({ slug: res.slug, originalUrl: res.originalUrl || '' })
            }
        } catch (e) {
            setError("Something went wrong. Please try again.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        if (!result) return
        const fullUrl = `${window.location.host}/${result.slug}`
        navigator.clipboard.writeText(fullUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full max-w-xl mx-auto mt-10 space-y-4">
            <form action={handleSubmit} className="relative flex items-center group">
                <input
                    type="text"
                    name="url"
                    required
                    placeholder="paste your link here..."
                    className="w-full h-14 pl-6 pr-32 rounded-lg bg-white/10 border border-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00C975]/50 transition-all"
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-1.5 top-1.5 h-11 px-8 bg-[#00C975] hover:bg-[#00C975]/90 text-black font-bold rounded-md"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track'}
                </Button>
            </form>

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1 px-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {result && (
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col text-left">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Your Smart Link</p>
                            <code className="text-[#00C975] font-bold text-lg tracking-tight">
                                frome.io/{result.slug}
                            </code>
                        </div>
                        <Button
                            onClick={handleCopy}
                            className="h-10 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-lg gap-2 px-4 transition-all"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-[#00C975]" />
                                    <span className="text-[#00C975]">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copy</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

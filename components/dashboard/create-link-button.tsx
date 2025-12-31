"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2, Sparkles, X, Link2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useModal } from "@/lib/context/modal-context"

export function CreateLinkButton() {
    const { openCreateModal } = useModal()

    return (
        <Button
            onClick={openCreateModal}
            className="bg-[#00C975] hover:bg-[#00C975]/90 text-black font-semibold gap-2 rounded-xl px-6 h-10 shadow-lg shadow-[#00C975]/20 text-xs uppercase tracking-widest"
        >
            <Plus className="w-4 h-4" />
            Create New Link
        </Button>
    )
}

export function CreateLinkModal() {
    const { isCreateModalOpen, closeCreateModal } = useModal()
    const [isLoading, setIsLoading] = useState(false)
    const [url, setUrl] = useState("")
    const [title, setTitle] = useState("")
    const [customSlug, setCustomSlug] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    if (!isCreateModalOpen) return null

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, title, customSlug })
            })

            const data = await res.json()

            if (data.success) {
                closeCreateModal()
                setUrl("")
                setTitle("")
                setCustomSlug("")
                router.refresh()
            } else {
                setError(data.error || "Failed to create link")
                console.error("Link Generation Failed:", data.error)
            }
        } catch (err) {
            console.error(err)
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeCreateModal}
            />

            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-black p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#00C975]" />
                        <h3 className="font-semibold text-lg">Generate Smart Link</h3>
                    </div>
                    <button onClick={closeCreateModal} className="hover:text-gray-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleCreate} className="p-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Destination URL</label>
                            <div className="relative">
                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    required
                                    placeholder="https://example.com/very-long-url"
                                    className="h-12 pl-10 bg-gray-50/50 border-none rounded-xl focus:ring-1 focus:ring-black text-black placeholder:text-gray-400 font-medium"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Custom Back-half (Optional)</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">frome.io/</div>
                                <Input
                                    placeholder="my-custom-slug"
                                    className="h-12 pl-[4.5rem] bg-gray-50/50 border-none rounded-xl focus:ring-1 focus:ring-black text-black placeholder:text-gray-400 font-medium"
                                    value={customSlug}
                                    onChange={(e) => setCustomSlug(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Title (Optional)</label>
                            <Input
                                placeholder="E.g. Summer Campaign 2024"
                                className="h-12 bg-gray-50/50 border-none rounded-xl focus:ring-1 focus:ring-black text-black placeholder:text-gray-400 font-medium"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white hover:bg-black/90 font-semibold h-12 rounded-xl text-sm uppercase tracking-widest shadow-xl shadow-black/10 transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            "Save Smart Link"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}

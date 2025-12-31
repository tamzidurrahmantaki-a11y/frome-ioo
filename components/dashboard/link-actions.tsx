"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, X, Loader2, Sparkles, Link2, AlertTriangle } from "lucide-react"
import { deleteLink, updateLink } from "@/app/actions/link-actions"
import { toast } from "sonner"

interface LinkActionsProps {
    link: {
        id: string
        title: string
        original_url: string
        short_slug: string
    }
}

export function LinkActions({ link }: LinkActionsProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [title, setTitle] = useState(link.title)
    const [url, setUrl] = useState(link.original_url)
    const [slug, setSlug] = useState(link.short_slug)

    const handleDelete = async () => {
        setIsLoading(true)
        const res = await deleteLink(link.id)
        setIsLoading(false)

        if (res.success) {
            toast.success("Link deleted successfully")
            setIsDeleteOpen(false)
        } else {
            toast.error(res.error || "Failed to delete link")
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const res = await updateLink(link.id, {
            title,
            original_url: url,
            short_slug: slug
        })

        setIsLoading(false)

        if (res.success) {
            toast.success("Link updated successfully")
            setIsEditOpen(false)
        } else {
            toast.error(res.error || "Failed to update link")
        }
    }

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => setIsDeleteOpen(true)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete Link"
            >
                <Trash2 className="w-5 h-5" />
            </button>

            <Button
                onClick={() => setIsEditOpen(true)}
                className="bg-black hover:bg-black/80 text-white text-[10px] font-semibold uppercase tracking-widest px-6 h-9 rounded-xl"
            >
                Edit
            </Button>

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-black p-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#00C975]" />
                                <h3 className="font-semibold text-lg">Edit Smart Link</h3>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="hover:text-gray-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Destination URL</label>
                                    <Input
                                        required
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="h-12 bg-gray-50/50 border-none rounded-xl focus:ring-1 focus:ring-black text-black font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Custom Back-half</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">frome.io/</div>
                                        <Input
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            className="h-12 pl-[5rem] bg-gray-50/50 border-none rounded-xl focus:ring-1 focus:ring-black text-black font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Title</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-12 bg-gray-50/50 border-none rounded-xl focus:ring-1 focus:ring-black text-black font-medium"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white hover:bg-black/90 font-semibold h-12 rounded-xl text-sm uppercase tracking-widest"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Changes"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-10 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2 tracking-tight">Are you sure?</h3>
                        <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">
                            This action cannot be undone. All analytics data for <span className="font-semibold text-black text-xs">/{link.short_slug}</span> will be permanently deleted.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-12 rounded-xl shadow-xl shadow-red-600/20 uppercase tracking-widest text-xs"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Yes, Delete Link"}
                            </Button>
                            <Button
                                onClick={() => setIsDeleteOpen(false)}
                                variant="ghost"
                                className="w-full text-gray-400 font-semibold h-11 hover:bg-gray-50 hover:text-black uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

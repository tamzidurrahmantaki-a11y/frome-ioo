"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createFaq, updateFaq, deleteFaq, toggleFaqActive } from "@/app/actions/admin/manage-faqs"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQ {
    id: string
    question: string
    answer: string
    order_index: number
    is_active: boolean
}

export function FaqEditor({ faqs }: { faqs: FAQ[] }) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const [newFaq, setNewFaq] = useState({ question: "", answer: "" })
    const [showAddForm, setShowAddForm] = useState(false)

    const handleCreate = async () => {
        if (!newFaq.question || !newFaq.answer) return toast.error("Please fill all fields")
        setIsLoading(true)
        const res = await createFaq(newFaq)
        setIsLoading(false)
        if (res.success) {
            toast.success("FAQ created")
            setNewFaq({ question: "", answer: "" })
            setShowAddForm(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this FAQ?")) return
        await deleteFaq(id)
        toast.success("FAQ deleted")
    }

    const handleToggle = async (id: string, current: boolean) => {
        await toggleFaqActive(id, !current)
        toast.success("Status updated")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#00C975] text-black hover:bg-[#00C975]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New FAQ
                </Button>
            </div>

            {showAddForm && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-2">
                        <Label>Question</Label>
                        <Input value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Answer</Label>
                        <Textarea value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading} className="bg-black text-white">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create FAQ
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {faqs.map((faq) => (
                    <FaqItem
                        key={faq.id}
                        faq={faq}
                        isEditing={editingId === faq.id}
                        onEdit={() => setEditingId(faq.id)}
                        onCancel={() => setEditingId(null)}
                        onDelete={() => handleDelete(faq.id)}
                        onToggle={() => handleToggle(faq.id, faq.is_active)}
                    />
                ))}
            </div>
        </div>
    )
}

function FaqItem({ faq, isEditing, onEdit, onCancel, onDelete, onToggle }: any) {
    const [data, setData] = useState({ question: faq.question, answer: faq.answer })
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        await updateFaq(faq.id, data)
        setSaving(false)
        onCancel()
        toast.success("Saved")
    }

    if (isEditing) {
        return (
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-lg ring-1 ring-black/5">
                <div className="space-y-2">
                    <Label>Question</Label>
                    <Input value={data.question} onChange={e => setData({ ...data, question: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea value={data.answer} onChange={e => setData({ ...data, answer: e.target.value })} className="min-h-[100px]" />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-black text-white">
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={cn(
            "bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 transition-all hover:border-gray-200",
            !faq.is_active && "opacity-60 bg-gray-50"
        )}>
            <div className="mt-1 cursor-grab text-gray-400 hover:text-gray-600">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-sm text-black">{faq.question}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${faq.id}`} className="text-xs text-gray-500">Active</Label>
                    <Switch id={`active-${faq.id}`} checked={faq.is_active} onCheckedChange={onToggle} />
                </div>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

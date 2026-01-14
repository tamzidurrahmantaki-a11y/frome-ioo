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
                <h2 className="text-xl font-black text-foreground tracking-tighter uppercase italic">Frequently Asked Questions</h2>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase text-[10px] tracking-widest h-10 px-6 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    New FAQ
                </Button>
            </div>

            {showAddForm && (
                <div className="bg-muted/30 p-8 rounded-2xl border border-border/50 space-y-6 animate-in fade-in slide-in-from-top-4 shadow-xl">
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Question</Label>
                        <Input value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} className="bg-background/50 border-border/50 h-11 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Answer</Label>
                        <Textarea value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} className="bg-background/50 border-border/50 min-h-[100px] rounded-xl" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowAddForm(false)} className="rounded-xl font-bold text-xs uppercase tracking-widest">Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-black h-11 px-6 rounded-xl uppercase text-[10px] tracking-widest">
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
            <div className="bg-card p-10 rounded-2xl border border-border/50 space-y-8 shadow-2xl ring-1 ring-white/5">
                <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Question</Label>
                    <Input value={data.question} onChange={e => setData({ ...data, question: e.target.value })} className="bg-background/50 border-border/50 h-12 rounded-xl" />
                </div>
                <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Answer</Label>
                    <Textarea value={data.answer} onChange={e => setData({ ...data, answer: e.target.value })} className="min-h-[120px] bg-background/50 border-border/50 rounded-xl" />
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel} className="rounded-xl font-bold text-xs uppercase tracking-widest">Cancel</Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 font-black h-12 px-8 rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-primary/10">
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save FAQ Changes
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={cn(
            "bg-card border border-border/50 rounded-2xl p-6 flex items-start gap-6 transition-all duration-300 hover:border-primary/30",
            !faq.is_active && "opacity-40 grayscale"
        )}>
            <div className="mt-1 cursor-grab text-muted-foreground/30 hover:text-primary transition-colors">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-2">
                <h3 className="font-bold text-base text-foreground tracking-tight leading-tight">{faq.question}</h3>
                <p className="text-sm font-medium text-muted-foreground line-clamp-2 leading-relaxed">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <Label htmlFor={`active-${faq.id}`} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Visible</Label>
                    <Switch id={`active-${faq.id}`} checked={faq.is_active} onCheckedChange={onToggle} />
                </div>
                <div className="h-6 w-px bg-border/30 mx-1" />
                <Button variant="ghost" size="sm" onClick={onEdit} className="rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-muted">Edit</Button>
                <Button variant="ghost" size="icon" onClick={onDelete} className="rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

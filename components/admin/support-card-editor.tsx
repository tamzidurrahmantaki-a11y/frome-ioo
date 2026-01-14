"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import * as Icons from "lucide-react"
import { createSupportCard, updateSupportCard, deleteSupportCard } from "@/app/actions/admin/manage-support-cards"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react"

interface SupportCard {
    id: string
    title: string
    description: string
    icon_name: string
    order_index: number
    is_active: boolean
}

interface SupportCardEditorProps {
    cards: SupportCard[]
}

export function SupportCardEditor({ cards }: SupportCardEditorProps) {
    const [selectedCard, setSelectedCard] = useState<SupportCard | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this card?")) return

        setIsLoading(true)
        const result = await deleteSupportCard(id)
        setIsLoading(false)

        if (result.success) {
            toast.success("Card deleted successfully")
        } else {
            toast.error("Failed to delete card")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-foreground tracking-tighter uppercase italic">Help Center Cards</h2>
                <Button onClick={() => { setSelectedCard(null); setIsOpen(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase text-[10px] tracking-widest h-10 px-6 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Card
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = (Icons as any)[card.icon_name || "HelpCircle"] || Icons.HelpCircle
                    return (
                        <div key={card.id} className="bg-card border border-border/50 rounded-2xl p-8 relative group hover:border-primary/30 transition-all duration-300 shadow-xl shadow-black/20">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setSelectedCard(card); setIsOpen(true) }} className="p-2.5 hover:bg-muted rounded-xl text-muted-foreground/40 hover:text-foreground transition-all">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(card.id)} className="p-2.5 hover:bg-red-500/10 rounded-xl text-muted-foreground/40 hover:text-red-500 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_20px_rgba(0,201,117,0.1)]">
                                <Icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-black text-xl mb-3 text-foreground tracking-tighter italic uppercase">{card.title}</h3>
                            <p className="text-sm font-medium text-muted-foreground/60 leading-relaxed min-h-[40px]">{card.description}</p>
                        </div>
                    )
                })}
            </div>

            <CardDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                card={selectedCard}
                onSuccess={() => setIsOpen(false)}
            />
        </div>
    )
}

function CardDialog({ open, onOpenChange, card, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, card: SupportCard | null, onSuccess: () => void }) {
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            title: "",
            description: "",
            icon_name: "HelpCircle"
        }
    })
    const [isLoading, setIsLoading] = useState(false)

    // Reset form when card changes
    useState(() => {
        if (card) {
            setValue("title", card.title)
            setValue("description", card.description)
            setValue("icon_name", card.icon_name)
        } else {
            reset()
        }
    })

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            if (card) {
                await updateSupportCard(card.id, data)
                toast.success("Card updated")
            } else {
                await createSupportCard(data)
                toast.success("Card created")
            }
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            toast.error("Operation failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{card ? "Edit Card" : "New Card"}</DialogTitle>
                    <DialogDescription>Details for the help center card</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Title</Label>
                        <Input {...register("title")} required className="bg-background/50 border-border/50 h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Description</Label>
                        <Textarea {...register("description")} required className="bg-background/50 border-border/50 min-h-[100px] rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Icon Name (Lucide React)</Label>
                        <Input {...register("icon_name")} placeholder="e.g. Link, BarChart, Zap" className="bg-background/50 border-border/50 h-11 rounded-xl" />
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Case-sensitive Lucide icon name</p>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-black h-12 rounded-xl uppercase text-[11px] tracking-widest shadow-lg shadow-primary/10">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Card Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

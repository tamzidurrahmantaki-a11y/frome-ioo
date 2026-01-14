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
                <h2 className="text-xl font-semibold">Help Center Cards</h2>
                <Button onClick={() => { setSelectedCard(null); setIsOpen(true) }} className="bg-[#00C975] text-black hover:bg-[#00C975]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Card
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = (Icons as any)[card.icon_name || "HelpCircle"] || Icons.HelpCircle
                    return (
                        <div key={card.id} className="bg-white border border-gray-100 rounded-xl p-6 relative group hover:shadow-lg transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setSelectedCard(card); setIsOpen(true) }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(card.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-4">
                                <Icon className="w-6 h-6 text-[#00C975]" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                            <p className="text-sm text-gray-500">{card.description}</p>
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...register("title")} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea {...register("description")} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Icon Name (Lucide React)</Label>
                        <Input {...register("icon_name")} placeholder="e.g. Link, BarChart, Zap" />
                        <p className="text-xs text-gray-500">Case-sensitive Lucide icon name</p>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-black/90">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateContact } from "@/app/actions/admin/manage-contacts"
import { toast } from "sonner"
import { Loader2, Mail, MessageSquare, BookOpen, ExternalLink, Save } from "lucide-react"

interface Contact {
    id: string
    contact_type: string
    contact_value: string
    label: string
}

const ICONS = {
    email: Mail,
    whatsapp: MessageSquare,
    discord: MessageSquare,
    telegram: MessageSquare,
    live_chat: MessageSquare,
    documentation: BookOpen
}

export function ContactListEditor({ contacts }: { contacts: Contact[] }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-foreground tracking-tighter uppercase italic">Contact Links</h2>
            <div className="grid grid-cols-1 gap-4">
                {contacts.map((contact) => (
                    <ContactItem key={contact.id} contact={contact} />
                ))}
            </div>
        </div>
    )
}

function ContactItem({ contact }: { contact: Contact }) {
    const [value, setValue] = useState(contact.contact_value)
    const [label, setLabel] = useState(contact.label)
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)

    const Icon = (ICONS as any)[contact.contact_type] || ExternalLink

    const handleSave = async () => {
        setIsSaving(true)
        const res = await updateContact(contact.contact_type, value, label)
        setIsSaving(false)
        if (res.success) {
            toast.success(`${contact.contact_type} updated`)
            setHasChanged(false)
        } else {
            toast.error("Failed to update")
        }
    }

    const handleChange = (newVal: string, isLabel: boolean = false) => {
        if (isLabel) setLabel(newVal)
        else setValue(newVal)
        setHasChanged(true)
    }

    return (
        <div className="bg-card border border-border/50 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start md:items-center shadow-xl shadow-black/20 hover:border-primary/20 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0 border border-border/30">
                <Icon className="w-6 h-6 text-muted-foreground" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Label</Label>
                    <Input value={label} onChange={e => handleChange(e.target.value, true)} className="bg-background/50 border-border/50 h-11 rounded-xl text-sm font-medium" />
                </div>
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Link / Value Identifier</Label>
                    <div className="flex gap-2">
                        <Input value={value} onChange={e => handleChange(e.target.value)} className="bg-background/50 border-border/50 h-11 rounded-xl text-sm font-medium" />
                    </div>
                </div>
            </div>

            <Button
                onClick={handleSave}
                disabled={!hasChanged || isSaving}
                className={hasChanged
                    ? "h-14 w-14 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/10 transition-all active:scale-95"
                    : "h-14 w-14 shrink-0 bg-muted/20 text-muted-foreground/20 border border-border/10 rounded-2xl cursor-not-allowed"}
            >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            </Button>
        </div>
    )
}

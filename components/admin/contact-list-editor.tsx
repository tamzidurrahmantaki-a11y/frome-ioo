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
            <h2 className="text-xl font-semibold">Contact Links</h2>
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
        <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-gray-600" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                    <Label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Label</Label>
                    <Input value={label} onChange={e => handleChange(e.target.value, true)} />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Link / Value</Label>
                    <div className="flex gap-2">
                        <Input value={value} onChange={e => handleChange(e.target.value)} />
                    </div>
                </div>
            </div>

            <Button
                onClick={handleSave}
                disabled={!hasChanged || isSaving}
                className={hasChanged ? "bg-black text-white" : "bg-gray-100 text-gray-400"}
            >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </Button>
        </div>
    )
}

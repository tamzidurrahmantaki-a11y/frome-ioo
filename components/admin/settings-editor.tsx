"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSetting } from "@/app/actions/admin/manage-settings"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Setting {
    setting_key: string
    setting_value: string
}

export function SettingsEditor({ settings }: { settings: Setting[] }) {
    const rulesText = settings.find(s => s.setting_key === 'rules_text')?.setting_value || ''
    const [value, setValue] = useState(rulesText)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await updateSetting('rules_text', value)
        setIsSaving(false)
        toast.success("Settings updated")
    }

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-8 space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">Support Page Info Box</h2>
                <p className="text-sm text-gray-500">This text appears at the top of the support page or ticket form.</p>
            </div>

            <div className="space-y-2">
                <Label>Information / Rules Text</Label>
                <Textarea
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="min-h-[150px] font-mono text-sm"
                    placeholder="Enter the rules or information text here..."
                />
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="bg-black text-white hover:bg-black/90">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </div>
    )
}

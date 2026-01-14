"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateSetting } from "@/app/actions/admin/manage-settings"
import { updateAdminCredentials } from "@/app/actions/admin/security-settings"
import { toast } from "sonner"
import { Loader2, Save, RefreshCw } from "lucide-react"

interface Setting {
    key: string
    value: string
    label?: string
    type?: string
    group_name?: string
}

interface SettingsEditorProps {
    section: string
    settings: Setting[]
}

export function SettingsEditor({ section, settings }: SettingsEditorProps) {
    const [loading, setLoading] = useState<string | null>(null)

    // Helper to get value
    const getVal = (key: string) => settings.find(s => s.key === key)?.value || ''

    // Local state for specific complex forms (like Security)
    const [adminEmail, setAdminEmail] = useState(getVal('admin_email_display'))
    const [adminPass, setAdminPass] = useState('')

    const handleSave = async (key: string, val: string) => {
        setLoading(key)
        const result = await updateSetting(key, val)
        if (result.success) {
            toast.success("Setting saved")
        } else {
            toast.error("Failed to save")
        }
        setLoading(null)
    }

    const handleSecurityUpdate = async () => {
        setLoading('security')
        const result = await updateAdminCredentials(adminEmail, adminPass)
        if (result.success) {
            toast.success("Credentials updated")
            setAdminPass('') // Clear password field
        } else {
            toast.error("Failed to update credentials")
        }
        setLoading(null)
    }

    if (section === 'general') {
        return (
            <div className="bg-card border border-border/50 rounded-2xl p-10 space-y-10 shadow-2xl shadow-black/40">
                <div className="grid gap-8 max-w-xl">
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Site Name</Label>
                        <SaveInput
                            initialValue={getVal('site_name')}
                            onSave={(v) => handleSave('site_name', v)}
                            placeholder="My SaaS"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Support Email</Label>
                        <SaveInput
                            initialValue={getVal('support_email')}
                            onSave={(v) => handleSave('support_email', v)}
                            placeholder="support@example.com"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Logo URL</Label>
                        <SaveInput
                            initialValue={getVal('logo_url')}
                            onSave={(v) => handleSave('logo_url', v)}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (section === 'visual') {
        const primaryColor = getVal('primary_color') || '#000000'
        return (
            <div className="bg-card border border-border/50 rounded-2xl p-10 space-y-10 shadow-2xl shadow-black/40">
                <div className="space-y-6">
                    <div>
                        <Label className="text-lg font-black tracking-tight italic uppercase">Primary Theme Color</Label>
                        <p className="text-sm font-medium text-muted-foreground mt-2 opacity-60">This color is used for buttons, links, and accents across the entire site.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div
                            className="w-20 h-20 rounded-2xl shadow-xl border border-border/50"
                            style={{ backgroundColor: primaryColor }}
                        />
                        <div className="space-y-3">
                            <Input
                                type="color"
                                className="w-32 h-12 p-1 cursor-pointer bg-background border-border/50 rounded-xl"
                                defaultValue={primaryColor}
                                onChange={(e) => handleSave('primary_color', e.target.value)}
                            />
                            <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">Click to change instantly</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (section === 'automation') {
        return (
            <div className="bg-card border border-border/50 rounded-2xl p-10 space-y-10 shadow-2xl shadow-black/40">
                <div className="max-w-xl space-y-8">
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Sellix Webhook Secret</Label>
                        <p className="text-[11px] font-medium text-muted-foreground/40">Used to verify incoming payments. Find this in Sellix Developers {'->'} Webhooks.</p>
                        <SaveInput
                            initialValue={getVal('sellix_webhook_secret')}
                            onSave={(v) => handleSave('sellix_webhook_secret', v)}
                            placeholder="wh_sec_..."
                            type="password"
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (section === 'security') {
        return (
            <div className="bg-card border border-border/50 rounded-2xl p-10 space-y-10 shadow-2xl shadow-black/40">
                <div className="max-w-xl space-y-8">
                    <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-medium leading-relaxed">
                        <span className="font-black uppercase tracking-[0.2em] block mb-2">Cautionary Note</span>
                        Updating these credentials will regenerate your session and affect your next login.
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Admin Email</Label>
                        <Input
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">New Password</Label>
                        <Input
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                            placeholder="Leave empty to keep current password"
                            type="password"
                        />
                    </div>

                    <Button onClick={handleSecurityUpdate} disabled={loading === 'security'} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-primary/10">
                        {loading === 'security' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Update Security Credentials
                    </Button>
                </div>
            </div>
        )
    }

    return null
}


function SaveInput({ initialValue, onSave, placeholder, type = "text" }: { initialValue: string, onSave: (val: string) => Promise<void>, placeholder?: string, type?: string }) {
    const [val, setVal] = useState(initialValue)
    const [loading, setLoading] = useState(false)
    const [dirty, setDirty] = useState(false)

    const handle = async () => {
        setLoading(true)
        await onSave(val)
        setLoading(false)
        setDirty(false)
    }

    return (
        <div className="flex gap-4">
            <Input
                value={val}
                onChange={(e) => { setVal(e.target.value); setDirty(true) }}
                placeholder={placeholder}
                type={type}
                className="bg-background/50 border-border/50 h-11 rounded-xl text-sm font-medium focus-visible:ring-primary/20"
            />
            {dirty && (
                <Button size="icon" onClick={handle} disabled={loading} className="shrink-0 h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
            )}
        </div>
    )
}

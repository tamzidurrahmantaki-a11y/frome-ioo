"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import { updateProfile } from "@/app/actions/profile-actions"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toSentenceCase } from "@/lib/utils"

export default function ProfilePage() {
    const supabase = createClient()
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)
    const [fullName, setFullName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    React.useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                setEmail(user.email || "")

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setFullName(profile.full_name || "")
                } else {
                    setFullName(user.user_metadata?.first_name || "")
                }
            }
            setIsLoading(false)
        }
        loadProfile()
    }, [supabase])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateProfile({
                fullName,
                email,
                password: password || undefined
            })
            toast.success("Profile updated successfully")
            setPassword("") // clear password field
            window.dispatchEvent(new Event('profile-updated'))
            router.refresh() // Refresh to update layout names
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-20 mt-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">General details</h2>
                    <p className="text-[13px] md:text-sm font-medium text-muted-foreground">Update your photo and personal details here</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-sm font-semibold text-foreground hover:bg-muted h-11 px-8 rounded-xl transition-all">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-11 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-xl shadow-primary/10 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="space-y-16 bg-card p-12 rounded-xl border border-border pb-20">
                {/* Avatar Section */}
                <div className="flex items-center gap-10">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-background shadow-xl bg-background">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-background text-foreground text-4xl font-semibold border border-border">
                                {fullName?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm md:text-base font-semibold text-foreground">{toSentenceCase(fullName) || "User"}</h3>
                        <p className="text-[13px] font-medium text-muted-foreground leading-loose">{email}</p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-12 max-w-2xl">
                    <div className="space-y-4">
                        <Label className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest ml-1">Full Name</Label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <User className="w-5 h-5" />
                            </div>
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name"
                                className="bg-background border-border h-14 pl-12 text-base font-medium text-foreground focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest ml-1">Email Address</Label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Mail className="w-5 h-5" />
                            </div>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="bg-background border-border h-14 pl-12 text-base font-medium text-foreground focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 space-y-12 border-t border-border">
                        <div className="space-y-4">
                            <Label className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest ml-1">New Password</Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password (optional)"
                                    className="bg-background border-border h-14 pl-12 text-base font-medium text-foreground focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

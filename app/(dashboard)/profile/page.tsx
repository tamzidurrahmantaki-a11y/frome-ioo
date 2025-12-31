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
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-black">General details</h2>
                    <p className="text-[13px] md:text-sm font-medium text-gray-400">Update your photo and personal details here</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-sm font-semibold text-black hover:bg-gray-100 h-11 px-8 rounded-xl transition-all">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-11 px-10 bg-black hover:bg-black/90 text-white font-semibold rounded-xl shadow-xl shadow-black/5 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="space-y-16 bg-white p-12 rounded-xl border border-gray-100/50 shadow-sm">
                {/* Avatar Section */}
                <div className="flex items-center gap-10">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-xl bg-black">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-black text-white text-4xl font-semibold">
                                {fullName?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm md:text-base font-semibold text-black">{toSentenceCase(fullName) || "User"}</h3>
                        <p className="text-[13px] font-medium text-gray-400 leading-loose">{email}</p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-12 max-w-2xl">
                    <div className="space-y-4">
                        <Label className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Full Name</Label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name"
                                className="bg-gray-50/50 border-none h-14 pl-12 text-base font-medium text-black focus-visible:ring-1 focus-visible:ring-black/10 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="bg-gray-50/50 border-none h-14 pl-12 text-base font-medium text-black focus-visible:ring-1 focus-visible:ring-black/10 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 space-y-12 border-t border-gray-100">
                        <div className="space-y-4">
                            <Label className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest ml-1">New Password</Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password (optional)"
                                    className="bg-gray-50/50 border-none h-14 pl-12 text-base font-medium text-black focus-visible:ring-1 focus-visible:ring-black/10 rounded-xl transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

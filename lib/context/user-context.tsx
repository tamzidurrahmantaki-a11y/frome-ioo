"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserContextType {
    profile: any
    isLoading: boolean
    refreshProfile: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children, initialUser }: { children: React.ReactNode, initialUser?: any }) {
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchProfile = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileData) {
                setProfile(profileData)
            } else if (user.user_metadata) {
                // Fallback to metadata if profile doesn't exist yet
                setProfile({
                    full_name: user.user_metadata.first_name || user.email?.split('@')[0] || 'User',
                    id: user.id
                })
            }
        }
        setIsLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    // Listen for custom refresh events from across the app
    useEffect(() => {
        const handleUpdate = () => {
            fetchProfile()
        }
        window.addEventListener('profile-updated', handleUpdate)
        return () => window.removeEventListener('profile-updated', handleUpdate)
    }, [fetchProfile])

    return (
        <UserContext.Provider value={{ profile, isLoading, refreshProfile: fetchProfile }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

"use client"

import * as React from "react"

interface ModalContextType {
    isCreateModalOpen: boolean
    openCreateModal: () => void
    closeCreateModal: () => void
    isProModalOpen: boolean
    openProModal: () => void
    closeProModal: () => void
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({
    children,
    subscriptionStatus = 'free',
    linksCount = 0
}: {
    children: React.ReactNode
    subscriptionStatus?: string
    linksCount?: number
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
    const [isProModalOpen, setIsProModalOpen] = React.useState(false)

    const openCreateModal = () => {
        if (subscriptionStatus === 'free' && linksCount >= 2) {
            setIsProModalOpen(true)
        } else {
            setIsCreateModalOpen(true)
        }
    }

    const closeCreateModal = () => setIsCreateModalOpen(false)
    const openProModal = () => setIsProModalOpen(true)
    const closeProModal = () => setIsProModalOpen(false)

    return (
        <ModalContext.Provider value={{
            isCreateModalOpen, openCreateModal, closeCreateModal,
            isProModalOpen, openProModal, closeProModal
        }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = React.useContext(ModalContext)
    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider")
    }
    return context
}

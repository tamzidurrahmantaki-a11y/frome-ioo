"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"
import Link from "next/link"

interface ProModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProModal({ isOpen, onClose }: ProModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-gray-100 dark:border-zinc-800">
                <DialogHeader className="mb-4">
                    <div className="mx-auto w-12 h-12 bg-[#00C975]/10 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-[#00C975]" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold">Upgrade to Pro</DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        You&apos;ve reached the limit of free links. Unlock unlimited tracking and advanced analytics.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid gap-3">
                        {['Unlimited Links', 'Real-time Analytics', 'Custom Domains', 'Priority Support'].map((feature) => (
                            <div key={feature} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                                <Check className="w-4 h-4 text-[#00C975]" />
                                <span className="text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 space-y-2">
                        <Button className="w-full bg-[#00C975] hover:bg-[#00C975]/90 text-black font-bold h-11" asChild>
                            <Link href="/#pricing">Upgrade Now</Link>
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={onClose}>
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

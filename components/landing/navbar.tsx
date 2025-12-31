import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A] border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-wider text-white">
                    FROME.IO
                </Link>

                <div className="hidden md:flex items-center gap-8 bg-zinc-900/50 px-6 py-2 rounded-full border border-white/5">
                    <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="#about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        About
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button className="bg-[#00C975] hover:bg-[#00C975]/90 text-black font-semibold rounded-md px-6">
                            Sign up
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

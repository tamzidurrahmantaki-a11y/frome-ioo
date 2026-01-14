import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <div className="fixed top-6 w-full z-50 px-4 flex justify-center">
            <nav className="container max-w-5xl glass-nav rounded-2xl h-16 flex items-center justify-between px-6 shadow-2xl">
                <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#00C975] rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-black rounded-sm" />
                    </div>
                    FROME.IO
                </Link>

                <div className="hidden md:flex items-center gap-8 px-6 py-2">
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

                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-zinc-400 hover:text-white font-semibold text-sm hover:bg-white/5 px-4 md:px-6">
                            Sign in
                        </Button>
                    </Link>
                    <Link href="/login?mode=signup">
                        <Button className="bg-[#00C975] hover:bg-[#00C975]/90 text-black font-bold text-sm rounded-xl px-5 md:px-8 h-10 shadow-[0_4px_14px_0_rgba(0,201,117,0.3)] transition-all duration-200">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>
        </div>
    )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    const footerLinks = {
        product: [
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Analytics", href: "/dashboard/analytics" },
            { name: "Integrations", href: "#" },
        ],
        resources: [
            { name: "Documentation", href: "#" },
            { name: "API Reference", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Support", href: "/dashboard/support" },
        ],
        legal: [
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
            { name: "Cookie Policy", href: "#" },
            { name: "GDPR", href: "#" },
        ],
    }

    return (
        <footer className="border-t border-white/5 bg-[#0A0A0A] py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    {/* Product */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
                            Product
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.product.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
                            Resources
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.resources.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
                            Legal
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
                            Newsletter
                        </h4>
                        <p className="text-gray-500 text-sm mb-4">
                            Get the latest updates and insights delivered to your inbox.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#00C975] h-10 text-sm"
                            />
                            <Button className="bg-[#00C975] hover:bg-[#00C975]/90 text-black font-semibold px-4 h-10 shrink-0">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-8">
                        <div className="text-2xl font-bold tracking-wider text-white">
                            FROME.IO
                        </div>
                        <p className="text-sm text-gray-600">
                            © 2026 Frome.io. All rights reserved.
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a
                            href="#"
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                        <a
                            href="#"
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                        >
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

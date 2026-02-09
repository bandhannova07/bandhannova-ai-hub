'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface GuestLayoutProps {
    children: ReactNode;
    showAuthButtons?: boolean;
}

export default function GuestLayout({ children, showAuthButtons = true }: GuestLayoutProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image
                            src="/bandhannova-logo-final.svg"
                            alt="BandhanNova"
                            width={160}
                            height={36}
                            className="object-contain"
                        />
                    </Link>

                    {/* Auth Buttons */}
                    {showAuthButtons && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="px-5 py-2.5 rounded-xl glass font-bold text-sm hover:bg-white/5 transition-all text-foreground"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => router.push('/signup')}
                                className="px-5 py-2.5 rounded-xl bg-gradient-hero text-white font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Sign Up Free
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-background-secondary/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="inline-block mb-4">
                                <Image
                                    src="/bandhannova-logo-final.svg"
                                    alt="BandhanNova"
                                    width={180}
                                    height={40}
                                    className="object-contain"
                                />
                            </Link>
                            <p className="text-foreground-secondary text-sm leading-relaxed max-w-md">
                                India's first next-generation AI life-growing platform designed for the Gen-Z era.
                                Multi-brain AI system for learning, creativity, and personal growth.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-foreground-secondary hover:text-foreground transition-colors text-sm"
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-foreground-secondary hover:text-foreground transition-colors text-sm"
                                    >
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/guest-chat"
                                        className="text-foreground-secondary hover:text-foreground transition-colors text-sm"
                                    >
                                        Try Free
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="font-bold text-foreground mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="text-foreground-secondary hover:text-foreground transition-colors text-sm"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="text-foreground-secondary hover:text-foreground transition-colors text-sm"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/refunds"
                                        className="text-foreground-secondary hover:text-foreground transition-colors text-sm"
                                    >
                                        Refund Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-foreground-tertiary text-sm">
                            © {new Date().getFullYear()} BandhanNova Platforms. All rights reserved.
                        </p>
                        <p className="text-foreground-tertiary text-sm">
                            Made with ❤️ in India for Gen-Z
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

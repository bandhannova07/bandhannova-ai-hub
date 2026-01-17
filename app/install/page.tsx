'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Zap,
    Shield,
    Smartphone,
    Wifi,
    Maximize,
    CheckCircle2,
    ArrowRight,
    X
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth-simple';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
    const router = useRouter();
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        checkAuth();
        checkInstallStatus();

        // Capture the install prompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    async function checkAuth() {
        const { user } = await getCurrentUser();
        if (!user) {
            router.push('/login');
        }
    }

    function checkInstallStatus() {
        // Check if app is already installed
        const installed = window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            (window.navigator as any).standalone === true;

        setIsInstalled(installed);

        // If already installed, redirect to dashboard
        if (installed) {
            router.push('/dashboard');
        }

        // Check if user has already seen the prompt
        const promptShown = localStorage.getItem('installPromptShown');
        if (promptShown === 'skipped') {
            // User skipped before, but we can show again
            // Don't auto-redirect, let them see the page
        }
    }

    async function handleInstall() {
        if (!deferredPrompt) {
            // If prompt not available, just redirect to dashboard
            localStorage.setItem('installPromptShown', 'attempted');
            router.push('/dashboard');
            return;
        }

        try {
            // Show the install prompt
            await deferredPrompt.prompt();

            // Wait for user choice
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                localStorage.setItem('appInstalled', 'true');
                localStorage.setItem('installPromptShown', 'accepted');
                // Redirect to dashboard after installation
                setTimeout(() => {
                    router.push('/dashboard');
                }, 500);
            } else {
                localStorage.setItem('installPromptShown', 'dismissed');
                router.push('/dashboard');
            }

            setDeferredPrompt(null);
        } catch (error) {
            console.error('Install error:', error);
            router.push('/dashboard');
        }
    }

    function handleSkip() {
        localStorage.setItem('installPromptShown', 'skipped');
        router.push('/dashboard');
    }

    const benefits = [
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Instant loading, no waiting. Experience blazing speed.',
            gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
        },
        {
            icon: Wifi,
            title: 'Works Offline',
            description: 'Access your AI assistants even without internet.',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your data stays on your device. Complete privacy.',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            icon: Smartphone,
            title: 'One-Tap Access',
            description: 'Launch directly from your home screen.',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
            icon: Maximize,
            title: 'Full Screen',
            description: 'Immersive experience without browser clutter.',
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        },
        {
            icon: CheckCircle2,
            title: 'Always Updated',
            description: 'Get the latest features automatically.',
            gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
        }
    ];

    return (
        <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4" style={{ padding: '12px', paddingBottom: '32px' }}>
            {/* Gradient Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-4xl w-full py-12">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-8"
                >
                    <div className="flex justify-center mb-12">
                        <Link href="/">
                            <Image
                                src="/bandhannova-logo-final.svg"
                                alt="BandhanNova Logo"
                                width={350}
                                height={350}
                                className="cursor-pointer hover:scale-105 transition-transform"
                                style={{ padding: '20px' }}
                                priority
                            />
                        </Link>
                    </div>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl p-8 md:p-12"
                    style={{ padding: '16px' }}
                >
                    {/* Header */}
                    <div className="text-center mb-10" style={{ padding: '10px' }}>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="h1 mb-4"
                            style={{ color: 'var(--foreground)' }}
                        >
                            Get the <span className="gradient-text">Full Experience</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="body-large"
                            style={{ color: 'var(--foreground-secondary)' }}
                        >
                            Install BandhanNova for the best AI experience
                        </motion.p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform"
                                    style={{ padding: '10px' }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                        style={{ background: benefit.gradient }}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="h3 mb-2" style={{ color: 'var(--foreground)' }}>
                                        {benefit.title}
                                    </h3>
                                    <p className="small" style={{ color: 'var(--foreground-secondary)' }}>
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        style={{ padding: '18px' }}
                    >
                        <Button
                            onClick={handleInstall}
                            size="lg"
                            className="group relative px-8 py-6 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105"
                            style={{ background: 'var(--gradient-hero)', padding: '12px' }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                Install App
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        </Button>

                        <Button
                            onClick={handleSkip}
                            variant="outline"
                            size="lg"
                            className="px-8 py-6 rounded-2xl font-semibold text-lg glass transition-all duration-300 hover:scale-105"
                            style={{ padding: '12px' }}
                        >
                            <span className="flex items-center gap-2">
                                <X className="w-5 h-5" />
                                Skip for now
                            </span>
                        </Button>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="text-center mt-6 small"
                        style={{ color: 'var(--foreground-tertiary)' }}
                    >
                        You can install the app anytime from your browser settings
                    </motion.p>
                </motion.div>
            </div>
        </main>
    );
}

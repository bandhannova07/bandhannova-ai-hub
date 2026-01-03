'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import {
    Sparkles,
    Lightbulb,
    Brain,
    BookOpen,
    Briefcase,
    MessageCircle,
    Code,
    LogOut,
    Home,
    User,
    Menu,
    X,
    CreditCard,
    Info,
    ArrowRight,
    Check,
    Zap,
    Crown,
    Infinity,
    FileText,
    Shield,
    MessageSquare,
    Image as ImageIcon,
    ChefHat,
    Search,
    HelpCircle,
    Globe
} from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/auth-simple';
import { getAllDBs } from '@/lib/database/multi-db';

const AI_AGENTS = [
    {
        id: 'creator-social',
        name: 'Creator & Social Media',
        icon: Sparkles,
        gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        description: 'Content creation, social media posts, viral captions',
        features: ['Instagram Posts', 'YouTube Scripts', 'Viral Content']
    },
    {
        id: 'creative-productivity',
        name: 'Creative & Productivity',
        icon: Lightbulb,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        description: 'Brainstorming, writing, productivity optimization',
        features: ['Idea Generation', 'Writing Help', 'Task Planning']
    },
    {
        id: 'psychology-personality',
        name: 'Psychology & Personality',
        icon: Brain,
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        description: 'Personality insights, mental health, self-improvement',
        features: ['Personality Test', 'Mental Health', 'Self Growth']
    },
    {
        id: 'study-learning',
        name: 'Study & Learning',
        icon: BookOpen,
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        description: 'Study help, explanations, exam preparation',
        features: ['Homework Help', 'Concept Clarity', 'Exam Prep']
    },
    {
        id: 'business-career',
        name: 'Business & Career',
        icon: Briefcase,
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        description: 'Business strategy, career guidance, growth tips',
        features: ['Business Plan', 'Career Advice', 'Resume Help']
    },
    {
        id: 'conversational',
        name: 'Conversational AI',
        icon: MessageCircle,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        description: 'General chat, questions, friendly assistance',
        features: ['General Chat', 'Q&A', 'Daily Help']
    },
    {
        id: 'website-builder',
        name: 'Website Builder',
        icon: Code,
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        description: 'Code generation, web development, debugging',
        features: ['Code Gen', 'Bug Fixes', 'Web Design']
    },
    {
        id: 'image-maker',
        name: 'Image Maker AI',
        icon: ImageIcon,
        gradient: '#FF6B9D',
        description: 'Create stunning images, graphics, and visual content from text',
        features: ['Image Generation', 'Graphics Design', 'Visual Content']
    },
    {
        id: 'kitchen-recipe',
        name: 'Kitchen & Recipe AI',
        icon: ChefHat,
        gradient: '#00D9FF',
        description: 'Get delicious recipes, cooking tips, and meal planning',
        features: ['Recipes', 'Cooking Tips', 'Meal Planning']
    },
    {
        id: 'search-engine',
        name: 'Research & Discovery AI',
        icon: Globe,
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        description: 'Web research, information discovery, knowledge exploration',
        features: ['Web Research', 'Discovery', 'Knowledge']
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeView, setActiveView] = useState<'dashboard' | 'plans' | 'about'>('dashboard');
    const [stats, setStats] = useState({
        conversations: 0,
        messages: 0,
        agents: 7,
        plan: 'Free'
    });

    useEffect(() => {
        checkAuth();

        // Set initial sidebar state based on screen size
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            if (desktop) {
                setSidebarOpen(true); // Desktop: open by default
            } else {
                setSidebarOpen(false); // Mobile: closed by default
            }
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function checkAuth() {
        const { user: currentUser } = await getCurrentUser();
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        await loadStats(currentUser.id);
        setLoading(false);
    }

    async function loadStats(userId: string) {
        try {
            // Load plan from Supabase database
            const databases = getAllDBs();
            let userPlan = 'Free';

            // Try to get plan from database
            for (const db of databases) {
                const { data: profile, error } = await db
                    .from('profiles')
                    .select('plan')
                    .eq('id', userId)
                    .single();

                if (!error && profile?.plan) {
                    // Capitalize first letter
                    userPlan = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);
                    // Sync with localStorage
                    localStorage.setItem('userPlan', userPlan);
                    console.log(`✅ Loaded plan from DB: ${userPlan}`);
                    break;
                }
            }

            // If not in DB, check localStorage as fallback
            if (userPlan === 'Free') {
                const storedPlan = localStorage.getItem('userPlan');
                if (storedPlan) {
                    userPlan = storedPlan;
                }
            }

            // Load stats from localStorage (conversations are stored locally)
            const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
            const messages = JSON.parse(localStorage.getItem('messages') || '[]');

            setStats({
                conversations: conversations.length,
                messages: messages.length,
                agents: 7, // Total AI agents available
                plan: userPlan
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
            setStats({
                conversations: 0,
                messages: 0,
                agents: 7,
                plan: 'Free'
            });
        }
    }

    async function handleSignOut() {
        await signOut();
        router.push('/');
    }

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: 'var(--background)' }}
            >
                <div className="text-center">
                    <div
                        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"
                        style={{ marginBottom: '16px' }}
                    ></div>
                    <p style={{ color: 'var(--foreground-secondary)', fontSize: '15px' }}>
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden flex">
            {/* Razorpay Script */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 glass border-r transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{
                    width: '380px',
                    borderColor: 'var(--background-tertiary)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div
                    className="flex flex-col h-full"
                    style={{ padding: '32px 24px' }}
                >
                    {/* Logo */}
                    <div style={{ marginBottom: '40px', marginTop: '24px' }}>
                        <Image
                            src="/bandhannova-logo-final.svg"
                            alt="BandhanNova AI Hub"
                            width={240}
                            height={80}
                            style={{ marginBottom: '8px' }}
                        />
                        <p style={{ color: 'var(--foreground-tertiary)', fontSize: '18px' }}>
                            AI Hub Dashboard
                        </p>
                    </div>

                    {/* User Info */}
                    <div
                        className="glass rounded-2xl"
                        style={{
                            padding: '16px',
                            marginBottom: '32px',
                            border: '1px solid var(--background-tertiary)'
                        }}
                    >
                        <div className="flex items-center gap-3" style={{ marginBottom: '12px' }}>
                            <div
                                className="rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0"
                                style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px' }}
                            >
                                <span className="text-white font-bold text-lg">
                                    {user?.email?.[0].toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <p
                                    className="font-semibold"
                                    style={{
                                        color: 'white',
                                        fontSize: '18px',
                                        marginBottom: '2px'
                                    }}
                                >
                                    {user?.user_metadata?.full_name || 'User'}
                                </p>
                                <p style={{ color: 'var(--foreground-tertiary)', fontSize: '15px' }}>
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div
                            className="grid grid-cols-3 gap-2"
                            style={{ paddingTop: '12px', borderTop: '1px solid var(--background-tertiary)' }}
                        >
                            <div className="text-center">
                                <p
                                    className="font-bold"
                                    style={{ color: 'var(--foreground)', fontSize: '18px' }}
                                >
                                    {stats.conversations}
                                </p>
                                <p style={{ color: 'var(--foreground-tertiary)', fontSize: '13px' }}>
                                    Chats
                                </p>
                            </div>
                            <div className="text-center">
                                <p
                                    className="font-bold"
                                    style={{ color: 'var(--foreground)', fontSize: '18px' }}
                                >
                                    {stats.messages}
                                </p>
                                <p style={{ color: 'var(--foreground-tertiary)', fontSize: '13px' }}>
                                    Messages
                                </p>
                            </div>
                            <div className="text-center">
                                <p
                                    className="font-bold"
                                    style={{ color: 'var(--foreground)', fontSize: '18px' }}
                                >
                                    {stats.plan}
                                </p>
                                <p style={{ color: 'var(--foreground-tertiary)', fontSize: '13px' }}>
                                    Plan
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1" style={{ marginBottom: '24px' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <p
                                style={{
                                    color: 'var(--foreground-tertiary)',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '12px',
                                    paddingLeft: '16px'
                                }}
                            >
                                Menu
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                                onClick={() => setActiveView('dashboard')}
                                className="flex items-center gap-3 rounded-xl transition-all hover:scale-105"
                                style={{
                                    padding: '14px 16px',
                                    background: activeView === 'dashboard' ? 'var(--gradient-hero)' : 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left'
                                }}
                            >
                                <Home className="w-5 h-5" />
                                <span style={{ fontSize: '18px', fontWeight: '500' }}>Dashboard</span>
                            </button>

                            <button
                                onClick={() => setActiveView('plans')}
                                className="flex items-center gap-3 rounded-xl transition-all hover:scale-105 w-full text-left"
                                style={{
                                    padding: '14px 16px',
                                    background: activeView === 'plans' ? 'var(--gradient-hero)' : 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span style={{ fontSize: '18px', fontWeight: '500' }}>Plans</span>
                            </button>

                            <button
                                onClick={() => setActiveView('about')}
                                className="flex items-center gap-3 rounded-xl transition-all hover:scale-105"
                                style={{
                                    padding: '14px 16px',
                                    background: activeView === 'about' ? 'var(--gradient-hero)' : 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left'
                                }}
                            >
                                <Info className="w-5 h-5" />
                                <span style={{ fontSize: '18px', fontWeight: '500' }}>About</span>
                            </button>

                            <Link
                                href="/contact"
                                className="flex items-center gap-3 rounded-xl transition-all hover:scale-105"
                                style={{
                                    padding: '14px 16px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left',
                                    textDecoration: 'none'
                                }}
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span style={{ fontSize: '18px', fontWeight: '500' }}>Feedback</span>
                            </Link>
                        </div>
                    </nav>

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 rounded-xl transition-all hover:scale-105 text-red-500"
                        style={{
                            padding: '14px 16px',
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <LogOut className="w-5 h-5" />
                        <span style={{ fontSize: '18px', fontWeight: '500' }}>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay - Only on Mobile */}
            {sidebarOpen && !isDesktop && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40"
                />
            )}

            {/* Sidebar Toggle Button - All Screens */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed rounded-2xl glass z-50"
                style={{
                    top: '24px',
                    left: sidebarOpen ? '400px' : '24px',
                    padding: '12px',
                    transition: 'left 0.3s ease'
                }}
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Main Content */}
            <div
                className="relative flex-1 overflow-y-auto transition-all duration-300"
                style={{
                    marginLeft: isDesktop && sidebarOpen ? '380px' : '0'
                }}
            >
                <div
                    style={{ padding: '48px 32px' }}
                >
                    {/* Dashboard View - AI Agents */}
                    {activeView === 'dashboard' && (
                        <>
                            {/* Welcome Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ marginBottom: '48px', marginTop: '120px' }}
                            >
                                <h1
                                    className="font-bold"
                                    style={{
                                        fontSize: '48px',
                                        color: 'var(--foreground)',
                                        marginBottom: '12px',
                                        lineHeight: '1.2'
                                    }}
                                >
                                    Welcome back, <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">{user?.user_metadata?.full_name?.split(' ')[0] || 'there'}</span>! 👋
                                </h1>
                                <p
                                    style={{
                                        fontSize: '18px',
                                        color: 'var(--foreground-secondary)',
                                        lineHeight: '1.6'
                                    }}
                                >
                                    Choose an AI agent to start your conversation and unlock limitless possibilities
                                </p>
                            </motion.div>

                            {/* AI Agents - Categorized */}
                            <div style={{ marginBottom: '60px' }}>
                                {/* Default (Free Now) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginBottom: '40px' }}
                                >
                                    <h3
                                        className="font-bold"
                                        style={{
                                            fontSize: '24px',
                                            color: 'var(--foreground)',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        Default <span style={{ color: 'var(--foreground-tertiary)', fontSize: '16px', fontWeight: 'normal' }}>(Free Now)</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
                                        {AI_AGENTS.filter(agent => ['conversational', 'search-engine'].includes(agent.id)).map((agent, index) => {
                                            const Icon = agent.icon;
                                            return (
                                                <motion.div
                                                    key={agent.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ scale: 1.03, y: -8 }}
                                                    className="group cursor-pointer"
                                                    onClick={() => router.push(`/chat/${agent.id}`)}
                                                >
                                                    <div
                                                        className="glass rounded-3xl h-full border transition-all"
                                                        style={{
                                                            padding: '28px',
                                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                                            backdropFilter: 'blur(20px)',
                                                        }}
                                                    >
                                                        <div
                                                            className="rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                                                            style={{
                                                                width: '72px',
                                                                height: '72px',
                                                                background: agent.gradient,
                                                                marginBottom: '20px',
                                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                                            }}
                                                        >
                                                            <Icon className="w-9 h-9 text-white" />
                                                        </div>
                                                        <h3
                                                            className="font-bold"
                                                            style={{
                                                                fontSize: '20px',
                                                                color: 'var(--foreground)',
                                                                marginBottom: '8px',
                                                                lineHeight: '1.3'
                                                            }}
                                                        >
                                                            {agent.name}
                                                        </h3>
                                                        <p
                                                            style={{
                                                                fontSize: '14px',
                                                                color: 'var(--foreground-secondary)',
                                                                marginBottom: '16px',
                                                                lineHeight: '1.6'
                                                            }}
                                                        >
                                                            {agent.description}
                                                        </p>
                                                        <div
                                                            className="flex flex-wrap"
                                                            style={{ gap: '8px', marginBottom: '20px' }}
                                                        >
                                                            {agent.features.map((feature, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="rounded-lg"
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        fontSize: '12px',
                                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                                        color: 'var(--foreground-tertiary)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                                                    }}
                                                                >
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div
                                                            className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                                                            style={{
                                                                fontSize: '14px',
                                                                color: 'var(--primary-purple)'
                                                            }}
                                                        >
                                                            <span>Start Chat</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Featured (Free Limited) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    style={{ marginBottom: '40px' }}
                                >
                                    <h3
                                        className="font-bold"
                                        style={{
                                            fontSize: '24px',
                                            color: 'var(--foreground)',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        Featured <span style={{ color: 'var(--foreground-tertiary)', fontSize: '16px', fontWeight: 'normal' }}>(Free Limited)</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
                                        {AI_AGENTS.filter(agent =>
                                            ['study-learning', 'creative-productivity', 'psychology-personality', 'creator-social', 'business-career', 'image-maker', 'kitchen-recipe'].includes(agent.id)
                                        ).map((agent, index) => {
                                            const Icon = agent.icon;
                                            return (
                                                <motion.div
                                                    key={agent.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + index * 0.1 }}
                                                    whileHover={{ scale: 1.03, y: -8 }}
                                                    className="group cursor-pointer"
                                                    onClick={() => router.push(`/chat/${agent.id}`)}
                                                >
                                                    <div
                                                        className="glass rounded-3xl h-full border transition-all"
                                                        style={{
                                                            padding: '28px',
                                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                                            backdropFilter: 'blur(20px)',
                                                        }}
                                                    >
                                                        <div
                                                            className="rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                                                            style={{
                                                                width: '72px',
                                                                height: '72px',
                                                                background: agent.gradient,
                                                                marginBottom: '20px',
                                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                                            }}
                                                        >
                                                            <Icon className="w-9 h-9 text-white" />
                                                        </div>
                                                        <h3
                                                            className="font-bold"
                                                            style={{
                                                                fontSize: '20px',
                                                                color: 'var(--foreground)',
                                                                marginBottom: '8px',
                                                                lineHeight: '1.3'
                                                            }}
                                                        >
                                                            {agent.name}
                                                        </h3>
                                                        <p
                                                            style={{
                                                                fontSize: '14px',
                                                                color: 'var(--foreground-secondary)',
                                                                marginBottom: '16px',
                                                                lineHeight: '1.6'
                                                            }}
                                                        >
                                                            {agent.description}
                                                        </p>
                                                        <div
                                                            className="flex flex-wrap"
                                                            style={{ gap: '8px', marginBottom: '20px' }}
                                                        >
                                                            {agent.features.map((feature, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="rounded-lg"
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        fontSize: '12px',
                                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                                        color: 'var(--foreground-tertiary)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                                                    }}
                                                                >
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div
                                                            className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                                                            style={{
                                                                fontSize: '14px',
                                                                color: 'var(--primary-purple)'
                                                            }}
                                                        >
                                                            <span>Start Chat</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Coming Soon */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <h3
                                        className="font-bold"
                                        style={{
                                            fontSize: '24px',
                                            color: 'var(--foreground)',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        Coming Soon
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
                                        {AI_AGENTS.filter(agent => agent.id === 'website-builder').map((agent, index) => {
                                            const Icon = agent.icon;
                                            return (
                                                <motion.div
                                                    key={agent.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.8 + index * 0.1 }}
                                                    className="group cursor-not-allowed opacity-60"
                                                >
                                                    <div
                                                        className="glass rounded-3xl h-full border transition-all relative overflow-hidden"
                                                        style={{
                                                            padding: '28px',
                                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                                            backdropFilter: 'blur(20px)',
                                                        }}
                                                    >
                                                        {/* Coming Soon Ribbon */}
                                                        <div
                                                            className="absolute font-bold text-xs"
                                                            style={{
                                                                top: '30px',
                                                                right: '-50px',
                                                                background: 'var(--gradient-hero)',
                                                                color: 'white',
                                                                padding: '6px 48px',
                                                                transform: 'rotate(45deg)',
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                                                zIndex: 10
                                                            }}
                                                        >
                                                            COMING SOON
                                                        </div>

                                                        <div
                                                            className="rounded-2xl flex items-center justify-center"
                                                            style={{
                                                                width: '72px',
                                                                height: '72px',
                                                                background: agent.gradient,
                                                                marginBottom: '20px',
                                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                                            }}
                                                        >
                                                            <Icon className="w-9 h-9 text-white" />
                                                        </div>
                                                        <h3
                                                            className="font-bold"
                                                            style={{
                                                                fontSize: '20px',
                                                                color: 'var(--foreground)',
                                                                marginBottom: '8px',
                                                                lineHeight: '1.3'
                                                            }}
                                                        >
                                                            {agent.name}
                                                        </h3>
                                                        <p
                                                            style={{
                                                                fontSize: '14px',
                                                                color: 'var(--foreground-secondary)',
                                                                marginBottom: '16px',
                                                                lineHeight: '1.6'
                                                            }}
                                                        >
                                                            {agent.description}
                                                        </p>
                                                        <div
                                                            className="flex flex-wrap"
                                                            style={{ gap: '8px', marginBottom: '20px' }}
                                                        >
                                                            {agent.features.map((feature, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="rounded-lg"
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        fontSize: '12px',
                                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                                        color: 'var(--foreground-tertiary)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                                                    }}
                                                                >
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div
                                                            className="flex items-center gap-2 font-medium"
                                                            style={{
                                                                fontSize: '14px',
                                                                color: 'var(--foreground-tertiary)'
                                                            }}
                                                        >
                                                            <span>Coming Soon</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            </div>

                        </>
                    )}

                    {/* Plans View - Pricing Plans */}
                    {activeView === 'plans' && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-12"
                            >
                                <h2
                                    className="font-bold mb-4"
                                    style={{
                                        fontSize: '42px',
                                        color: 'var(--foreground)',
                                        marginTop: '32px'
                                    }}
                                >
                                    Choose Your <span className="gradient-text">Growth Plan</span>
                                </h2>
                                <p
                                    className="text-center mx-auto"
                                    style={{
                                        fontSize: '18px',
                                        color: 'var(--foreground-secondary)',
                                        lineHeight: '1.6',
                                        maxWidth: 'auto',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        display: 'block',
                                        marginBottom: '30px'
                                    }}
                                >
                                    Unlock the full potential of AI-powered growth with plans designed for every journey
                                </p>
                            </motion.div>

                            {/* Pricing Cards */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                                style={{ gap: '48px', marginBottom: '60px' }}
                            >
                                {[
                                    {
                                        name: 'Free',
                                        price: '₹0',
                                        period: 'forever',
                                        icon: Sparkles,
                                        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        popular: false,
                                        features: [
                                            '20 Messages/Day with Conversational AI',
                                            '5 Image Generation/Day',
                                            'Only 5 Research Chat/Day',
                                            '15 Messages/Day with Every Featured AI Agents',
                                            'AI Remember Limited Memories',
                                            'Unlimited Web Searching with Research & Discovery AI',
                                            "Limited Access of BandhanNova's latest models Ispat-v2-fast, Barud2-pro and Barud3"
                                        ]
                                    },
                                    {
                                        name: 'Pro',
                                        price: '₹249',
                                        period: 'per month',
                                        icon: Zap,
                                        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        popular: false,
                                        features: [
                                            '30+ Messages/Day with Conversational AI',
                                            '10+ Image Generation/Day',
                                            'Only 15 Research Chat/Day',
                                            'Expanded AI Memories',
                                            '25+ Messages/Day with Every Featured AI Agents',
                                            'Unlimited Web Searching with Research & Discovery AI',
                                            'Local Languages Available',
                                            'Agent Remembers The User',
                                            "Limited Full Access of BandhanNova's most trained models Ispat-v2-fast, Ispat-v3-pro/ultra/maxx and Barud2-pro, Barud3 and Barud3-maxx"
                                        ]
                                    },
                                    {
                                        name: 'Ultra',
                                        price: '₹699',
                                        period: 'per month',
                                        badge: 'Most Popular',
                                        icon: Crown,
                                        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        popular: true,
                                        features: [
                                            'more Chats with Conversational AI',
                                            'More Image Generation/Day',
                                            'Ultra Fast Memory Management',
                                            'More Research Chats',
                                            'Expanded AI Memories',
                                            'Many Messages Per Day with Every Featured AI Agents',
                                            'Unlimited Web Searching with Research & Discovery AI',
                                            'Many Local Language Available',
                                            'Agent Remembers The User',
                                            "Access of BandhanNova's most trained models Ispat-v2-fast, Ispat-v3-pro/ultra/maxx and Barud2-pro, Barud3 and Barud3-maxx"
                                        ]
                                    },
                                    {
                                        name: 'Maxx',
                                        price: '₹1,999',
                                        period: 'per month',
                                        icon: Infinity,
                                        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                        popular: false,
                                        features: [
                                            'Unlimited Messages/Day with Conversational AI',
                                            'Unlimited Image Generation/Day',
                                            'Ultra Fast Memory Management',
                                            'Many Research Chat/Day',
                                            'Ultra Fast AI Memories',
                                            'Unlimited Messages/Day with Every Featured AI Agents',
                                            'Unlimited Web Searching with Research & Discovery AI',
                                            'All Local Language Available',
                                            'Agent Never Forget The User',
                                            "Full Access of BandhanNova's most trained models Ispat-v2-fast, Ispat-v3-pro/ultra/maxx and Barud2-pro, Barud3 and Barud3-maxx"
                                        ]
                                    }
                                ].map((plan, index) => {
                                    const Icon = plan.icon;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.03, y: -8 }}
                                            className="relative glass rounded-3xl border transition-all"
                                            style={{
                                                padding: '40px 28px',
                                                borderColor: plan.popular ? 'var(--primary-purple)' : 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(20px)',
                                                minHeight: '750px',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {plan.popular && (
                                                <div
                                                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 h-7 w-28 rounded-2xl text-sm font-semibold text-white text-center flex flex-col justify-center"
                                                    style={{ background: 'var(--gradient-hero)' }}
                                                >
                                                    {plan.badge}
                                                </div>
                                            )}

                                            <div
                                                className="rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                                style={{
                                                    width: '64px',
                                                    height: '64px',
                                                    background: plan.gradient,
                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                                }}
                                            >
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>

                                            <h3
                                                className="font-bold mb-2 text-center"
                                                style={{
                                                    fontSize: '32px',
                                                    color: 'var(--foreground)'
                                                }}
                                            >
                                                {plan.name}
                                            </h3>

                                            <div className="mb-6 text-center">
                                                <div className="flex items-baseline gap-2 justify-center">
                                                    <span
                                                        className="font-bold"
                                                        style={{
                                                            fontSize: '40px',
                                                            color: 'var(--foreground)'
                                                        }}
                                                    >
                                                        {plan.price}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: '16px',
                                                            color: 'var(--foreground-secondary)'
                                                        }}
                                                    >
                                                        {plan.period}
                                                    </span>
                                                </div>
                                            </div>

                                            <ul className="space-y-3 mb-6 flex-grow">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <Check
                                                            className="flex-shrink-0"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                color: 'var(--accent-cyan)',
                                                                marginTop: '2px'
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                fontSize: '16px',
                                                                color: 'var(--foreground-secondary)',
                                                                lineHeight: '1.5'
                                                            }}
                                                        >
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={async () => {
                                                    if (plan.name === 'Free') {
                                                        alert('You are currently on the Free plan!');
                                                        return;
                                                    }

                                                    // Simple Razorpay test
                                                    try {
                                                        const amount = parseInt(plan.price.replace(/[^0-9]/g, ''));

                                                        // Create test order
                                                        const response = await fetch('/api/payment/test-order', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ amount })
                                                        });

                                                        const data = await response.json();

                                                        if (!response.ok) {
                                                            alert(data.error || 'Failed to create order');
                                                            return;
                                                        }

                                                        // Open Razorpay
                                                        const options = {
                                                            key: data.keyId,
                                                            amount: data.amount * 100,
                                                            currency: 'INR',
                                                            name: 'BandhanNova AI Hub',
                                                            description: `${plan.name} Plan - Test Payment`,
                                                            order_id: data.orderId,
                                                            handler: async function (response: any) {
                                                                try {
                                                                    // Verify payment
                                                                    const verifyRes = await fetch('/api/payment/verify-test', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({
                                                                            razorpay_order_id: response.razorpay_order_id,
                                                                            razorpay_payment_id: response.razorpay_payment_id,
                                                                            razorpay_signature: response.razorpay_signature,
                                                                            planName: plan.name,
                                                                            amount: data.amount,
                                                                            userId: user?.id // Pass user ID for DB update
                                                                        })
                                                                    });

                                                                    if (verifyRes.ok) {
                                                                        // Store plan in localStorage for demo
                                                                        localStorage.setItem('userPlan', plan.name);

                                                                        alert(`✅ Payment Successful!\n\nYou are now on ${plan.name} Plan!\n\nPayment ID: ${response.razorpay_payment_id}`);

                                                                        // Reload to show new plan
                                                                        window.location.reload();
                                                                    } else {
                                                                        alert('Payment verification failed. Please contact support.');
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Verification error:', error);
                                                                    alert('Payment successful but verification failed. Please contact support.');
                                                                }
                                                            },
                                                            theme: { color: '#8B5CF6' }
                                                        };

                                                        const rzp = new (window as any).Razorpay(options);
                                                        rzp.open();
                                                    } catch (error) {
                                                        console.error('Payment error:', error);
                                                        alert('Payment failed. Please try again.');
                                                    }
                                                }}
                                                className="w-full rounded-xl font-semibold transition-all hover:scale-105"
                                                style={{
                                                    padding: '14px',
                                                    background: plan.name === stats.plan
                                                        ? 'rgba(76, 175, 80, 0.2)' // Green for current plan
                                                        : (plan.name === 'Free' && stats.plan !== 'Free')
                                                            ? 'rgba(128, 128, 128, 0.2)' // Gray for Free when user has paid plan
                                                            : plan.popular ? 'var(--gradient-hero)' : 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    border: plan.name === stats.plan
                                                        ? '2px solid rgba(76, 175, 80, 0.8)'
                                                        : (plan.name === 'Free' && stats.plan !== 'Free')
                                                            ? '1px solid rgba(128, 128, 128, 0.5)'
                                                            : plan.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                                                    cursor: (plan.name === stats.plan || (plan.name === 'Free' && stats.plan !== 'Free')) ? 'not-allowed' : 'pointer',
                                                    opacity: (plan.name === stats.plan || (plan.name === 'Free' && stats.plan !== 'Free')) ? 0.7 : 1
                                                }}
                                                type="button"
                                                disabled={plan.name === stats.plan || (plan.name === 'Free' && stats.plan !== 'Free')}
                                            >
                                                {plan.name === stats.plan
                                                    ? '✓ In Use'
                                                    : (plan.name === 'Free' && stats.plan !== 'Free')
                                                        ? 'Not Available'
                                                        : 'Upgrade Now'}
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* About View - Navigation Cards */}
                    {activeView === 'about' && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-12"
                            >
                                <h2
                                    className="font-bold mb-4"
                                    style={{
                                        fontSize: '36px',
                                        color: 'var(--foreground)'
                                    }}
                                >
                                    About & <span className="gradient-text">Policies</span>
                                </h2>
                                <p
                                    className="text-center mx-auto"
                                    style={{
                                        fontSize: '16px',
                                        color: 'var(--foreground-secondary)',
                                        lineHeight: '1.6',
                                        maxWidth: '600px',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        display: 'block',
                                        marginBottom: '30px'
                                    }}
                                >
                                    Learn more about BandhanNova AI Hub, our policies, and terms
                                </p>
                            </motion.div>

                            {/* Navigation Cards */}
                            <div
                                className="grid h-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                                style={{ maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto' }}
                            >
                                {/* Terms & Conditions Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    whileHover={{ scale: 1.03, y: -8 }}
                                    className="glass rounded-3xl border cursor-pointer"
                                    style={{
                                        padding: '40px 32px',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                    onClick={() => router.push('/terms')}
                                >
                                    <div
                                        className="rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        <FileText className="w-10 h-10 text-white" />
                                    </div>
                                    <h2
                                        className="font-bold mb-4 text-center"
                                        style={{
                                            fontSize: '24px',
                                            color: 'var(--foreground)',
                                            marginBottom: '7px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        Terms & Conditions
                                    </h2>
                                    <p
                                        className="mb-8 text-center"
                                        style={{
                                            fontSize: '16px',
                                            color: 'var(--foreground-secondary)',
                                            lineHeight: '1.6',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        Understand your rights and responsibilities when using our AI platform. Review our comprehensive terms of service and usage guidelines.
                                    </p>
                                    <Link
                                        href="/terms"
                                        className="flex items-center gap-2 font-medium transition-all"
                                        style={{
                                            fontSize: '14px',
                                            color: 'var(--primary-purple)',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <span>View Terms</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>

                                {/* Privacy & Policies Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.03, y: -8 }}
                                    className="glass rounded-3xl border cursor-pointer"
                                    style={{
                                        padding: '40px 32px',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                    onClick={() => router.push('/privacy')}
                                >
                                    <div
                                        className="rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        <Shield className="w-10 h-10 text-white" />
                                    </div>
                                    <h2
                                        className="font-bold mb-4 text-center"
                                        style={{
                                            fontSize: '24px',
                                            color: 'var(--foreground)',
                                            marginBottom: '7px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        Privacy & Policies
                                    </h2>
                                    <p
                                        className="mb-8 text-center"
                                        style={{
                                            fontSize: '16px',
                                            color: 'var(--foreground-secondary)',
                                            lineHeight: '1.6',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        Your privacy matters to us. Learn how we collect, use, and protect your personal data with industry-leading security standards.
                                    </p>
                                    <Link
                                        href="/privacy"
                                        className="flex items-center gap-2 font-medium transition-all"
                                        style={{
                                            fontSize: '14px',
                                            color: 'var(--primary-purple)',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <span>View Privacy Policy</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>

                                {/* About BandhanNova Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.03, y: -8 }}
                                    className="glass rounded-3xl border cursor-pointer"
                                    style={{
                                        padding: '40px 32px',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                    onClick={() => router.push('/about')}
                                >
                                    <div
                                        className="rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        <Info className="w-10 h-10 text-white" />
                                    </div>
                                    <h2
                                        className="font-bold mb-4 text-center"
                                        style={{
                                            fontSize: '24px',
                                            color: 'var(--foreground)',
                                            marginBottom: '7px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        About BandhanNova
                                    </h2>
                                    <p
                                        className="mb-8 text-center"
                                        style={{
                                            fontSize: '16px',
                                            color: 'var(--foreground-secondary)',
                                            lineHeight: '1.6',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        Discover our mission to democratize AI for India. Learn about our vision, values, and the team behind BandhanNova AI Hub.
                                    </p>
                                    <Link
                                        href="/about"
                                        className="flex items-center gap-2 font-medium transition-all"
                                        style={{
                                            fontSize: '14px',
                                            color: 'var(--primary-purple)',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <span>Learn More</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>

                                {/* FAQ Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ scale: 1.03, y: -8 }}
                                    className="glass rounded-3xl border cursor-pointer"
                                    style={{
                                        padding: '48px 36px',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                    onClick={() => router.push('/faq')}
                                >
                                    <div
                                        className="rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        <HelpCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h2
                                        className="font-bold text-center mb-4"
                                        style={{
                                            fontSize: '24px',
                                            color: 'var(--foreground)'
                                        }}
                                    >
                                        FAQ
                                    </h2>
                                    <p
                                        className="mb-8 text-center"
                                        style={{
                                            fontSize: '16px',
                                            color: 'var(--foreground-secondary)',
                                            lineHeight: '1.6',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        Get instant answers to common questions about features, billing, privacy, and technical support for our AI platform.
                                    </p>
                                    <Link
                                        href="/faq"
                                        className="flex items-center gap-2 font-medium transition-all"
                                        style={{
                                            fontSize: '14px',
                                            color: 'var(--primary-purple)',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <span>View FAQ</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

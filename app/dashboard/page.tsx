'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { SkeletonDashboard } from '@/components/Skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
    Globe,
    Settings
} from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/auth-simple';
import { getAllDBs } from '@/lib/database/multi-db';
import { getUserLanguage, getUserCountry } from '@/lib/localization/contextBuilder';
import { getLanguageInfo } from '@/lib/localization/languages';
import { getCountryInfo } from '@/lib/localization/countries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveUserPreferences } from '@/lib/localization/contextBuilder';
import { getAllLanguages } from '@/lib/localization/languages';
import { getAllCountries } from '@/lib/localization/countries';

const AI_AGENTS = [
    {
        id: 'creator-social',
        name: 'Creator & Social Media',
        icon: Sparkles,
        gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        description: 'Content creation, social media posts, viral captions',
        features: ['Instagram Posts', 'YouTube Scripts', 'Viral Content'],
        buttonText: 'Create Content'
    },
    {
        id: 'creative-productivity',
        name: 'Creative & Productivity',
        icon: Lightbulb,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        description: 'Brainstorming, writing, productivity optimization',
        features: ['Idea Generation', 'Writing Help', 'Task Planning'],
        buttonText: 'Get Ideas'
    },
    {
        id: 'psychology-personality',
        name: 'Psychology & Personality',
        icon: Brain,
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        description: 'Personality insights, mental health, self-improvement',
        features: ['Personality Test', 'Mental Health', 'Self Growth'],
        buttonText: 'Discover Yourself'
    },
    {
        id: 'study-learning',
        name: 'Study & Learning',
        icon: BookOpen,
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        description: 'Study help, explanations, exam preparation',
        features: ['Homework Help', 'Concept Clarity', 'Exam Prep'],
        buttonText: 'Start Learning'
    },
    {
        id: 'business-career',
        name: 'Business & Career',
        icon: Briefcase,
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        description: 'Business strategy, career guidance, growth tips',
        features: ['Business Plan', 'Career Advice', 'Resume Help'],
        buttonText: 'Grow Business'
    },
    {
        id: 'conversational',
        name: 'Conversational AI',
        icon: MessageCircle,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        description: 'General chat, questions, friendly assistance',
        features: ['General Chat', 'Q&A', 'Daily Help'],
        buttonText: 'Start Chatting'
    },
    {
        id: 'website-builder',
        name: 'Website Builder',
        icon: Code,
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        description: 'Code generation, web development, debugging',
        features: ['Code Gen', 'Bug Fixes', 'Web Design'],
        buttonText: 'Build Website'
    },
    {
        id: 'image-maker',
        name: 'Image Maker AI',
        icon: ImageIcon,
        gradient: '#FF6B9D',
        description: 'Create stunning images, graphics, and visual content from text',
        features: ['Image Generation', 'Graphics Design', 'Visual Content'],
        buttonText: 'Create Image'
    },
    {
        id: 'kitchen-recipe',
        name: 'Kitchen & Recipe AI',
        icon: ChefHat,
        gradient: '#00D9FF',
        description: 'Get delicious recipes, cooking tips, and meal planning',
        features: ['Recipes', 'Cooking Tips', 'Meal Planning'],
        buttonText: 'Get Recipe'
    },
    {
        id: 'search-engine',
        name: 'Research & Discovery AI',
        icon: Globe,
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        description: 'Web research, information discovery, knowledge exploration',
        features: ['Web Research', 'Discovery', 'Knowledge'],
        buttonText: 'Start Searching'
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [comingSoonOpen, setComingSoonOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeView, setActiveView] = useState<'dashboard' | 'plans' | 'about'>('dashboard');
    const [recentAgents, setRecentAgents] = useState<string[]>([]);
    const [stats, setStats] = useState({
        conversations: 0,
        messages: 0,
        agents: 7,
        plan: 'Free'
    });
    const [showSettings, setShowSettings] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

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

    // Disable body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen && !isDesktop) {
            // Save current scroll position
            const scrollY = window.scrollY;
            // Lock scroll with position fixed
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [sidebarOpen, isDesktop]);

    // Load recent agents from localStorage
    useEffect(() => {
        const loadRecentAgents = () => {
            const recent = localStorage.getItem('recentAgents');
            if (recent) {
                setRecentAgents(JSON.parse(recent));
            }
        };
        loadRecentAgents();
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

    // Handle view change and close sidebar on mobile
    const handleViewChange = (view: 'dashboard' | 'plans' | 'about') => {
        setActiveView(view);
        if (!isDesktop) {
            setSidebarOpen(false);
        }
    };

    // Track recently used agents
    const handleAgentClick = (agentId: string) => {
        // Update recent agents list
        const updatedRecents = [agentId, ...recentAgents.filter(id => id !== agentId)].slice(0, 5); // Keep max 5 recent
        setRecentAgents(updatedRecents);
        localStorage.setItem('recentAgents', JSON.stringify(updatedRecents));

        // Navigate to chat
        router.push(`/chat/${agentId}`);
    };

    // Show skeleton while loading
    if (loading) {
        return (
            <div className="min-h-screen" style={{ background: 'var(--background)', padding: '2rem' }}>
                <SkeletonDashboard />
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
                    width: isDesktop ? '380px' : '70vw',
                    borderColor: 'var(--background-tertiary)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div
                    className="flex flex-col h-full sidebar-content-wrapper"
                    style={{ padding: '24px 8px' }}
                >
                    {/* Logo */}
                    <div style={{ marginBottom: '40px', marginTop: '36px' }}>
                        <Image
                            src="/bandhannova-logo-final.svg"
                            alt="BandhanNova AI Hub"
                            width={240}
                            height={80}
                            style={{ marginBottom: '8px' }}
                        />
                        <p className="sidebar-subtitle" style={{ color: 'var(--foreground-tertiary)', fontSize: '18px' }}>
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
                            <div style={{ overflow: 'hidden', flex: 1 }}>
                                <p
                                    className="body-large font-semibold"
                                    style={{
                                        color: 'white',
                                        marginBottom: '2px'
                                    }}
                                >
                                    {user?.user_metadata?.full_name || 'User'}
                                </p>
                                <p className="small" style={{
                                    color: 'var(--foreground-tertiary)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Stats - 4 items only */}
                        <div
                            className="grid grid-cols-2 gap-3"
                            style={{ paddingTop: '12px', borderTop: '1px solid var(--background-tertiary)' }}
                        >
                            {/* Country */}
                            <div className="text-center">
                                <p
                                    className="font-bold text-xl"
                                    style={{ color: 'var(--foreground)' }}
                                >
                                    {(() => {
                                        const countryCode = getUserCountry();
                                        const country = countryCode ? getCountryInfo(countryCode) : null;
                                        return country ? country.flag : '🌐';
                                    })()}
                                </p>
                                <p className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                                    {(() => {
                                        const countryCode = getUserCountry();
                                        const country = countryCode ? getCountryInfo(countryCode) : null;
                                        return country ? country.name : 'Not Set';
                                    })()}
                                </p>
                            </div>

                            {/* Language */}
                            <div className="text-center">
                                <p
                                    className="font-bold text-xl"
                                    style={{ color: 'var(--foreground)' }}
                                >
                                    {(() => {
                                        const langCode = getUserLanguage();
                                        const lang = langCode ? getLanguageInfo(langCode) : null;
                                        return lang ? lang.icon : '🗣️';
                                    })()}
                                </p>
                                <p className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                                    {(() => {
                                        const langCode = getUserLanguage();
                                        const lang = langCode ? getLanguageInfo(langCode) : null;
                                        return lang ? lang.name : 'Not Set';
                                    })()}
                                </p>
                            </div>

                            {/* Plan */}
                            <div className="text-center">
                                <p
                                    className="font-bold"
                                    style={{ color: 'var(--foreground)', fontSize: '16px' }}
                                >
                                    {stats.plan}
                                </p>
                                <p className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                                    Plan
                                </p>
                            </div>

                            {/* Messages */}
                            <div className="text-center">
                                <p
                                    className="font-bold"
                                    style={{ color: 'var(--foreground)', fontSize: '16px' }}
                                >
                                    {stats.messages}
                                </p>
                                <p className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                                    Messages
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1" style={{ marginBottom: '24px' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <p
                                className="body font-semibold"
                                style={{
                                    color: 'var(--foreground-tertiary)',
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
                            <Button
                                onClick={() => handleViewChange('dashboard')}
                                variant="ghost"
                                className="flex items-center gap-3 rounded-xl transition-all hover:scale-105 justify-start text-white"
                                style={{
                                    padding: '14px 16px',
                                    background: activeView === 'dashboard' ? 'var(--gradient-hero)' : 'rgba(255, 255, 255, 0.1)',
                                    width: '100%'
                                }}
                            >
                                <Home className="w-5 h-5" />
                                <span className="body font-medium">Dashboard</span>
                            </Button>

                            <Button
                                onClick={() => handleViewChange('plans')}
                                variant="ghost"
                                className="flex items-center gap-3 rounded-xl transition-all hover:scale-105 justify-start text-white"
                                style={{
                                    padding: '14px 16px',
                                    background: activeView === 'plans' ? 'var(--gradient-hero)' : 'rgba(255, 255, 255, 0.1)',
                                    width: '100%'
                                }}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span className="body font-medium">Plans</span>
                            </Button>

                            <Button
                                onClick={() => handleViewChange('about')}
                                variant="ghost"
                                className="flex items-center gap-3 rounded-xl transition-all hover:scale-105 justify-start text-white"
                                style={{
                                    padding: '14px 16px',
                                    background: activeView === 'about' ? 'var(--gradient-hero)' : 'rgba(255, 255, 255, 0.1)',
                                    width: '100%'
                                }}
                            >
                                <Info className="w-5 h-5" />
                                <span className="body font-medium">About</span>
                            </Button>

                            <Button
                                asChild
                                variant="ghost"
                                className="flex items-center gap-3 rounded-xl transition-all hover:scale-105 justify-start text-white"
                                style={{
                                    padding: '12px 16px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    width: '100%'
                                }}
                            >
                                <Link href="/contact">
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="body font-medium">Feedback</span>
                                </Link>
                            </Button>
                        </div>
                    </nav>

                    {/* Sign Out */}
                    <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        className="flex items-center gap-3 rounded-xl transition-all hover:scale-105 text-red-500 justify-start"
                        style={{
                            padding: '14px 16px',
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="body font-medium">Sign Out</span>
                    </Button>
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


            {/* Mobile Sidebar Toggle Button - Top Left */}
            {!isDesktop && (
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed top-5 left-5 z-50 flex items-center justify-center rounded-2xl glass transition-all hover:scale-105"
                    style={{
                        width: '44px',
                        height: '44px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {sidebarOpen ? (
                        <X className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
                    ) : (
                        <Menu className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
                    )}
                </button>
            )}

            {/* Main Content */}
            <div
                className={`relative flex-1 transition-all duration-300 ${sidebarOpen && !isDesktop ? '' : 'overflow-y-auto'}`}
                style={{
                    marginLeft: isDesktop && sidebarOpen ? '380px' : '0'
                }}
            >
                <div
                    className="mobile-container"
                    style={{ padding: '48px 32px' }}
                >
                    {/* Dashboard View - AI Agents */}
                    {activeView === 'dashboard' && (
                        <>
                            {/* Welcome Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ marginBottom: '48px', marginTop: '120px', padding: '8px' }}
                            >
                                <h1
                                    className="h1"
                                    style={{
                                        color: 'var(--foreground)',
                                        marginBottom: '12px'
                                    }}
                                >
                                    Welcome back, <br /><span className="gradient-text">{user?.user_metadata?.full_name?.split(' ')[0] || 'there'}</span>! 👋
                                </h1>
                                <p
                                    className="body-large"
                                    style={{
                                        color: 'var(--foreground-secondary)'
                                    }}
                                >
                                    Choose an AI agent to start your conversation and unlock limitless possibilities
                                </p>
                            </motion.div>

                            {/* Recents Section - Only show if user has recent agents */}
                            {recentAgents.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginBottom: '48px' }}
                                >
                                    <h3
                                        className="h3"
                                        style={{
                                            color: 'var(--foreground)',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        Recents
                                    </h3>
                                    <div
                                        className="flex gap-4 overflow-x-auto pb-4"
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
                                        }}
                                    >
                                        {recentAgents.map((agentId) => {
                                            const agent = AI_AGENTS.find(a => a.id === agentId);
                                            if (!agent) return null;
                                            const Icon = agent.icon;
                                            return (
                                                <motion.div
                                                    key={agent.id}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleAgentClick(agent.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div
                                                        className="flex flex-col items-center gap-2"
                                                        style={{ minWidth: '80px' }}
                                                    >
                                                        <div
                                                            className="rounded-2xl flex items-center justify-center transition-all hover:shadow-lg"
                                                            style={{
                                                                width: '64px',
                                                                height: '64px',
                                                                background: agent.gradient,
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                                            }}
                                                        >
                                                            <Icon className="w-8 h-8 text-white" />
                                                        </div>
                                                        <p
                                                            className="text-center text-xs font-medium"
                                                            style={{
                                                                color: 'var(--foreground-secondary)',
                                                                maxWidth: '80px',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {agent.name.split(' ')[0]}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* AI Agents - Categorized */}
                            <div style={{ marginBottom: '60px' }}>
                                {/* Default (Free Now) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginBottom: '40px', padding: '4px' }}
                                >
                                    <h3
                                        className="h3"
                                        style={{
                                            color: 'var(--foreground)',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        Default <span className="small" style={{ color: 'var(--foreground-tertiary)', fontWeight: 'normal' }}>(Free Now)</span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '12px' }}>
                                        {AI_AGENTS.filter(agent => ['conversational', 'search-engine'].includes(agent.id)).map((agent, index) => {
                                            const Icon = agent.icon;
                                            return (
                                                <motion.div
                                                    key={agent.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    onClick={() => handleAgentClick(agent.id)}
                                                >
                                                    <div className="ai-card-new">
                                                        <div
                                                            className="ai-card-icon-badge"
                                                            style={{ background: agent.gradient }}
                                                        >
                                                            <Icon className="w-6 h-6 text-white" style={{ position: 'relative', zIndex: 1 }} />
                                                        </div>
                                                        <h3 className="ai-card-title">{agent.name}</h3>
                                                        <p className="ai-card-desc">{agent.description}</p>
                                                        <Button
                                                            size="sm"
                                                            className="ai-card-action-btn"
                                                        >
                                                            {agent.buttonText}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Button>
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
                                        className="h3"
                                        style={{
                                            color: 'var(--foreground)',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        Featured <span className="small" style={{ color: 'var(--foreground-tertiary)', fontWeight: 'normal' }}>(Free Limited)</span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '12px' }}>
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
                                                    onClick={() => handleAgentClick(agent.id)}
                                                >
                                                    <div className="ai-card-new">
                                                        <div
                                                            className="ai-card-icon-badge"
                                                            style={{ background: agent.gradient }}
                                                        >
                                                            <Icon className="w-6 h-6 text-white" style={{ position: 'relative', zIndex: 1 }} />
                                                        </div>
                                                        <h3 className="ai-card-title">{agent.name}</h3>
                                                        <p className="ai-card-desc">{agent.description}</p>
                                                        <Button
                                                            size="sm"
                                                            className="ai-card-action-btn w-full whitespace-nowrap text-[11px] sm:text-xs transition-all duration-300"
                                                        >
                                                            Start Chat
                                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                                                        </Button>
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
                                        className="h3"
                                        style={{
                                            color: 'var(--foreground)',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        Coming Soon
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '12px' }}>
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
                                                    <div className="ai-card-new opacity-70">
                                                        {/* Coming Soon Ribbon */}
                                                        <div
                                                            className="absolute font-bold text-xs"
                                                            style={{
                                                                top: '32px',
                                                                right: '-85px',
                                                                background: 'var(--gradient-hero)',
                                                                color: 'white',
                                                                padding: '4px 80px',
                                                                transform: 'rotate(50deg)',
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                                                zIndex: 10
                                                            }}
                                                        >
                                                            COMING SOON
                                                        </div>

                                                        <div
                                                            className="ai-card-icon-badge"
                                                            style={{ background: agent.gradient }}
                                                        >
                                                            <Icon className="w-6 h-6 text-white" style={{ position: 'relative', zIndex: 1 }} />
                                                        </div>
                                                        <h3 className="ai-card-title">{agent.name}</h3>
                                                        <p className="ai-card-desc">{agent.description}</p>
                                                        <Button
                                                            size="sm"
                                                            disabled
                                                            className="ai-card-action-btn opacity-50 cursor-not-allowed"
                                                        >
                                                            {agent.buttonText}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Button>
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
                                <h1
                                    className="h1"
                                    style={{
                                        color: 'var(--foreground)',
                                        marginTop: '32px',
                                        marginBottom: '16px'
                                    }}
                                >
                                    Choose Your <span className="gradient-text">Growth Plan</span>
                                </h1>
                                <p
                                    className="body-large text-center mx-auto"
                                    style={{
                                        color: 'var(--foreground-secondary)',
                                        marginBottom: '30px'
                                    }}
                                >
                                    Unlock the full potential of AI-powered growth with plans designed for every journey
                                </p>
                            </motion.div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 plans-grid-mobile"
                                style={{ gap: '48px', marginBottom: '60px', padding: '0 16px' }}
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
                                                className="h3 text-center"
                                                style={{
                                                    color: 'var(--foreground)',
                                                    marginBottom: '16px'
                                                }}
                                            >
                                                {plan.name}
                                            </h3>

                                            <div className="mb-6 text-center">
                                                <div className="flex items-baseline gap-2 justify-center">
                                                    <span
                                                        className="h2"
                                                        style={{
                                                            color: 'var(--foreground)'
                                                        }}
                                                    >
                                                        {plan.price}
                                                    </span>
                                                    <span
                                                        className="body"
                                                        style={{
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

                                            <Button
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
                                                    height: 'auto',
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
                                                disabled={plan.name === stats.plan || (plan.name === 'Free' && stats.plan !== 'Free')}
                                            >
                                                {plan.name === stats.plan
                                                    ? '✓ In Use'
                                                    : (plan.name === 'Free' && stats.plan !== 'Free')
                                                        ? 'Not Available'
                                                        : 'Upgrade Now'}
                                            </Button>
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
                                <h1
                                    className="h1"
                                    style={{
                                        color: 'var(--foreground)',
                                        marginBottom: '16px'
                                    }}
                                >
                                    About & <span className="gradient-text">Policies</span>
                                </h1>
                                <p
                                    className="body text-center mx-auto"
                                    style={{
                                        color: 'var(--foreground-secondary)',
                                        maxWidth: '600px',
                                        marginBottom: '30px'
                                    }}
                                >
                                    Learn more about BandhanNova AI Hub, our policies, and terms
                                </p>
                            </motion.div>

                            {/* Navigation Cards */}
                            <div
                                className="grid grid-cols-2 gap-2 about-cards-grid"
                                style={{ maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto' }}
                            >
                                {/* Terms & Conditions Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    onClick={() => router.push('/terms')}
                                >
                                    <div className="ai-card-new">
                                        <div
                                            className="ai-card-icon-badge"
                                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                        >
                                            <FileText className="w-6 h-6 text-white" style={{ position: 'relative', zIndex: 1 }} />
                                        </div>
                                        <h3 className="ai-card-title">Terms & Conditions</h3>
                                        <p className="ai-card-desc">Review our comprehensive terms of service and usage guidelines</p>
                                        <Button
                                            size="sm"
                                            className="ai-card-action-btn"
                                        >
                                            View Terms
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>

                                {/* Privacy & Policies Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    onClick={() => router.push('/privacy')}
                                >
                                    <div className="ai-card-new">
                                        <div
                                            className="ai-card-icon-badge"
                                            style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                                        >
                                            <Shield className="w-6 h-6 text-white" style={{ position: 'relative', zIndex: 1 }} />
                                        </div>
                                        <h3 className="ai-card-title">Privacy & Policies</h3>
                                        <p className="ai-card-desc">Learn how we protect your personal data with industry-leading security</p>
                                        <Button
                                            size="sm"
                                            className="ai-card-action-btn"
                                        >
                                            View Privacy
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>

                                {/* About BandhanNova Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={() => router.push('/about')}
                                >
                                    <div className="ai-card-new">
                                        <div
                                            className="ai-card-icon-badge"
                                            style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
                                        >
                                            <Info className="w-6 h-6 text-white" style={{ position: 'relative', zIndex: 1 }} />
                                        </div>
                                        <h3 className="ai-card-title">About BandhanNova</h3>
                                        <p className="ai-card-desc">Discover our mission to democratize AI for India</p>
                                        <Button
                                            size="sm"
                                            className="ai-card-action-btn"
                                        >
                                            Learn More
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>

                                {/* FAQ Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    onClick={() => router.push('/faq')}
                                >
                                    <div className="ai-card-new">
                                        <div
                                            className="ai-card-icon-badge"
                                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' }}
                                        >
                                            <HelpCircle className="w-6 h-6 text-white" style={{ position: 'relative', zIndex: 1 }} />
                                        </div>
                                        <h3 className="ai-card-title">FAQ</h3>
                                        <p className="ai-card-desc">Get instant answers to common questions about our AI platform</p>
                                        <Button
                                            size="sm"
                                            className="ai-card-action-btn"
                                        >
                                            View FAQ
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Settings Dialog */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>
                            Update your country and language preferences
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Country Selector */}
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAllCountries().map((country) => (
                                        <SelectItem key={country.code} value={country.code}>
                                            {country.flag} {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Language Selector */}
                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAllLanguages().map((lang) => (
                                        <SelectItem key={lang.code} value={lang.code}>
                                            {lang.icon} {lang.nativeName} ({lang.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={() => {
                                if (selectedCountry && selectedLanguage) {
                                    saveUserPreferences(selectedLanguage, selectedCountry);
                                    setShowSettings(false);
                                    // Reload to update stats
                                    window.location.reload();
                                }
                            }}
                            disabled={!selectedCountry || !selectedLanguage}
                            className="w-full"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}

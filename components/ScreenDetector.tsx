'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Lightbulb,
    Brain,
    BookOpen,
    Briefcase,
    MessageCircle as MessageCircleIcon,
    Code,
    Image as ImageIcon,
    ChefHat,
    Globe,
    Menu,
    X,
    LayoutDashboard,
    History,
    Search,
    User,
    Settings,
    ChevronRight,
    Zap,
    Lock,
    ArrowRight,
    MessageSquare
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllConversations, Conversation } from '@/lib/storage/localStorage';
import { MarkdownRenderer } from '@/app/chat/[agentType]/components/MarkdownRenderer';
import { getSupabase } from '@/lib/supabase';

// Agent configuration
export const AGENT_CONFIG: Record<string, any> = {
    'conversational': {
        id: 'conversational',
        name: 'Conversational AI',
        icon: MessageCircleIcon,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        color: '#06b6d4',
        description: 'Your intelligent daily assistant for everything.'
    },
    'study-learning': {
        id: 'study-learning',
        name: 'Study & Learning',
        icon: BookOpen,
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        color: '#10b981',
        description: 'Concept clarity, daily study plans, and notes assistant.'
    },
    'future-jobs-career': {
        id: 'future-jobs-career',
        name: 'Future Jobs & Career Build',
        icon: Briefcase,
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        color: '#f97316',
        description: 'Startup guidance, business planning, and career advisor.'
    },
    'creator-social': {
        id: 'creator-social',
        name: 'Creator & Social Media',
        icon: Sparkles,
        gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        color: '#a855f7',
        description: 'YouTube, Instagram, branding, and content strategist.'
    },
    'website-builder': {
        id: 'website-builder',
        name: 'Website Builder',
        icon: Code,
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        color: '#ef4444',
        description: 'Build complete websites from a single prompt.'
    },
    'decision-maker': {
        id: 'decision-maker',
        name: 'Decision Maker',
        icon: Brain,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        color: '#8b5cf6',
        description: 'Smart decision making and logic analyzer.'
    },
    'search-engine': {
        id: 'search-engine',
        name: 'Research & Discovery AI',
        icon: Globe,
        gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        color: '#6366f1',
        description: 'Real-time deep research and fact-checked insights.'
    }
};

interface ScreenDetectorProps {
    defaultAgent?: string;
}

export const ScreenDetector = ({ defaultAgent = 'conversational' }: ScreenDetectorProps) => {
    const router = useRouter();
    const [activeAgent, setActiveAgent] = useState(defaultAgent);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isDetecting, setIsDetecting] = useState(true);
    const [recentChats, setRecentChats] = useState<Conversation[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [remainingQueries, setRemainingQueries] = useState(5);
    const [userIp, setUserIp] = useState('');
    const [showAuthWall, setShowAuthWall] = useState<null | 'limit' | 'detected' | 'locked'>(null);
    const [chatResponse, setChatResponse] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const responseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            if (desktop) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Load recent chats
        setRecentChats(getAllConversations().slice(0, 5));

        // Check auth status
        checkAuth();

        // Load guest limits from API
        fetchGuestStatus();

        // Detection animation and guest redirection
        const timer = setTimeout(() => {
            setIsDetecting(false);
            // Redirect to guest chat if not logged in
            if (!isLoggedIn) {
                router.push('/guest-chat');
            }
        }, 2500);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    const checkAuth = async () => {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
    };

    const fetchGuestStatus = async () => {
        try {
            const response = await fetch('/api/guest/status');
            if (response.ok) {
                const data = await response.json();
                setRemainingQueries(data.remaining);
                setUserIp(data.ip);
                if (data.remaining === 0) {
                    setShowAuthWall('detected');
                }
            }
        } catch (error) {
            console.error('Error fetching guest status:', error);
        }
    };

    const handleAgentChange = (agentId: string) => {
        // Feature Locking: Only 'conversational' is allowed for guests
        if (!isLoggedIn && agentId !== 'conversational') {
            setShowAuthWall('locked');
            return;
        }

        setActiveAgent(agentId);
        if (!isDesktop) setSidebarOpen(false);
        setChatResponse('');
    };

    const handleSendMessage = async () => {
        if (!searchValue.trim()) return;

        // If logged in, we redirect to the full chat page for the best experience
        if (isLoggedIn) {
            router.push(`/chat/${activeAgent}?q=${encodeURIComponent(searchValue)}`);
            return;
        }

        // Guest check
        if (remainingQueries <= 0) {
            setShowAuthWall('limit');
            return;
        }

        // Real-time chat on home screen for guest
        setIsTyping(true);
        setChatResponse('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: searchValue,
                    modelId: 'barud-2-smart-fls',
                    agentType: activeAgent,
                    conversationHistory: []
                })
            });

            if (response.status === 429) {
                setShowAuthWall('limit');
                return;
            }

            if (!response.ok) throw new Error('Failed to fetch response');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const json = JSON.parse(line.substring(6));
                                if (json.choices?.[0]?.delta?.content) {
                                    fullText += json.choices[0].delta.content;
                                    setChatResponse(fullText);
                                    // Scroll to response
                                    setTimeout(() => {
                                        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                    }, 100);
                                }
                            } catch (e) { }
                        }
                    }
                }
            }

            // Sync remaining queries
            setRemainingQueries(prev => Math.max(0, prev - 1));
            setSearchValue('');
        } catch (error) {
            console.error('Chat error:', error);
            setChatResponse('An error occurred. Please try again or join us for full access.');
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="relative h-screen flex overflow-hidden bg-background font-inter">
            <AnimatePresence>
                {isDetecting && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6 text-center"
                    >
                        {/* Background subtle glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-purple/10 blur-[120px] rounded-full pointer-events-none" />

                        <div className="relative">
                            {/* Rotating Ring with stronger opacity and glow */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 rounded-full border-t-2 border-primary-purple border-r-2 border-accent-cyan shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Icon with stronger glow */}
                                <div className="relative">
                                    <Zap className="w-12 h-12 text-white animate-pulse relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-10 text-2xl font-black tracking-[0.3em] text-white/90 drop-shadow-2xl uppercase"
                        >
                            Detecting AI Agents...
                        </motion.h2>
                        <p className="mt-4 text-sm font-medium text-foreground-tertiary tracking-widest uppercase opacity-50">
                            Optimizing your experience
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAuthWall && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6"
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="relative w-full max-w-lg glass-strong p-10 rounded-[3rem] text-center border border-white/10 shadow-2xl overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-purple/10 blur-3xl rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-cyan/10 blur-3xl rounded-full -ml-16 -mb-16" />

                            <div className="w-20 h-20 bg-gradient-hero rounded-3xl mx-auto mb-8 flex items-center justify-center text-white shadow-2xl relative">
                                <Lock className="w-10 h-10" />
                                <div className="absolute -inset-2 bg-primary-purple/20 blur-xl animate-pulse" />
                            </div>

                            {showAuthWall === 'limit' && (
                                <>
                                    <h2 className="text-3xl font-black mb-4 gradient-text">Limit Reached!</h2>
                                    <p className="text-foreground-secondary text-lg mb-10 leading-relaxed">
                                        You have used your 5 free queries (resets every 48 hours). Log in or sign up now to get <b>Unlimited Access</b> to all 11+ AI agents!
                                    </p>
                                </>
                            )}

                            {showAuthWall === 'detected' && (
                                <>
                                    <h2 className="text-3xl font-black mb-4 gradient-text">Welcome Back!</h2>
                                    <p className="text-foreground-secondary text-lg mb-10 leading-relaxed">
                                        Our system detects you've already utilized your free guest credits from this IP. To continue exploring our world-class AI, please sign in.
                                    </p>
                                </>
                            )}

                            {showAuthWall === 'locked' && (
                                <>
                                    <h2 className="text-3xl font-black mb-4 gradient-text">Member Only Agent</h2>
                                    <p className="text-foreground-secondary text-lg mb-10 leading-relaxed">
                                        This specialized AI agent is reserved for our community members. Sign up for free to unlock this and 10+ other high-performance agents!
                                    </p>
                                </>
                            )}

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => router.push('/signup')}
                                    className="w-full p-5 rounded-2xl bg-gradient-hero text-white font-bold text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full p-5 rounded-2xl glass font-bold text-xl hover:bg-white/5 active:scale-[0.98] transition-all"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setShowAuthWall(null)}
                                    className="mt-4 text-foreground-tertiary hover:text-white transition-all text-sm font-medium"
                                >
                                    {showAuthWall === 'locked' ? 'Return to Chat' : "I'll come back later"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar with Screen Detection */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 glass border-r transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ width: isDesktop ? '320px' : '280px', borderColor: 'var(--background-tertiary)' }}
            >
                <div className="flex flex-col h-full overflow-y-auto no-scrollbar" style={{ padding: '18px' }}>
                    <div className="pt-4">
                        <div className="flex items-center gap-4 mb-12 px-3 cursor-pointer transition-transform hover:scale-[1.02]">
                            <Link href="/">
                                <Image
                                    src="/bandhannova-logo-final.svg"
                                    alt="BandhanNova"
                                    width={180}
                                    height={40}
                                    className="object-contain"
                                />
                            </Link>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-[11px] font-bold text-foreground-tertiary uppercase tracking-[0.1em] mb-5 px-5 opacity-60">AI Specialized Detectors</h2>
                            <div className="space-y-2">
                                {Object.values(AGENT_CONFIG).map((agent: any) => {
                                    const isPremium = agent.id !== 'conversational';
                                    const isLocked = !isLoggedIn && isPremium;

                                    return (
                                        <button
                                            key={agent.id}
                                            onClick={() => handleAgentChange(agent.id)}
                                            className={`w-full flex items-center gap-4 p-4 px-5 rounded-2xl transition-all group ${activeAgent === agent.id ? 'glass-strong border border-white/10 shadow-lg bg-white/[0.08]' : 'hover:bg-white/[0.04]'}`}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm relative"
                                                style={{ background: agent.gradient }}
                                            >
                                                <agent.icon className="w-5 h-5" />
                                                {isLocked && (
                                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-background border border-white/10 rounded-full flex items-center justify-center shadow-lg">
                                                        <Lock className="w-2.5 h-2.5 text-foreground-tertiary" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className={`text-sm font-semibold flex items-center gap-2 ${activeAgent === agent.id ? 'text-foreground' : 'text-foreground-secondary group-hover:text-foreground'}`}>
                                                    {agent.name}
                                                </div>
                                            </div>
                                            {activeAgent === agent.id ? (
                                                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                                            ) : isLocked ? (
                                                <Lock className="w-3.5 h-3.5 text-foreground-tertiary opacity-40 group-hover:opacity-100 transition-opacity" />
                                            ) : null}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {recentChats.length > 0 && (
                            <div className="mb-10">
                                <h2 className="text-[11px] font-bold text-foreground-tertiary uppercase tracking-[0.1em] mb-5 px-3 opacity-60">Recent Insights</h2>
                                <div className="space-y-1.5">
                                    {recentChats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => router.push(`/chat/${chat.agentType}?id=${chat.id}`)}
                                            className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/[0.04] transition-all group"
                                        >
                                            <History className="w-4.5 h-4.5 text-foreground-tertiary group-hover:text-primary-purple transition-colors" />
                                            <span className="text-sm font-medium text-foreground-secondary group-hover:text-foreground-secondary truncate flex-1 text-left">{chat.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto space-y-3 bg-white/[0.02] border-t border-white/[0.05] -mx-[18px] p-[18px]">
                        <button
                            onClick={() => router.push('/landing')}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/[0.04] transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <LayoutDashboard className="w-5 h-5 text-foreground-secondary group-hover:text-primary-purple transition-colors" />
                                <span className="text-sm font-semibold text-foreground-secondary group-hover:text-foreground transition-colors">Explore Landing</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-foreground-tertiary group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between px-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-foreground-tertiary/10 flex items-center justify-center border border-white/5">
                                    <User className="w-4.5 h-4.5 text-foreground-secondary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground">{isLoggedIn ? 'Member' : 'Guest Member'}</span>
                                    <span className="text-[10px] text-foreground-tertiary font-medium">Verified Account</span>
                                </div>
                            </div>
                            <Settings className="w-4.5 h-4.5 text-foreground-tertiary hover:text-white hover:rotate-45 transition-all cursor-pointer" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className="flex-1 transition-all duration-300 relative bg-background overflow-y-auto no-scrollbar"
                style={{ marginLeft: isDesktop && sidebarOpen ? '320px' : '0' }}
            >
                {/* Top-Right Auth Buttons */}
                {!isLoggedIn && (
                    <div className="absolute top-6 right-6 z-[60] flex items-center gap-3">
                        <button
                            onClick={() => router.push('/login')}
                            className="px-6 py-2.5 rounded-xl glass font-bold text-sm hover:bg-white/5 transition-all text-foreground"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => router.push('/signup')}
                            className="px-6 py-2.5 rounded-xl bg-gradient-hero text-white font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                {/* Mobile Toggle */}
                {!isDesktop && (
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="fixed top-6 left-6 z-[60] p-2.5 glass rounded-xl shadow-xl border border-white/10"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                )}

                <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-12 relative">
                    {/* Background Glows */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-purple/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 blur-[120px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center w-full max-w-3xl z-10"
                    >
                        <motion.div
                            key={activeAgent}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-24 h-24 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-2xl relative"
                            style={{ background: AGENT_CONFIG[activeAgent].gradient }}
                        >
                            {(() => {
                                const Icon = AGENT_CONFIG[activeAgent].icon;
                                return <Icon className="w-12 h-12" />;
                            })()}
                            <div className="absolute -inset-4 bg-inherit opacity-20 blur-2xl -z-10 rounded-full animate-pulse" />
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-foreground">
                            {AGENT_CONFIG[activeAgent].name}
                        </h1>
                        <p className="text-lg md:text-xl text-foreground-secondary mb-12 max-w-xl mx-auto font-medium">
                            {AGENT_CONFIG[activeAgent].description}
                        </p>

                        <div className="w-full relative group mb-12">
                            <div className="absolute -inset-1 bg-gradient-hero rounded-[2.5rem] opacity-25 blur transition duration-1000 group-hover:opacity-40" />
                            <div className="relative flex items-center">
                                <div className="absolute left-8 pointer-events-none text-foreground-tertiary">
                                    <Search className="w-6 h-6" />
                                </div>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={`Detect solutions with ${AGENT_CONFIG[activeAgent].name.split(' ')[0]}...`}
                                    className="w-full p-7 pl-16 pr-24 rounded-[3rem] bg-background-secondary/50 backdrop-blur-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-purple/50 text-xl font-medium shadow-2xl transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSendMessage();
                                    }}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isTyping}
                                    className="absolute right-3.5 p-4.5 rounded-[2.2rem] bg-gradient-hero text-white transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 group/btn disabled:opacity-50"
                                >
                                    {isTyping ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="hidden md:inline font-bold px-2">Analyze</span>
                                            <Sparkles className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                            {!isLoggedIn && (
                                <div className="mt-5 text-[10px] md:text-xs font-bold text-foreground-tertiary uppercase tracking-widest flex flex-wrap items-center justify-center gap-4">
                                    <div className="flex items-center gap-1.5 bg-accent-cyan/10 px-4 py-1.5 rounded-full text-accent-cyan border border-accent-cyan/20">
                                        <Zap className="w-3.5 h-3.5" />
                                        {remainingQueries} Detection Credits Remaining
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Local Response Container */}
                        <AnimatePresence>
                            {(chatResponse || isTyping) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    ref={responseRef}
                                    className="w-full text-left glass-strong p-8 rounded-[2.5rem] border border-white/10 shadow-2xl mb-12 relative group"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                                            style={{ background: AGENT_CONFIG[activeAgent].gradient }}
                                        >
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div className="font-black text-xl gradient-text">Analysis Report</div>
                                    </div>
                                    <div className="prose prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:gradient-text prose-strong:text-accent-cyan">
                                        <MarkdownRenderer content={chatResponse} />
                                        {isTyping && !chatResponse && (
                                            <div className="flex gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary-purple animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-2 h-2 rounded-full bg-primary-purple animate-bounce" />
                                            </div>
                                        )}
                                    </div>

                                    {!isLoggedIn && remainingQueries >= 1 && (
                                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                            <p className="text-foreground-tertiary mb-4 font-medium">To save this conversation and unlock deep research modes...</p>
                                            <button
                                                onClick={() => router.push('/signup')}
                                                className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-all font-bold text-sm border border-white/10"
                                            >
                                                Create Your Free Account
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

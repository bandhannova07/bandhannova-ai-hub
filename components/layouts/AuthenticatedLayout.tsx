'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
    MessageCircle,
    BookOpen,
    Briefcase,
    Sparkles,
    Code,
    Brain,
    Globe,
    LayoutDashboard,
    History,
    User,
    Settings,
    ChevronRight,
    Menu,
    X,
    Lock,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { getAllConversations, Conversation } from '@/lib/storage/localStorage';

// Agent configuration
const AGENT_CONFIG: Record<string, any> = {
    conversational: {
        id: 'conversational',
        name: 'Conversational AI',
        icon: MessageCircle,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    },
    'study-learning': {
        id: 'study-learning',
        name: 'Study & Learning',
        icon: BookOpen,
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    },
    'future-jobs-career': {
        id: 'future-jobs-career',
        name: 'Future Jobs & Career',
        icon: Briefcase,
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    },
    'creator-social': {
        id: 'creator-social',
        name: 'Creator & Social Media',
        icon: Sparkles,
        gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    },
    'website-builder': {
        id: 'website-builder',
        name: 'Website Builder',
        icon: Code,
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    },
    'decision-maker': {
        id: 'decision-maker',
        name: 'Decision Maker',
        icon: Brain,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    },
    'search-engine': {
        id: 'search-engine',
        name: 'Research & Discovery',
        icon: Globe,
        gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    },
};

interface AuthenticatedLayoutProps {
    children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [recentChats, setRecentChats] = useState<Conversation[]>([]);
    const [userName, setUserName] = useState('Member');

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

        // Get user info
        const getUserInfo = async () => {
            const supabase = getSupabase();
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user?.email) {
                setUserName(user.email.split('@')[0]);
            }
        };
        getUserInfo();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative h-screen flex overflow-hidden bg-background font-inter">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 glass border-r transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ width: isDesktop ? '320px' : '280px', borderColor: 'var(--background-tertiary)' }}
            >
                <div className="flex flex-col h-full overflow-y-auto no-scrollbar" style={{ padding: '18px' }}>
                    <div className="pt-4">
                        {/* Logo */}
                        <div className="flex items-center gap-4 mb-12 px-3 cursor-pointer transition-transform hover:scale-[1.02]">
                            <Link href="/dashboard">
                                <Image
                                    src="/bandhannova-logo-final.svg"
                                    alt="BandhanNova"
                                    width={180}
                                    height={40}
                                    className="object-contain"
                                />
                            </Link>
                        </div>

                        {/* AI Agents */}
                        <div className="mb-10">
                            <h2 className="text-[11px] font-bold text-foreground-tertiary uppercase tracking-[0.1em] mb-5 px-5 opacity-60">
                                AI Specialized Agents
                            </h2>
                            <div className="space-y-2">
                                {Object.values(AGENT_CONFIG).map((agent: any) => {
                                    const isActive = pathname.includes(`/chat/${agent.id}`);
                                    return (
                                        <button
                                            key={agent.id}
                                            onClick={() => router.push(`/chat/${agent.id}`)}
                                            className={`w-full flex items-center gap-4 p-4 px-5 rounded-2xl transition-all group ${isActive
                                                    ? 'glass-strong border border-white/10 shadow-lg bg-white/[0.08]'
                                                    : 'hover:bg-white/[0.04]'
                                                }`}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm"
                                                style={{ background: agent.gradient }}
                                            >
                                                <agent.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div
                                                    className={`text-sm font-semibold ${isActive ? 'text-foreground' : 'text-foreground-secondary group-hover:text-foreground'
                                                        }`}
                                                >
                                                    {agent.name}
                                                </div>
                                            </div>
                                            {isActive && (
                                                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Chats */}
                        {recentChats.length > 0 && (
                            <div className="mb-10">
                                <h2 className="text-[11px] font-bold text-foreground-tertiary uppercase tracking-[0.1em] mb-5 px-3 opacity-60">
                                    Recent Conversations
                                </h2>
                                <div className="space-y-1.5">
                                    {recentChats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => router.push(`/chat/${chat.agentType}?id=${chat.id}`)}
                                            className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/[0.04] transition-all group"
                                        >
                                            <History className="w-4.5 h-4.5 text-foreground-tertiary group-hover:text-primary-purple transition-colors" />
                                            <span className="text-sm font-medium text-foreground-secondary group-hover:text-foreground-secondary truncate flex-1 text-left">
                                                {chat.title}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-auto space-y-3 bg-white/[0.02] border-t border-white/[0.05] -mx-[18px] p-[18px]">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/[0.04] transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <LayoutDashboard className="w-5 h-5 text-foreground-secondary group-hover:text-primary-purple transition-colors" />
                                <span className="text-sm font-semibold text-foreground-secondary group-hover:text-foreground transition-colors">
                                    Dashboard
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-foreground-tertiary group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between px-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-foreground-tertiary/10 flex items-center justify-center border border-white/5">
                                    <User className="w-4.5 h-4.5 text-foreground-secondary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground">{userName}</span>
                                    <span className="text-[10px] text-foreground-tertiary font-medium">Premium Member</span>
                                </div>
                            </div>
                            <Settings className="w-4.5 h-4.5 text-foreground-tertiary hover:text-white hover:rotate-45 transition-all cursor-pointer" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className="flex-1 transition-all duration-300 relative bg-background overflow-y-auto"
                style={{ marginLeft: isDesktop && sidebarOpen ? '320px' : '0' }}
            >
                {/* Mobile Toggle */}
                {!isDesktop && (
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="fixed top-6 left-6 z-[60] p-2.5 glass rounded-xl shadow-xl border border-white/10"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                )}

                {children}
            </main>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}

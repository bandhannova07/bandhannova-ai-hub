'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    ArrowLeft,
    Sparkles,
    ExternalLink,
    TrendingUp,
    Loader2,
    Send,
    Globe,
    MessageCircle,
    Copy,
    Check,
    Menu,
    X,
    Plus
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth-simple';
import { MarkdownRenderer } from '../chat/[agentType]/components/MarkdownRenderer';
import { Button } from '@/components/ui/button';

type SearchResult = {
    id: string;
    title: string;
    url: string;
    snippet: string;
    favicon?: string;
    timestamp?: string;
};

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

type SearchMode = 'web' | 'deep';

export default function SearchPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchMode, setSearchMode] = useState<SearchMode>('web');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Web Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Deep Research State
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [researching, setResearching] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const deepInputRef = useRef<HTMLInputElement>(null);

    // Set sidebar state based on screen size
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            if (desktop) {
                setSidebarOpen(false); // Desktop: closed by default for focus
            } else {
                setSidebarOpen(false); // Mobile: closed by default
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        // Focus appropriate input based on mode
        if (searchMode === 'web') {
            searchInputRef.current?.focus();
        } else {
            deepInputRef.current?.focus();
        }
    }, [searchMode]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Touch gesture handling for sidebar
    useEffect(() => {
        if (isDesktop) return; // Only for mobile

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let lastTap = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleGesture();
        };

        const handleGesture = () => {
            const swipeThreshold = 50; // Minimum distance for swipe
            const verticalThreshold = 100; // Maximum vertical movement
            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);

            // Swipe from left edge to open sidebar
            if (
                touchStartX < 50 && // Started from left edge
                deltaX > swipeThreshold && // Swiped right
                deltaY < verticalThreshold && // Mostly horizontal
                !sidebarOpen
            ) {
                setSidebarOpen(true);
            }
            // Swipe right to close sidebar
            else if (
                deltaX < -swipeThreshold && // Swiped left
                deltaY < verticalThreshold && // Mostly horizontal
                sidebarOpen
            ) {
                setSidebarOpen(false);
            }
        };

        // Double tap to toggle sidebar
        const handleDoubleTap = (e: TouchEvent) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;

            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                const touch = e.changedTouches[0];
                if (touch.screenX < 100) { // Only on left side
                    setSidebarOpen(!sidebarOpen);
                }
            }
            lastTap = currentTime;
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchend', handleDoubleTap);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchend', handleDoubleTap);
        };
    }, [isDesktop, sidebarOpen]);

    async function checkAuth() {
        const { user: currentUser } = await getCurrentUser();
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        setLoading(false);
    }

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    async function handleWebSearch(e?: React.FormEvent) {
        e?.preventDefault();
        if (!searchQuery.trim() || searching) return;

        setSearching(true);
        setHasSearched(true);

        try {
            // TODO: Implement actual search API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockResults: SearchResult[] = [
                {
                    id: '1',
                    title: 'Example Search Result - ' + searchQuery,
                    url: 'https://example.com/result1',
                    snippet: 'This is a sample search result snippet that shows relevant information about your query. The actual implementation will connect to a real search API.',
                    timestamp: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'Another Result for ' + searchQuery,
                    url: 'https://example.com/result2',
                    snippet: 'More relevant information about your search query will appear here when the search functionality is fully implemented.',
                    timestamp: new Date().toISOString()
                }
            ];

            setResults(mockResults);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    }

    async function handleDeepResearch(e?: React.FormEvent) {
        e?.preventDefault();
        if (!input.trim() || researching) return;

        const userInput = input.trim();
        setInput('');
        setResearching(true);

        try {
            // Create user message
            const userMessage: Message = {
                id: `msg_${Date.now()}_user`,
                role: 'user',
                content: userInput,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, userMessage]);

            // Simulate AI response
            await new Promise(resolve => setTimeout(resolve, 1000));

            const assistantMessage: Message = {
                id: `msg_${Date.now()}_assistant`,
                role: 'assistant',
                content: `I'm researching "${userInput}" for you. This is a deep research response that will provide comprehensive insights with citations and sources.`,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Research error:', error);
        } finally {
            setResearching(false);
        }
    }

    function handleCopy(content: string, id: string) {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary-purple)' }} />
            </div>
        );
    }

    return (
        <div className="relative h-screen flex overflow-hidden">
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 glass border-r transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{
                    width: '380px',
                    borderColor: 'var(--background-tertiary)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div
                    className="flex flex-col h-full"
                    style={{ padding: '24px' }}
                >
                    {/* Logo */}
                    <div style={{ marginBottom: '32px', marginTop: '8px' }}>
                        <div className="flex items-center gap-3">
                            <div
                                className="rounded-xl flex items-center justify-center"
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                                }}
                            >
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold" style={{ fontSize: '18px', color: 'var(--foreground)' }}>
                                    Research & Discovery
                                </h1>
                                <p style={{ fontSize: '12px', color: 'var(--foreground-tertiary)' }}>
                                    Web research assistant
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mode Selector in Sidebar */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2
                            className="font-bold"
                            style={{ fontSize: '18px', color: 'var(--foreground)', marginBottom: '16px' }}
                        >
                            Search Mode
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                                onClick={() => setSearchMode('web')}
                                className="search-mode-btn w-full flex items-center justify-center gap-2 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                                style={{
                                    padding: '14px',
                                    background: searchMode === 'web' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.05)',
                                    color: searchMode === 'web' ? 'white' : 'var(--foreground)',
                                    border: searchMode === 'web' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <Globe className="w-4 h-4" />
                                <span style={{ fontSize: '15px' }}>Web Searching</span>
                            </button>

                            <button
                                onClick={() => setSearchMode('deep')}
                                className="search-mode-btn w-full flex items-center justify-center gap-2 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                                style={{
                                    padding: '14px',
                                    background: searchMode === 'deep' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.05)',
                                    color: searchMode === 'deep' ? 'white' : 'var(--foreground)',
                                    border: searchMode === 'deep' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span style={{ fontSize: '15px' }}>Deep Research</span>
                            </button>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Back to Dashboard Button */}
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center justify-center gap-2 rounded-xl hover:scale-105 transition-all"
                        style={{
                            padding: '14px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--foreground)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span style={{ fontSize: '15px', fontWeight: '600' }}>Back to Dashboard</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                />
            )}

            {/* Vertical Sidebar Toggle - Mobile */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed glass rounded-r-2xl hover:scale-105 active:scale-95 transition-all"
                style={{
                    top: '50%',
                    left: sidebarOpen ? '380px' : '0',
                    transform: 'translateY(-50%)',
                    zIndex: 50,
                    padding: '50px 10px',
                    border: '1px solid var(--background-tertiary)',
                    borderLeft: 'none',
                    writingMode: 'vertical-lr',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--foreground-secondary)',
                    letterSpacing: '1.5px',
                    transition: 'left 250ms ease-in-out, transform 200ms ease',
                    backdropFilter: 'blur(20px)',
                    cursor: 'pointer'
                }}
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar Toggle Button - Desktop */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block fixed rounded-2xl glass z-50"
                style={{
                    top: '24px',
                    left: sidebarOpen ? '400px' : '24px',
                    padding: '12px',
                    transition: 'left 0.3s ease',
                }}
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Main Content Area */}
            <div
                className="relative flex-1 flex flex-col transition-all duration-300"
                style={{
                    marginLeft: isDesktop && sidebarOpen ? '320px' : '0'
                }}
            >
                <div className="h-full flex flex-col">
                    <AnimatePresence mode="wait">
                        {/* Web Searching Mode */}
                        {searchMode === 'web' && (
                            <motion.div
                                key="web"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 overflow-y-auto"
                                style={{ padding: '60px 24px' }}
                            >
                                <div className="max-w-4xl mx-auto w-full">
                                    {/* Search Hero */}
                                    {!hasSearched && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center"
                                            style={{ marginBottom: '48px' }}
                                        >
                                            <div
                                                className="rounded-3xl flex items-center justify-center mx-auto"
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                                                    marginBottom: '24px'
                                                }}
                                            >
                                                <Globe className="w-10 h-10 text-white" />
                                            </div>
                                            <h1 className="h1 gradient-text" style={{ marginBottom: '16px' }}>
                                                Discover Knowledge
                                            </h1>
                                            <p className="body-large" style={{ color: 'var(--foreground-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                                                Search the web with AI-powered insights. Get comprehensive answers with source citations.
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Search Bar */}
                                    <motion.form
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        onSubmit={handleWebSearch}
                                        className="relative"
                                        style={{ marginBottom: hasSearched ? '48px' : '0' }}
                                    >
                                        <div className="relative">
                                            <Image
                                                src="/search-svgrepo-com.svg"
                                                alt="Search"
                                                width={24}
                                                height={24}
                                                className="absolute left-6 top-1/2 transform -translate-y-1/2"
                                                style={{ opacity: 0.6 }}
                                            />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Ask anything or search the web..."
                                                className="w-full glass rounded-3xl transition-all focus:scale-[1.02]"
                                                style={{
                                                    padding: '20px 140px 20px 64px',
                                                    fontSize: '16px',
                                                    color: 'var(--foreground)',
                                                    border: '2px solid rgba(99, 102, 241, 0.2)',
                                                    outline: 'none',
                                                    backdropFilter: 'blur(20px)'
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!searchQuery.trim() || searching}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-2xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{
                                                    padding: '12px 24px',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                    color: 'white',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {searching ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Searching...</span>
                                                    </div>
                                                ) : (
                                                    'Search'
                                                )}
                                            </button>
                                        </div>
                                    </motion.form>

                                    {/* Trending Searches */}
                                    {!hasSearched && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            style={{ marginTop: '48px' }}
                                        >
                                            <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
                                                <TrendingUp className="w-4 h-4" style={{ color: 'var(--foreground-tertiary)' }} />
                                                <h3 className="body font-semibold" style={{ color: 'var(--foreground-tertiary)' }}>
                                                    Trending Searches
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {['Latest AI trends', 'Climate change updates', 'Space exploration news', 'Quantum computing'].map((trend, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            setSearchQuery(trend);
                                                            searchInputRef.current?.focus();
                                                        }}
                                                        className="glass rounded-xl transition-all hover:scale-105"
                                                        style={{
                                                            padding: '10px 16px',
                                                            fontSize: '14px',
                                                            color: 'var(--foreground-secondary)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                                        }}
                                                    >
                                                        <Sparkles className="w-3 h-3 inline mr-2" style={{ color: '#6366f1' }} />
                                                        {trend}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Search Results */}
                                    {hasSearched && results.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div style={{ marginBottom: '24px' }}>
                                                <p className="body" style={{ color: 'var(--foreground-tertiary)' }}>
                                                    Found {results.length} results for "{searchQuery}"
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {results.map((result, index) => (
                                                    <motion.a
                                                        key={result.id}
                                                        href={result.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="glass rounded-2xl transition-all hover:scale-[1.01] hover:border-purple-500/30"
                                                        style={{
                                                            padding: '24px',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            textDecoration: 'none'
                                                        }}
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                                                                    <ExternalLink className="w-4 h-4" style={{ color: 'var(--foreground-tertiary)' }} />
                                                                    <span className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                                                                        {new URL(result.url).hostname}
                                                                    </span>
                                                                </div>
                                                                <h3 className="body-large font-semibold" style={{ color: '#6366f1', marginBottom: '8px' }}>
                                                                    {result.title}
                                                                </h3>
                                                                <p className="body" style={{ color: 'var(--foreground-secondary)', lineHeight: '1.6' }}>
                                                                    {result.snippet}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.a>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* No Results */}
                                    {hasSearched && !searching && results.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center"
                                            style={{ paddingTop: '60px' }}
                                        >
                                            <p className="body-large" style={{ color: 'var(--foreground-secondary)' }}>
                                                No results found for "{searchQuery}"
                                            </p>
                                            <p className="body" style={{ color: 'var(--foreground-tertiary)', marginTop: '8px' }}>
                                                Try different keywords or check your spelling
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Deep Research Mode */}
                        {searchMode === 'deep' && (
                            <motion.div
                                key="deep"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                {/* Messages Area */}
                                <div
                                    className="flex-1 overflow-y-auto flex justify-center"
                                    style={{ padding: '24px', paddingBottom: '120px' }}
                                >
                                    <div className="max-w-5xl w-full">
                                        {messages.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center"
                                                style={{ paddingTop: '100px' }}
                                            >
                                                <div
                                                    className="rounded-3xl flex items-center justify-center mx-auto"
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                                                        marginBottom: '24px'
                                                    }}
                                                >
                                                    <MessageCircle className="w-10 h-10 text-white" />
                                                </div>
                                                <h2 className="h1 gradient-text" style={{ marginBottom: '16px' }}>
                                                    Deep Research Assistant
                                                </h2>
                                                <p className="body-large" style={{ color: 'var(--foreground-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                                                    Ask complex questions and get in-depth research with comprehensive analysis
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '24px' }}>
                                                {messages.map((message, index) => (
                                                    <motion.div
                                                        key={message.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        {message.role === 'assistant' && (
                                                            <div
                                                                className="rounded-xl flex items-center justify-center flex-shrink-0"
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                                    minWidth: '40px',
                                                                    minHeight: '40px'
                                                                }}
                                                            >
                                                                <MessageCircle className="w-5 h-5 text-white" />
                                                            </div>
                                                        )}

                                                        <div style={{ maxWidth: '80%' }}>
                                                            <div
                                                                className={`rounded-2xl ${message.role === 'user' ? '' : 'glass border'}`}
                                                                style={{
                                                                    padding: '18px 22px',
                                                                    background: message.role === 'user' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : undefined,
                                                                    borderColor: message.role === 'assistant' ? 'rgba(255, 255, 255, 0.1)' : undefined
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        color: message.role === 'user' ? 'white' : 'var(--foreground)',
                                                                        fontSize: '15px',
                                                                        lineHeight: '1.6'
                                                                    }}
                                                                >
                                                                    <MarkdownRenderer content={message.content} />
                                                                </div>
                                                            </div>

                                                            {message.role === 'assistant' && (
                                                                <div className="flex items-center gap-2" style={{ marginTop: '8px' }}>
                                                                    <button
                                                                        onClick={() => handleCopy(message.content, message.id)}
                                                                        className="rounded-lg hover:bg-white/5 transition-all"
                                                                        style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--foreground-tertiary)' }}
                                                                    >
                                                                        {copiedId === message.id ? (
                                                                            <>
                                                                                <Check className="w-3 h-3 inline mr-1" />
                                                                                Copied
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Copy className="w-3 h-3 inline mr-1" />
                                                                                Copy
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Input Area - Fixed at Bottom */}
                                <div
                                    className="relative flex justify-center"
                                    style={{
                                        background: 'var(--background)',
                                        borderTop: '1px solid var(--background-tertiary)',
                                        padding: '20px 24px'
                                    }}
                                >
                                    <form onSubmit={handleDeepResearch} className="max-w-5xl w-full">
                                        <div className="relative">
                                            <input
                                                ref={deepInputRef}
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Ask a research question..."
                                                disabled={researching}
                                                className="w-full glass rounded-3xl transition-all"
                                                style={{
                                                    padding: '18px 70px 18px 24px',
                                                    fontSize: '15px',
                                                    color: 'var(--foreground)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    outline: 'none',
                                                    backdropFilter: 'blur(20px)'
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!input.trim() || researching}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{
                                                    padding: '12px',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                    color: 'white'
                                                }}
                                            >
                                                {researching ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Send className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

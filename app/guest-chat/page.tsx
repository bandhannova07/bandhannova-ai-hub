'use client';

// Import chat-specific CSS (same as authenticated chat)
import '../chat/chat-dark.css';
import '../chat/chat-light.css';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    Send,
    Plus,
    Sparkles,
    MessageCircle,
    Copy,
    Check,
    Menu,
    X,
    User,
    Zap,
    Lock,
    ArrowRight,
    ArrowBigLeftDash,
} from 'lucide-react';
import { MarkdownRenderer } from '@/app/chat/[agentType]/components/MarkdownRenderer';
import { ThinkingProcess } from '@/app/chat/[agentType]/components/ThinkingProcess';
import { GeminiLoader } from '@/app/chat/[agentType]/components/GeminiLoader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ModeToggle } from '@/components/mode-toggle';

const SYSTEM_PROMPT_GUEST = "You are BandhanNova AI, a world-class intelligent assistant. Your responses must be exceptionally high-quality, professional, insightful, and helpful. Use clear, sophisticated language. Format your output beautifully using markdown. You are currently in Guest Mode.";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

// Helper function to parse thinking process from message content
function parseMessageContent(content: string) {
    const thinkingMatch = content.match(/<thinking-start>([\s\S]*?)<\/thinking-end>/);

    if (thinkingMatch) {
        const thinkingContent = thinkingMatch[1].trim();
        const answerContent = content.replace(/<thinking-start>[\s\S]*?<\/thinking-end>/, '').trim();

        return {
            hasThinking: true,
            thinking: thinkingContent,
            answer: answerContent,
            isComplete: content.includes('</thinking-end>')
        };
    }

    // Check if thinking has started but not ended (still streaming)
    if (content.includes('<thinking-start>')) {
        const thinkingContent = content.replace('<thinking-start>', '').trim();
        return {
            hasThinking: true,
            thinking: thinkingContent,
            answer: '',
            isComplete: false
        };
    }

    return {
        hasThinking: false,
        thinking: '',
        answer: content,
        isComplete: true
    };
}

export default function GuestChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [remainingQueries, setRemainingQueries] = useState(5);
    const [showAuthWall, setShowAuthWall] = useState<null | 'limit' | 'detected'>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            if (desktop) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        fetchGuestStatus();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    };

    const fetchGuestStatus = async () => {
        try {
            const response = await fetch('/api/guest/status');
            if (response.ok) {
                const data = await response.json();
                setRemainingQueries(data.remaining);
                if (data.remaining === 0) {
                    setShowAuthWall('detected');
                }
            }
        } catch (error) {
            console.error('Error fetching guest status:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userInput = input.trim();
        setInput('');

        // Reset textarea height
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.style.height = 'auto';
        }

        if (remainingQueries <= 0) {
            setShowAuthWall('limit');
            return;
        }

        setLoading(true);

        try {
            // Create user message
            const userMessage: Message = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                role: 'user',
                content: userInput,
                timestamp: new Date()
            };

            // Update UI with user message
            setMessages(prev => [...prev, userMessage]);

            // Add empty AI message for instant feedback
            const assistantId = `msg_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`;
            setMessages(prev => [...prev, {
                id: assistantId,
                role: 'assistant',
                content: '',
                timestamp: new Date()
            }]);
            setIsTyping(true);

            // Call AI API with streaming
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userInput,
                    modelId: 'barud-2-smart-fls',
                    agentType: 'conversational',
                    systemPrompt: SYSTEM_PROMPT_GUEST,
                    responseMode: 'normal',
                    conversationHistory: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    userId: 'guest',
                    enableSearch: false
                }),
            });

            if (response.status === 429) {
                setShowAuthWall('limit');
                setIsTyping(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            // Stream response
            let assistantContent = '';
            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');

            if (!reader) {
                throw new Error('No response body');
            }

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonStr = line.slice(6).trim();
                            if (!jsonStr) continue;

                            const data = JSON.parse(jsonStr);
                            if (data.choices?.[0]?.delta?.content) {
                                const content = data.choices[0].delta.content;
                                assistantContent += content;

                                // Update UI in real-time
                                setMessages(prev =>
                                    prev.map(msg =>
                                        msg.id === assistantId
                                            ? { ...msg, content: assistantContent }
                                            : msg
                                    )
                                );
                            }
                        } catch (e) {
                            console.warn('Failed to parse SSE line:', line, e);
                        }
                    }
                }
            }

            // Process remaining buffer
            if (buffer.trim()) {
                if (buffer.startsWith('data: ')) {
                    try {
                        const jsonStr = buffer.slice(6).trim();
                        if (jsonStr) {
                            const data = JSON.parse(jsonStr);
                            if (data.choices?.[0]?.delta?.content) {
                                const content = data.choices[0].delta.content;
                                assistantContent += content;
                                setMessages(prev =>
                                    prev.map(msg =>
                                        msg.id === assistantId
                                            ? { ...msg, content: assistantContent }
                                            : msg
                                    )
                                );
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to parse final buffer:', buffer, e);
                    }
                }
            }

            setIsTyping(false);
            setRemainingQueries(prev => Math.max(0, prev - 1));

        } catch (error) {
            console.error('Error sending message:', error);
            setIsTyping(false);

            const errorMessage: Message = {
                id: `msg_error_${Date.now()}`,
                role: 'assistant',
                content: '⚠️ Sorry, BandhanNova cannot connect due to network issues. Please check your internet connection and try again.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleNewChat = () => {
        setMessages([]);
        setInput('');
    };

    return (
        <div className="relative h-screen flex overflow-hidden bg-background font-inter">
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30 pointer-events-none"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 border-r transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${!isDesktop ? 'bg-black/5 backdrop-blur-[20px] shadow-2xl border-white/5' : 'glass'}`}
                style={{ width: isDesktop ? '320px' : '80%', borderColor: 'var(--background-tertiary)' }}
            >
                <div className="flex flex-col h-full overflow-y-auto no-scrollbar" style={{ padding: '18px' }}>
                    <div className="pt-4 relative">
                        {!isDesktop && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center glass rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] cursor-pointer z-[60]"
                                aria-label="Close sidebar"
                            >
                                <ArrowBigLeftDash className="w-8 h-8 text-foreground" />
                            </button>
                        )}
                        <div className="flex items-center gap-4 mb-12 px-3 cursor-pointer" onClick={() => router.push('/')}>
                            <Image src="/bandhannova-logo-final.svg" alt="Logo" width={180} height={40} />
                        </div>

                        <div className="space-y-4 mb-8">
                            <button
                                onClick={handleNewChat}
                                className="w-full flex items-center gap-4 p-4 px-5 rounded-2xl bg-white/[0.05] border border-white/10 shadow-lg group hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                <Plus className="w-5 h-5 text-primary-purple group-hover:rotate-90 transition-transform" />
                                <span className="text-sm font-bold">New Guest Chat</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <h2 className="text-[11px] font-bold text-foreground-tertiary uppercase tracking-widest mb-4 px-5 opacity-60">Guest History</h2>
                            <div className="flex flex-col gap-2 italic text-[11px] text-foreground-tertiary px-5 leading-relaxed">
                                Guest history is temporary and clears on refresh.
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 space-y-4 bg-white/[0.02] border-t border-white/[0.05] -mx-[18px] p-[18px]">
                        <div className="bg-gradient-hero/10 p-4 rounded-2xl border border-primary-purple/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-primary-purple" />
                                <span className="text-xs font-bold uppercase tracking-wider">Guest Credits</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black">{remainingQueries}/5</span>
                                <button
                                    onClick={() => router.push('/signup')}
                                    className="text-[10px] bg-primary-purple text-white px-2 py-1 rounded-lg font-bold hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 cursor-pointer"
                                >
                                    UPGRADE
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/login')}
                            className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl glass hover:bg-white/5 transition-all duration-300 text-sm font-bold hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            <Lock className="w-4 h-4" />
                            Sign In
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className="flex-1 relative flex flex-col transition-all duration-300"
                style={{ marginLeft: isDesktop && sidebarOpen ? '320px' : '0' }}
            >
                <header className="absolute top-0 left-0 w-full h-24 flex items-center justify-between px-6 z-40 bg-transparent pointer-events-none transition-all duration-300">
                    <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
                        {!isDesktop && (
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="w-12 h-12 flex items-center justify-center glass rounded-xl mr-1 sm:mr-2 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
                            >
                                <Menu className="!w-8 !h-8 text-foreground" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 transition-all duration-300 pointer-events-auto">
                        <ModeToggle />
                        <button
                            onClick={() => router.push('/signup')}
                            className="h-10 px-4 py-2 sm:px-6 rounded-xl bg-gradient-hero/80 glass-strong text-white font-bold text-[11px] sm:text-sm shadow-lg hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 whitespace-nowrap border-white/20 flex items-center justify-center"
                        >
                            Sign Up
                        </button>
                        <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/10">
                            <User className="w-5 h-5 text-foreground-tertiary" />
                        </div>
                    </div>
                </header>

                {/* Dynamic Layout Wrapper */}
                <div className={`flex-1 flex flex-col relative overflow-hidden ${messages.length === 0 ? 'justify-center items-center' : ''}`}>

                    {/* Chat Area - Scrollable but only visible if not empty */}
                    {messages.length > 0 && (
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar scroll-smooth flex flex-col items-center">
                            <div className="max-w-4xl w-full space-y-8 pb-32">
                                {messages.map((message) => {
                                    const parsed = parseMessageContent(message.content);

                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] rounded-[2rem] p-6 md:p-8 shadow-2xl border ${message.role === 'user'
                                                ? 'bg-gradient-to-br from-primary-purple/20 to-accent-cyan/20 border-primary-purple/20 ml-12'
                                                : 'glass-strong border-white/10 mr-12'
                                                }`}>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-primary-purple' : 'bg-gradient-hero'}`}>
                                                        {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                                                        {message.role === 'user' ? 'You (Guest)' : 'BandhanNova AI'}
                                                    </span>
                                                </div>

                                                {/* Thinking Process */}
                                                {message.role === 'assistant' && parsed.hasThinking && (
                                                    <ThinkingProcess
                                                        content={parsed.thinking}
                                                        isComplete={parsed.isComplete}
                                                    />
                                                )}

                                                <div className="prose prose-invert max-w-none">
                                                    {message.role === 'assistant' && !message.content ? (
                                                        <GeminiLoader />
                                                    ) : (
                                                        <MarkdownRenderer content={parsed.answer || message.content} />
                                                    )}
                                                </div>

                                                {/* Copy Button */}
                                                {message.role === 'assistant' && message.content && (
                                                    <div className="mt-6 pt-4 border-t border-white/[0.05] flex justify-end">
                                                        <button
                                                            onClick={() => handleCopy(message.content, message.id)}
                                                            className="p-2 hover:bg-white/5 rounded-lg transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] group"
                                                        >
                                                            {copiedId === message.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 opacity-40 group-hover:opacity-100" />}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    )}

                    {/* Centered Empty State (Text + Input) or Bottom Input Container */}
                    <div className={`${messages.length === 0 ? 'max-w-3xl w-full px-6 flex flex-col items-center gap-12' : 'absolute bottom-0 left-0 w-full p-4 md:p-8 pointer-events-none flex justify-center'}`}>

                        {/* Horizontal Centered Welcome Text (Only if empty) */}
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center w-full"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-gradient-hero mx-auto mb-8 flex items-center justify-center text-white shadow-2xl relative">
                                    <MessageCircle className="w-10 h-10" />
                                    <div className="absolute inset-0 bg-primary-purple/20 blur-2xl animate-pulse -z-10" />
                                </div>
                                <h1 className="text-4xl font-black mb-4">Hello Guest!</h1>
                                <p className="text-foreground-secondary text-lg max-w-md mx-auto leading-relaxed">
                                    I am your world-class AI assistant. How can I help you achieve your goals today?
                                </p>
                            </motion.div>
                        )}

                        {/* Input Box - Dynamic positioning */}
                        <motion.div
                            layout
                            className={`${messages.length === 0 ? 'w-full' : 'max-w-4xl w-full pointer-events-auto'}`}
                        >
                            <div className="glass-strong rounded-[2.5rem] border border-white/10 p-2 shadow-2xl flex items-end gap-2 relative">
                                <Textarea
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        // Auto-resize
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Ask BandhanNova anything..."
                                    className="flex-1 bg-transparent px-6 py-5 text-lg focus:outline-none font-medium text-foreground resize-none min-h-[60px] max-h-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    rows={1}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={loading || !input.trim()}
                                    className="p-4.5 rounded-[1.8rem] bg-gradient-hero text-white shadow-lg shadow-primary-purple/20 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] disabled:opacity-50 h-auto cursor-pointer"
                                    title="Send Message"
                                >
                                    <Send className="w-6 h-6" />
                                </Button>
                            </div>
                            <p className="mt-4 text-center text-[10px] text-foreground-tertiary font-bold uppercase tracking-widest">
                                Built with Premium AI Core • Indian Excellence 🇮🇳
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Auth Wall */}
                <AnimatePresence>
                    {showAuthWall && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="w-full max-w-lg glass-strong p-10 rounded-[3rem] text-center border border-white/10 shadow-2xl overflow-hidden relative"
                            >
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
                                            You have used your 5 free guest queries. To get <b>Unlimited Access</b> to all world-class AI agents, join us now!
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

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => router.push('/signup')}
                                        className="w-full p-5 rounded-2xl bg-gradient-hero text-white font-bold text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                                    >
                                        Create Free Account
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
                                        I'll wait (48 hours reset)
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
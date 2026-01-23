'use client';

// Import chat-specific CSS
import '../chat-dark.css';
import '../chat-light.css';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    Send,
    ArrowLeft,
    Plus,
    Trash2,
    Sparkles,
    Lightbulb,
    Brain,
    BookOpen,
    Briefcase,
    MessageCircle as MessageCircleIcon,
    Code,
    Copy,
    Check,
    Image as ImageIcon,
    ChefHat,
    Menu,
    X,
    Clock,
    Search,
    Globe,
    FileText,
    Zap
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth-simple';
import { getAllDBs } from '@/lib/database/multi-db';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ThinkingProcess } from './components/ThinkingProcess';
import { GeminiLoader } from './components/GeminiLoader';
import {
    getAllConversations,
    getConversation,
    createConversation,
    saveConversation,
    addMessage,
    deleteConversation,
    generateConversationTitle,
    type Conversation as StoredConversation,
    type Message as StoredMessage
} from '@/lib/storage/localStorage';
import { storeMemory } from '@/lib/qdrant/memory';
import { getModelsForTier, AI_MODELS, type ModelId, type SubscriptionTier } from '@/lib/ai/model-tiers';
import { getUserTierSimple } from '@/lib/db/get-user-tier';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const AGENT_CONFIG: Record<string, any> = {
    'creator-social': {
        name: 'Creator & Social Media',
        icon: Sparkles,
        gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        color: '#a855f7',
        description: 'Content creation expert'
    },
    'creative-productivity': {
        name: 'Creative & Productivity',
        icon: Lightbulb,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        color: '#3b82f6',
        description: 'Productivity optimizer'
    },
    'psychology-personality': {
        name: 'Psychology & Personality',
        icon: Brain,
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        color: '#ec4899',
        description: 'Psychology expert'
    },
    'study-learning': {
        name: 'Study & Learning',
        icon: BookOpen,
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        color: '#10b981',
        description: 'Learning assistant',
        models: [
            'meta-llama/llama-3.3-70b-instruct:free',
            'google/gemma-3-27b-it:free',
            'xiaomi/mimo-v2-flash:free'
        ]
    },
    'future-jobs-career': {
        name: 'Future Jobs & Career Build',
        icon: Briefcase,
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        color: '#f97316',
        description: 'Career planning advisor',
        models: [
            'deepseek/deepseek-r1-0528:free',
            'xiaomi/mimo-v2-flash:free',
            'tngtech/deepseek-r1t2-chimera:free'
        ]
    },
    'decision-maker': {
        name: 'Decision Maker',
        icon: Brain,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        color: '#8b5cf6',
        description: 'Smart decision making',
        models: [
            'deepseek/deepseek-r1-0528:free',
            'xiaomi/mimo-v2-flash:free',
            'openai/gpt-oss-120b:free'
        ]
    },
    'conversational': {
        name: 'Conversational AI',
        icon: MessageCircleIcon,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        color: '#06b6d4',
        description: '5-Agent Intelligence System',
        models: [
            '5 Specialized AI Agents',
            'Intent Analyzer',
            'Research Agent',
            'Reasoning Agent',
            'Optimizer Agent',
            'Memory & Personality'
        ]
    },
    'website-builder': {
        name: 'Website Builder',
        icon: Code,
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        color: '#ef4444',
        description: 'Code expert'
    },
    'image-maker': {
        name: 'Image Maker AI',
        icon: ImageIcon,
        gradient: '#FF6B9D',
        color: '#FF6B9D',
        description: 'Image generation expert'
    },
    'kitchen-recipe': {
        name: 'Kitchen & Recipe AI',
        icon: ChefHat,
        gradient: '#00D9FF',
        color: '#00D9FF',
        description: 'Cooking and recipe expert',
        models: [
            'nousresearch/hermes-3-llama-3.1-405b:free',
            'meta-llama/llama-3.1-405b-instruct:free',
            'xiaomi/mimo-v2-flash:free',
            'google/gemini-2.0-flash-exp:free'
        ]
    },
    'search-engine': {
        name: 'Research & Discovery AI',
        icon: Globe,
        gradient: '#6366f1',
        color: '#6366f1',
        description: 'Research assistant',
        models: [
            'google/gemini-2.0-flash-exp:free',
            'xiaomi/mimo-v2-flash:free',
            'openai/gpt-oss-120b:free'
        ]
    },
};

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

type Conversation = {
    id: string;
    title: string;
    lastMessage: string;
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

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const agentType = params.agentType as string;
    const agent = AGENT_CONFIG[agentType];
    const Icon = agent?.icon;

    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'Previous sample conversation',
            lastMessage: 'This is a sample conversation...',
            timestamp: new Date(Date.now() - 3600000)
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [currentConversationTitle, setCurrentConversationTitle] = useState<string>('New Chat');
    const [isTyping, setIsTyping] = useState(false);

    const [isDesktop, setIsDesktop] = useState(false);
    const [selectedModel, setSelectedModel] = useState<ModelId>('ispat-v2-flash'); // Default to free tier model
    const [showPlusMenu, setShowPlusMenu] = useState(false);
    const [userTier, setUserTier] = useState<SubscriptionTier>('free'); // User's subscription tier
    const [enableSearch, setEnableSearch] = useState(false); // Tavily AI search toggle
    const [researchMode, setResearchMode] = useState<'web-searching' | 'deep-research'>('web-searching'); // Research mode for search-engine agent
    const responseMode = 'normal'; // Fixed to normal mode for conversational AI

    // Set sidebar open by default on desktop
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            if (desktop) {
                setSidebarOpen(true); // Desktop: open by default
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

    const [isCreatingConversation, setIsCreatingConversation] = useState(false);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Load messages when conversation ID is available
        // BUT don't load if we're in the middle of creating a new conversation
        if (currentConversationId && user && !isCreatingConversation) {
            loadMessages(currentConversationId);
        }
    }, [currentConversationId, user]);

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

        // Load user's subscription tier
        try {
            const tier = await getUserTierSimple(currentUser.id);
            setUserTier(tier);
        } catch (error) {
            console.error('Error loading user tier:', error);
            setUserTier('free'); // Default to free on error
        }

        // Load conversations after user is set
        loadConversations();
    }

    // Load conversations from localStorage
    function loadConversationsFromStorage() {
        try {
            const allConversations = getAllConversations(agentType);

            const formattedConversations: Conversation[] = allConversations.map(conv => ({
                id: conv.id,
                title: conv.title,
                lastMessage: conv.messages[conv.messages.length - 1]?.content || '',
                timestamp: new Date(conv.updatedAt)
            }));

            setConversations(formattedConversations);
        } catch (error) {
            console.error('Error loading conversations from storage:', error);
        }
    }

    // Load messages from localStorage
    function loadMessagesFromStorage(conversationId: string) {
        try {
            const conversation = getConversation(conversationId);
            if (!conversation) return;

            const loadedMessages: Message[] = conversation.messages.map(msg => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.timestamp)
            }));

            setMessages(loadedMessages);
            setCurrentConversationTitle(conversation.title);
        } catch (error) {
            console.error('Error loading messages from storage:', error);
        }
    }

    // Legacy function - now calls localStorage version
    async function loadConversations() {
        loadConversationsFromStorage();
    }

    async function loadMessages(conversationId: string) {
        loadMessagesFromStorage(conversationId);
    }

    function scrollToBottom() {
        if (messagesEndRef.current) {
            // Scroll to center of screen instead of bottom
            messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center' // This centers the element
            });
        }
    }

    async function handleSend() {
        if (!input.trim() || loading) return;

        const userInput = input.trim();
        setInput('');

        // Reset textarea height after sending
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.style.height = 'auto';
        }

        setLoading(true);

        try {
            // Create or get conversation
            let convId = currentConversationId;
            if (!convId) {
                // Set flag to prevent loadMessages from overwriting our UI state
                setIsCreatingConversation(true);

                const newConv = createConversation(agentType, generateConversationTitle(userInput));
                convId = newConv.id;
                setCurrentConversationId(convId);
                setCurrentConversationTitle(newConv.title);

                // Clear flag after a brief delay to allow state updates
                setTimeout(() => setIsCreatingConversation(false), 100);
            }

            // Create user message
            const userMessage: StoredMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                role: 'user',
                content: userInput,
                timestamp: Date.now(),
                agentType,
                responseMode,
                model: selectedModel
            };

            // Add to localStorage
            addMessage(convId, userMessage);

            // Update UI with user message
            setMessages(prev => [...prev, {
                id: userMessage.id,
                role: 'user',
                content: userMessage.content,
                timestamp: new Date(userMessage.timestamp)
            }]);

            // 🚀 INSTANT FEEDBACK: Show AI typing immediately!
            const assistantId = `msg_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`;

            // Add empty AI message right away for instant response feel
            setMessages(prev => [...prev, {
                id: assistantId,
                role: 'assistant',
                content: '',
                timestamp: new Date()
            }]);
            setIsTyping(true);

            // Get user ID (or use anonymous)
            const { data: { session } } = await getAllDBs()[0].auth.getSession();
            const userId = session?.user?.id || 'anonymous';

            // Prepare conversation history for API
            const conversation = getConversation(convId);
            const conversationHistory = conversation?.messages.map(m => ({
                role: m.role,
                content: m.content
            })) || [];

            // Call new AI API with streaming
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userInput,
                    modelId: selectedModel, // Send modelId instead of agentType
                    responseMode,
                    conversationHistory,
                    userId,
                    enableSearch // Send search toggle state
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            // Stream response
            let assistantContent = '';

            // Read streaming response with proper UTF-8 and SSE handling
            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');

            if (!reader) {
                throw new Error('No response body');
            }

            let buffer = ''; // Buffer for incomplete lines

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode with streaming support for partial UTF-8 sequences
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete lines only
                const lines = buffer.split('\n');

                // Keep the last incomplete line in buffer
                buffer = lines.pop() || '';

                // Process complete lines
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonStr = line.slice(6).trim();
                            if (!jsonStr) continue; // Skip empty data lines

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
                            // Skip invalid JSON
                            console.warn('Failed to parse SSE line:', line, e);
                        }
                    }
                }
            }

            // Process any remaining buffered content
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

            // Save assistant message to localStorage
            const assistantMessage: StoredMessage = {
                id: assistantId,
                role: 'assistant',
                content: assistantContent,
                timestamp: Date.now(),
                agentType,
                responseMode,
                model: selectedModel
            };

            addMessage(convId, assistantMessage);

            // Store in Qdrant for memory (async, don't wait)
            // TEMPORARILY DISABLED: Transformers.js has SSR issues in Edge runtime
            // TODO: Re-enable when moving to Node.js runtime or using alternative embeddings
            // storeMemory(assistantMessage, convId, userId).catch(err =>
            //     console.error('Failed to store memory:', err)
            // );

            // Reload conversations for sidebar
            loadConversationsFromStorage();

        } catch (error) {
            console.error('Error sending message:', error);
            setIsTyping(false);

            // Show network error message
            const errorMessage = {
                id: `msg_error_${Date.now()}`,
                role: 'assistant' as const,
                content: '⚠️ Sorry, BandhanNova cannot connect due to network issues. Please check your internet connection and try again.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    }

    function handleCopy(content: string, id: string) {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    function handleNewChat() {
        setMessages([]);
        setCurrentConversationId(null);
        setCurrentConversationTitle('New Chat');
        // Reload page for fresh start
        router.refresh();
    }

    async function handleConversationClick(conversationId: string) {
        // Set as current conversation
        setCurrentConversationId(conversationId);

        // Load messages for this conversation
        await loadMessages(conversationId);

        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }

    if (!agent) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: 'var(--background)' }}
            >
                <div className="text-center">
                    <h1
                        className="font-bold"
                        style={{ fontSize: '24px', color: 'var(--foreground)', marginBottom: '16px' }}
                    >
                        Agent not found
                    </h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="rounded-2xl text-white font-semibold"
                        style={{
                            padding: '14px 28px',
                            background: 'var(--gradient-hero)'
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>
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

            {/* Conversation Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 glass border-r transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{
                    width: isDesktop ? '380px' : '70vw',
                    borderColor: 'var(--background-tertiary)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div
                    className="flex flex-col h-full"
                    style={{ padding: '24px', paddingTop: '80px' }}
                >
                    {/* Logo */}
                    <div style={{ marginBottom: '32px', marginTop: '8px' }}>
                        <div className="flex items-center gap-3">
                            <div
                                className="rounded-xl flex items-center justify-center"
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    background: agent.gradient,
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold" style={{ fontSize: '18px', color: 'var(--foreground)' }}>
                                    {agent.name}
                                </h1>
                                <p style={{ fontSize: '12px', color: 'var(--foreground-tertiary)' }}>
                                    {agent.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Header */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2
                            className="font-bold"
                            style={{ fontSize: '18px', color: 'var(--foreground)', marginBottom: '16px' }}
                        >
                            Conversations
                        </h2>

                        <button
                            onClick={handleNewChat}
                            className="w-full flex items-center justify-center gap-2 rounded-xl text-white font-semibold transition-all hover:scale-105 active:scale-95"
                            style={{
                                padding: '14px',
                                background: agent.gradient
                            }}
                        >
                            <Plus className="w-5 h-5" />
                            <span style={{ fontSize: '15px' }}>New Conversation</span>
                        </button>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => handleConversationClick(conv.id)}
                                    className="text-left rounded-xl hover:bg-white/5 transition-all hover:scale-[1.02]"
                                    style={{
                                        padding: '14px',
                                        background: currentConversationId === conv.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        border: currentConversationId === conv.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
                                    }}
                                >
                                    <p
                                        className="font-medium line-clamp-1"
                                        style={{
                                            fontSize: '14px',
                                            color: 'var(--foreground)',
                                            marginBottom: '4px'
                                        }}
                                    >
                                        {conv.title}
                                    </p>
                                    <p
                                        className="line-clamp-1"
                                        style={{
                                            fontSize: '12px',
                                            color: 'var(--foreground-tertiary)'
                                        }}
                                    >
                                        {conv.lastMessage}
                                    </p>
                                    <div className="flex items-center gap-1" style={{ marginTop: '4px' }}>
                                        <Clock className="w-3 h-3" style={{ color: 'var(--foreground-tertiary)' }} />
                                        <span style={{ fontSize: '11px', color: 'var(--foreground-tertiary)' }} suppressHydrationWarning>
                                            {conv.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

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

            {/* Desktop Sidebar Toggle Button - Top Left */}
            {isDesktop && (
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

            {/* Main Chat Area */}
            <div
                className="relative flex-1 flex flex-col transition-all duration-300"
                style={{
                    marginLeft: isDesktop && sidebarOpen ? '320px' : '0'
                }}
            >
                {/* Content Wrapper - Centers everything */}
                <div className="h-full flex flex-col">
                    {/* Header - Simple */}
                    <header
                        className="relative flex items-center justify-center"
                        style={{
                            padding: isDesktop ? '28px 24px 20px 24px' : '20px 16px 16px 16px',
                            paddingLeft: !isDesktop ? '70px' : '24px',
                            background: 'transparent'
                        }}
                    >
                        <div className="max-w-5xl w-full flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="rounded-xl flex items-center justify-center"
                                    style={{
                                        width: isDesktop ? '44px' : '36px',
                                        height: isDesktop ? '44px' : '36px',
                                        background: agent.gradient,
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    <Icon className={isDesktop ? 'w-5 h-5' : 'w-4 h-4'} style={{ color: 'white' }} />
                                </div>
                                <div>
                                    <h1
                                        className="font-semibold"
                                        style={{
                                            color: 'var(--foreground)',
                                            fontSize: isDesktop ? '16px' : '14px',
                                            marginBottom: '2px'
                                        }}
                                    >
                                        {agent.name}
                                    </h1>
                                    <p style={{ color: 'var(--foreground-tertiary)', fontSize: isDesktop ? '12px' : '11px' }}>
                                        {agent.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Messages Area - Centered */}
                    <div
                        className="relative flex-1 overflow-y-auto flex justify-center"
                        style={{ paddingBottom: isDesktop ? '120px' : '100px', padding: isDesktop ? '0 24px 120px 24px' : '0 12px 100px 12px' }}
                    >
                        <div className="max-w-5xl w-full">
                            {messages.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center"
                                    style={{ paddingTop: isDesktop ? '100px' : '60px', paddingBottom: isDesktop ? '80px' : '40px' }}
                                >
                                    <h2
                                        className="font-bold"
                                        style={{
                                            fontSize: isDesktop ? '42px' : '28px',
                                            color: 'var(--foreground)',
                                            marginBottom: isDesktop ? '16px' : '12px'
                                        }}
                                    >
                                        Start a conversation
                                    </h2>
                                    <p style={{
                                        fontSize: isDesktop ? '16px' : '14px',
                                        color: 'var(--foreground-secondary)',
                                        lineHeight: '1.6'
                                    }}>
                                        Ask me anything about {agent.name.toLowerCase()}
                                    </p>
                                </motion.div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: isDesktop ? '32px' : '20px', paddingTop: isDesktop ? '40px' : '24px', paddingBottom: isDesktop ? '120px' : '100px' }}>
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '12px'
                                            }}
                                        >
                                            <div
                                                className={message.role === 'user' ? 'user-message-book' : 'ai-message-book'}
                                                style={{
                                                    padding: message.role === 'user'
                                                        ? (isDesktop ? '20px 28px' : '16px 20px')
                                                        : (isDesktop ? '28px 32px' : '20px 24px'),
                                                    background: message.role === 'user'
                                                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)'
                                                        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                                                    backdropFilter: message.role === 'assistant' ? 'blur(12px)' : 'none',
                                                    border: message.role === 'user'
                                                        ? '1px solid rgba(99, 102, 241, 0.2)'
                                                        : '1px solid rgba(139, 92, 246, 0.2)',
                                                    borderRadius: message.role === 'user'
                                                        ? '16px 16px 4px 16px'
                                                        : '16px 16px 16px 4px',
                                                    marginLeft: message.role === 'user' ? 'auto' : '0',
                                                    marginRight: message.role === 'user' ? '0' : 'auto',
                                                    maxWidth: message.role === 'user' ? '85%' : '100%',
                                                    boxShadow: message.role === 'assistant'
                                                        ? '0 8px 32px rgba(139, 92, 246, 0.12), 0 2px 8px rgba(0, 0, 0, 0.1)'
                                                        : '0 4px 16px rgba(99, 102, 241, 0.1)',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {/* User/AI Label */}
                                                <div style={{
                                                    marginBottom: isDesktop ? '16px' : '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        background: message.role === 'user'
                                                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                                                            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                                                        border: `1px solid ${message.role === 'user' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`
                                                    }}>
                                                        <span style={{
                                                            fontSize: isDesktop ? '12px' : '11px',
                                                            fontWeight: '700',
                                                            color: message.role === 'user' ? '#6366f1' : '#8b5cf6',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            {message.role === 'user' ? '👤 You' : '🤖 ' + agent.name}
                                                        </span>
                                                    </div>
                                                    <span style={{
                                                        fontSize: isDesktop ? '11px' : '10px',
                                                        color: 'var(--foreground-tertiary)',
                                                        opacity: 0.7
                                                    }}>
                                                        {message.timestamp.toLocaleTimeString()}
                                                    </span>
                                                </div>

                                                {/* Message Text */}
                                                <div
                                                    className="message-content-book"
                                                    style={{
                                                        color: 'var(--foreground)',
                                                        fontSize: isDesktop ? '16px' : '15px',
                                                        lineHeight: '1.7',
                                                        letterSpacing: '0.2px',
                                                        fontWeight: '400',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    {message.role === 'assistant' && index === messages.length - 1 && !message.content ? (
                                                        <GeminiLoader />
                                                    ) : message.role === 'assistant' ? (
                                                        <>
                                                            {(() => {
                                                                const parsed = parseMessageContent(message.content);
                                                                return (
                                                                    <>
                                                                        {parsed.hasThinking && (
                                                                            <ThinkingProcess
                                                                                content={parsed.thinking}
                                                                                isComplete={parsed.isComplete}
                                                                            />
                                                                        )}
                                                                        {parsed.answer && (
                                                                            <MarkdownRenderer content={parsed.answer} />
                                                                        )}
                                                                    </>
                                                                );
                                                            })()}
                                                        </>
                                                    ) : (
                                                        <MarkdownRenderer content={message.content} />
                                                    )}
                                                </div>

                                                {/* Copy Button for AI Messages */}
                                                {message.role === 'assistant' && (
                                                    <div style={{
                                                        marginTop: '20px',
                                                        paddingTop: '16px',
                                                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                                        display: 'flex',
                                                        gap: '12px'
                                                    }}>
                                                        <button
                                                            onClick={() => handleCopy(message.content, message.id)}
                                                            className="rounded-lg hover:bg-white/5 transition-all hover:scale-105"
                                                            style={{
                                                                padding: '8px 14px',
                                                                fontSize: '13px',
                                                                color: 'var(--foreground-secondary)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                border: '1px solid rgba(255, 255, 255, 0.1)'
                                                            }}
                                                        >
                                                            {copiedId === message.id ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5" />
                                                                    <span>Copied</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                    <span>Copy</span>
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
                </div>
                {/* End Content Wrapper */}

                {/* Floating Input Box - Centered like ChatGPT */}
                <div
                    className="fixed bottom-0 transition-all duration-300 flex justify-center z-40"
                    style={{
                        left: isDesktop && sidebarOpen ? '320px' : '0',
                        right: '0',
                        padding: isDesktop ? '24px' : '16px',
                        background: 'linear-gradient(to top, var(--background) 0%, var(--background) 70%, transparent 100%)',
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        className="w-full max-w-5xl glass rounded-3xl border"
                        style={{
                            padding: isDesktop ? '20px' : '14px',
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(24px)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            pointerEvents: 'auto'
                        }}
                    >

                        {/* Input Row */}
                        <div className="relative flex gap-3 items-center">
                            {/* Plus Button with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowPlusMenu(!showPlusMenu)}
                                    className="rounded-2xl text-white font-semibold hover:scale-105 active:scale-95 transition-all"
                                    style={{
                                        padding: isDesktop ? '16px' : '14px',
                                        background: 'rgba(139, 92, 246, 0.8)',
                                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                                    }}
                                >
                                    <Plus className={isDesktop ? 'w-5 h-5' : 'w-4 h-4'} />
                                </button>

                                {/* Dropdown Menu */}
                                {showPlusMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="absolute bottom-full left-0 mb-3 glass rounded-2xl border"
                                        style={{
                                            width: isDesktop ? '280px' : '260px',
                                            padding: '14px',
                                            borderColor: 'var(--background-tertiary)',
                                            backdropFilter: 'blur(24px)',
                                            background: 'var(--background-secondary)',
                                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                                            zIndex: 1000
                                        }}
                                    >
                                        {/* Conditional Dropdown based on Agent Type */}
                                        {agentType === 'search-engine' ? (
                                            // Research AI specific dropdown
                                            <>
                                                {/* Media Section */}
                                                <div style={{ marginBottom: '14px' }}>
                                                    <p className="small" style={{ fontWeight: '600', color: 'var(--foreground-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        Media
                                                    </p>
                                                    <button
                                                        className="w-full flex items-center gap-3 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                                                        style={{ padding: '10px 12px', marginBottom: '4px' }}
                                                    >
                                                        <ImageIcon className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                                                        <span className="body" style={{ color: 'var(--foreground)' }}>Upload Images</span>
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-3 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                                                        style={{ padding: '10px 12px' }}
                                                    >
                                                        <FileText className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                                                        <span className="body" style={{ color: 'var(--foreground)' }}>Upload Files</span>
                                                    </button>
                                                </div>

                                                {/* Research Modes Section */}
                                                <div style={{ marginBottom: '14px' }}>
                                                    <p className="small" style={{ fontWeight: '600', color: 'var(--foreground-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        Research Models
                                                    </p>

                                                    <button
                                                        onClick={() => {
                                                            setResearchMode('web-searching');
                                                            setShowPlusMenu(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                                                        style={{
                                                            padding: '10px 12px',
                                                            marginBottom: '4px',
                                                            background: researchMode === 'web-searching' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                                                            border: researchMode === 'web-searching' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
                                                        }}
                                                    >
                                                        <Globe className="w-4 h-4" style={{ color: researchMode === 'web-searching' ? '#6366f1' : 'var(--foreground-tertiary)' }} />
                                                        <div className="flex-1 text-left">
                                                            <span className="body block" style={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: researchMode === 'web-searching' ? '600' : '400' }}>
                                                                BandhanNova 2.0 eXtreme
                                                            </span>
                                                            <span className="small block" style={{ color: 'var(--foreground-tertiary)', fontSize: '11px', marginTop: '2px' }}>
                                                                Web searching
                                                            </span>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setResearchMode('deep-research');
                                                            setShowPlusMenu(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                                                        style={{
                                                            padding: '10px 12px',
                                                            background: researchMode === 'deep-research' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                                            border: researchMode === 'deep-research' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
                                                        }}
                                                    >
                                                        <MessageCircleIcon className="w-4 h-4" style={{ color: researchMode === 'deep-research' ? '#8b5cf6' : 'var(--foreground-tertiary)' }} />
                                                        <div className="flex-1 text-left">
                                                            <span className="body block" style={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: researchMode === 'deep-research' ? '600' : '400' }}>
                                                                BandhanNova 2.0 eXtreme
                                                            </span>
                                                            <span className="small block" style={{ color: 'var(--foreground-tertiary)', fontSize: '11px', marginTop: '2px' }}>
                                                                Deep research
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            // Default dropdown for other agents
                                            <>
                                                {/* Media Section */}
                                                <div style={{ marginBottom: '14px' }}>
                                                    <p className="small" style={{ fontWeight: '600', color: 'var(--foreground-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        Media
                                                    </p>
                                                    <button
                                                        className="w-full flex items-center gap-3 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                                                        style={{ padding: '10px 12px', marginBottom: '4px' }}
                                                    >
                                                        <ImageIcon className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                                                        <span className="body" style={{ color: 'var(--foreground)' }}>Upload Images</span>
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-3 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                                                        style={{ padding: '10px 12px' }}
                                                    >
                                                        <FileText className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                                                        <span className="body" style={{ color: 'var(--foreground)' }}>Upload Files</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {/* Models Section - Hidden for search-engine */}
                                        {agentType !== 'search-engine' && (
                                            <div>
                                                <p className="small" style={{ fontWeight: '600', color: 'var(--foreground-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Models ({userTier.toUpperCase()} Tier)
                                                </p>

                                                {/* Get models for user's tier */}
                                                {(() => {
                                                    const availableModels = getModelsForTier(userTier);

                                                    return availableModels.map(modelConfig => {
                                                        const isSelected = selectedModel === modelConfig.id;

                                                        // Icon mapping for models
                                                        const getModelIcon = (id: ModelId) => {
                                                            if (id.includes('ispat')) return Sparkles;
                                                            if (id.includes('barud')) return Zap;
                                                            if (id.includes('extreme')) return Brain;
                                                            return MessageCircleIcon;
                                                        };

                                                        const Icon = getModelIcon(modelConfig.id);

                                                        return (
                                                            <button
                                                                key={modelConfig.id}
                                                                onClick={() => { setSelectedModel(modelConfig.id); setShowPlusMenu(false); }}
                                                                className="w-full flex items-center gap-3 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                                                                style={{
                                                                    padding: '10px 12px',
                                                                    marginBottom: '4px',
                                                                    background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                                                    border: isSelected ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
                                                                }}
                                                            >
                                                                <Icon className="w-4 h-4" style={{ color: isSelected ? '#8b5cf6' : 'var(--foreground-tertiary)' }} />
                                                                <div className="flex-1 text-left">
                                                                    <span className="body block" style={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: isSelected ? '600' : '400' }}>
                                                                        {modelConfig.displayName}
                                                                    </span>
                                                                    {modelConfig.isExtreme && (
                                                                        <span className="small block" style={{ color: 'var(--foreground-tertiary)', fontSize: '11px', marginTop: '2px' }}>
                                                                            Research & Analysis
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {isSelected && (
                                                                    <Check className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                                                                )}
                                                            </button>
                                                        );
                                                    });
                                                })()}

                                                {/* Upgrade prompt for non-maxx users */}
                                                {userTier !== 'maxx' && (
                                                    <div
                                                        className="rounded-xl mt-3"
                                                        style={{
                                                            padding: '12px',
                                                            background: 'rgba(139, 92, 246, 0.1)',
                                                            border: '1px solid rgba(139, 92, 246, 0.2)'
                                                        }}
                                                    >
                                                        <p className="small" style={{ color: 'var(--foreground-secondary)', fontSize: '12px', marginBottom: '6px' }}>
                                                            🚀 Want more models?
                                                        </p>
                                                        <button
                                                            onClick={() => router.push('/dashboard')}
                                                            className="text-xs font-semibold hover:underline"
                                                            style={{ color: '#8b5cf6' }}
                                                        >
                                                            Upgrade to {userTier === 'free' ? 'PRO' : userTier === 'pro' ? 'ULTRA' : 'MAXX'} →
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    // Desktop: Ctrl to send, Ctrl+Shift for new line
                                    // Mobile: Enter to send, Shift+Enter for new line
                                    if (isDesktop) {
                                        // Desktop keyboard shortcuts
                                        if (e.key === 'Enter' && e.ctrlKey) {
                                            if (e.shiftKey) {
                                                // Ctrl+Shift+Enter = new line (default behavior)
                                            } else {
                                                // Ctrl+Enter = send
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }
                                    } else {
                                        // Mobile keyboard shortcuts
                                        if (e.key === 'Enter') {
                                            if (!e.shiftKey) {
                                                // Enter alone = send
                                                e.preventDefault();
                                                handleSend();
                                            }
                                            // Shift+Enter = new line (default behavior)
                                        }
                                    }
                                }}
                                placeholder="Type your message..."
                                className="flex-1 rounded-3xl border focus:outline-none transition-all focus:border-purple-500 hover:border-purple-400 body resize-none custom-scrollbar"
                                style={{
                                    padding: isDesktop ? '16px 20px' : '14px 12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.15)',
                                    color: 'var(--foreground)',
                                    fontWeight: '400',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    minHeight: isDesktop ? '52px' : '46px',
                                    maxHeight: isDesktop ? '200px' : '120px',
                                    overflowY: 'auto'
                                }}
                                rows={1}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = Math.min(target.scrollHeight, isDesktop ? 200 : 120) + 'px';
                                }}
                                disabled={loading}
                            />

                            {/* Search Toggle Button */}
                            <Button
                                onClick={() => setEnableSearch(!enableSearch)}
                                className="flex-shrink-0"
                                style={{
                                    width: isDesktop ? '52px' : '46px',
                                    height: isDesktop ? '52px' : '46px',
                                    borderRadius: '16px',
                                    background: enableSearch
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    border: enableSearch
                                        ? 'none'
                                        : '1px solid rgba(255, 255, 255, 0.15)',
                                    color: enableSearch ? 'white' : 'var(--foreground-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: enableSearch ? '0 4px 16px rgba(102, 126, 234, 0.4)' : 'none'
                                }}
                                title={enableSearch ? '🔍 AI Search ON' : 'Enable AI Search'}
                            >
                                <Search className={isDesktop ? 'w-5 h-5' : 'w-4 h-4'} />
                            </Button>

                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="rounded-2xl text-white font-semibold hover:scale-105 active:scale-95 transition-all"
                                style={{
                                    padding: isDesktop ? '16px' : '14px',
                                    background: agent.gradient,
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.3)'
                                }}
                            >
                                <Send className={isDesktop ? 'w-5 h-5' : 'w-4 h-4'} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}

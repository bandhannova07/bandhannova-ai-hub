'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './page-light.css';
import './page-dark.css';
import {
  Sparkles,
  Sparkle,
  Send,
  Plus,
  Zap,
  Lock,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  Menu,
  X,
  User,
  ArrowBigLeftDash,
  BookOpen,
  Briefcase,
  Code,
  Brain,
  Globe,
  Crown,
  PanelLeftOpen,
  PanelLeftClose,
  Share2,
} from 'lucide-react';
import { MarkdownRenderer } from '@/app/chat/[agentType]/components/MarkdownRenderer';
import { ThinkingProcess } from '@/app/chat/[agentType]/components/ThinkingProcess';
import { getSupabase } from '@/lib/supabase';
import ParticleBackground from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ModeToggle } from '@/components/mode-toggle';

// Agent configuration
const AGENT_CONFIG: Record<string, any> = {
  conversational: {
    id: 'conversational',
    name: 'Conversational AI',
    description: 'Your intelligent daily assistant',
    icon: MessageCircle,
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  },
  'study-learning': {
    id: 'study-learning',
    name: 'Study & Learning',
    description: 'Master any subject with AI',
    icon: BookOpen,
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
  },
  'future-jobs-career': {
    id: 'future-jobs-career',
    name: 'Future Jobs & Career',
    description: 'Build your dream career',
    icon: Briefcase,
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  },
  'creator-social': {
    id: 'creator-social',
    name: 'Creator & Social Media',
    description: 'Grow your audience',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  },
  'website-builder': {
    id: 'website-builder',
    name: 'Website Builder',
    description: 'Create stunning websites',
    icon: Code,
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
  },
  'decision-maker': {
    id: 'decision-maker',
    name: 'Decision Maker',
    description: 'Make smarter choices',
    icon: Brain,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  },
  'search-engine': {
    id: 'search-engine',
    name: 'Research & Discovery',
    description: 'Deep research powered by AI',
    icon: Globe,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  },
};

const SYSTEM_PROMPT_GUEST = "You are BandhanNova AI, a world-class intelligent assistant. Analyze user intent deeply and respond in the SAME LANGUAGE the user uses (English, Bengali, Hindi, etc.). Your responses must be exceptionally high-quality, professional, insightful, and helpful. Use clear, sophisticated language. Format your output beautifully using markdown with proper headings, lists, code blocks, and emphasis. You are currently in Guest Mode.";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { type: "spring", stiffness: 400, damping: 17 }
  }
};

// Random greetings array
const GREETINGS = [
  "Hello, dear!",
  "Hello, my friend.",
  "Hey, sweet soul.",
  "Hi, sunshine!",
  "Hello, beautiful!",
  "Hey, kind heart.",
  "Hi, precious!",
  "Hey, bright eyes!",
  "Hi, happy face!"
];

// Helper function to get random greeting
function getRandomGreeting() {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

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

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingQueries, setRemainingQueries] = useState(5);
  const [showAuthWall, setShowAuthWall] = useState<null | 'limit' | 'detected' | 'locked'>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState('conversational');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    checkAuth();
    fetchGuestStatus();
    setGreeting(getRandomGreeting());

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar animation effect for desktop
  useEffect(() => {
    if (isDesktop) {
      // Open sidebar initially
      setSidebarOpen(true);

      // Close sidebar after 1.5 seconds
      const timer = setTimeout(() => {
        setSidebarOpen(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isDesktop]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        scrollToUserMessage(lastMessage.id);
      } else if (lastMessage.role === 'assistant' && !lastMessage.content) {
        // Find last user message ID to pin to top while thinking
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
        if (lastUserMsg) scrollToUserMessage(lastUserMsg.id);
      } else {
        scrollToBottom();
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const scrollToUserMessage = (msgId?: string) => {
    if (msgId) {
      setTimeout(() => {
        const element = document.getElementById(`msg-${msgId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

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

        // Sync with localStorage
        localStorage.setItem('guestCredits', JSON.stringify({
          remaining: data.remaining,
          total: data.total || 5,
          lastSync: new Date().toISOString(),
          resetAt: data.resetAt
        }));

        if (data.remaining === 0) {
          setShowAuthWall('detected');
        }
      }
    } catch (error) {
      console.error('Error fetching guest status:', error);

      // Fallback to localStorage if backend fails
      const stored = localStorage.getItem('guestCredits');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRemainingQueries(parsed.remaining || 5);
        } catch (e) {
          console.error('Error parsing stored credits:', e);
        }
      }
    }
  };

  const handleAgentChange = (agentId: string) => {
    if (!isLoggedIn && agentId !== 'conversational') {
      setShowAuthWall('locked');
      return;
    }
    setActiveAgent(agentId);
    if (!isDesktop) setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();
    setInput('');

    // Reset textarea height
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }

    // If logged in, redirect to full chat
    if (isLoggedIn) {
      router.push(`/chat/${activeAgent}?q=${encodeURIComponent(userInput)}`);
      return;
    }

    // Dev Simulation Mode
    if (userInput.trim().toLowerCase() === '/test') {
      const simulatedUserMsg = { id: Date.now().toString(), role: 'user', content: userInput };
      setMessages(prev => [...prev, simulatedUserMsg]);
      setLoading(true);
      setIsSending(true);
      setInput('');

      const simulatedId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: simulatedId, role: 'assistant', content: '' }]);
      setIsTyping(true);

      // Step 1: Message Sending status (5s)
      setTimeout(() => {
        setIsSending(false);
        // Step 2: Short Thinking Animation transition (800ms)
        setTimeout(() => {
          setMessages(prev => prev.map(m =>
            m.id === simulatedId
              ? { ...m, content: "✨ **UI Simulation Complete**\n\n- [x] Message Sending status (5s)\n- [x] Transition Thinking (< 1s)\n- [x] Simulated response delivery\n\nAnimations verified successfully!" }
              : m
          ));
          setLoading(false);
          setIsTyping(false);
        }, 800);
      }, 5000);

      return;
    }

    if (remainingQueries <= 0) {
      setShowAuthWall('limit');
      return;
    }

    const userMsg = { id: Date.now().toString(), role: 'user', content: userInput };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setIsSending(true);

    const startTime = Date.now();
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
    setIsTyping(true);

    // Ensure 5s sending window
    const sendingWait = new Promise(resolve => setTimeout(resolve, 5000));

    try {
      setRemainingQueries(prev => Math.max(0, prev - 1));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          modelId: 'ispat-v2-flash',
          agentType: activeAgent,
          systemPrompt: SYSTEM_PROMPT_GUEST,
          responseMode: 'normal',
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          userId: 'guest',
          enableSearch: false
        })
      });

      if (response.status === 429) {
        setShowAuthWall('limit');
        setIsTyping(false);
        setIsSending(false);
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let hasStartedStreaming = false;

      if (reader) {
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
                const json = JSON.parse(line.substring(6));
                if (json.choices?.[0]?.delta?.content) {
                  assistantContent += json.choices[0].delta.content;

                  if (!hasStartedStreaming) {
                    // Wait for the 5s sending window to complete
                    await sendingWait;
                    setIsSending(false);
                    // Short transition thinking animation (< 1s)
                    await new Promise(resolve => setTimeout(resolve, 800));
                    hasStartedStreaming = true;
                  }

                  setMessages(prev =>
                    prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
                  );
                }
              } catch (e) { }
            }
          }
        }
      }
      setIsTyping(false);
    } catch (error) {
      console.error('Chat error:', error);
      setIsSending(false);
      setIsTyping(false);
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, content: 'Sorry, I encountered an error. Please try again.' } : m)
      );
    } finally {
      setIsSending(false);
      setLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (content: string, id: string) => {
    const feedbackId = `share-${id}`;
    const sharedText = `${content}\n\n✨ Generated by BandhanNova AI`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BandhanNova AI Response',
          text: sharedText,
          url: window.location.href,
        });
        setCopiedId(feedbackId);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (error) {
        if ((error as any).name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to copy on other errors
          navigator.clipboard.writeText(sharedText);
          setCopiedId(feedbackId);
          setTimeout(() => setCopiedId(null), 2000);
        }
      }
    } else {
      // Fallback: Copy to clipboard if sharing is not supported
      navigator.clipboard.writeText(sharedText);
      setCopiedId(feedbackId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const creditPercentage = (remainingQueries / 5) * 100;

  return (
    <div className="relative h-[100dvh] w-full flex overflow-hidden bg-background font-inter">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient Mesh Background */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{ background: 'var(--gradient-mesh)' }}
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 border-r glass shadow-2xl"
        style={{
          width: isDesktop ? '340px' : '85%',
          borderColor: 'var(--background-tertiary)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-5" style={{ padding: '5px' }}>
          {/* Close Button (Mobile) */}
          {!isDesktop && (
            <Button
              onClick={() => setSidebarOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 h-10 w-10 z-[60] glass rounded-xl hover:scale-105 transition-transform"
            >
              <X className="w-5 h-5" />
            </Button>
          )}

          {/* Logo */}
          <motion.div
            {...fadeInUp}
            className="flex items-center gap-3 mb-8 px-2 cursor-pointer mt-8"
            onClick={() => router.push('/')}
            style={{ marginTop: '50px' }}
          >
            <Image src="/bandhannova-logo-final.svg" alt="Logo" width={200} height={45} priority />
          </motion.div>
          <p className="font-bold sidebar-subtitle px-4 opacity-70" style={{ color: 'var(--foreground-tertiary)', fontSize: '14px', fontWeight: '500', letterSpacing: '0.05em', padding: '2px' }}>
            AI HUB
          </p>

          {/* New Chat Button */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}
            style={{ padding: '2px' }}>
            <Button
              onClick={() => {
                setMessages([]);
                setInput('');
              }}
              className="w-full mb-6 h-12 rounded-xl bg-gradient-hero text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Chat
            </Button>
          </motion.div>

          <Separator className="mb-6" />

          {/* AI Agents */}
          <div className="mb-6">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3" style={{ padding: '3px' }}>
              AI Specialists
            </h2>
            <div className="space-y-2">
              {Object.values(AGENT_CONFIG).map((agent: any, index) => {
                const isPremium = agent.id !== 'conversational';
                const isLocked = !isLoggedIn && isPremium;
                const isActive = activeAgent === agent.id;

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ padding: '3px' }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${isActive
                        ? 'bg-white/10 border-white/20 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/8'
                        }`}
                      style={{ padding: '7px' }}
                      onClick={() => handleAgentChange(agent.id)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md"
                          style={{ background: agent.gradient }}
                        >
                          <agent.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
                            {agent.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {agent.description}
                          </p>
                        </div>
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : isActive ? (
                          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                        ) : null}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Bottom Section */}
          <div className="mt-auto space-y-4" style={{ paddingTop: '7px' }}>
            {!isLoggedIn && (
              <Card className="bg-gradient-to-br rounded-3xl from-primary-purple/20 to-accent-cyan/20 border-primary-purple/30" style={{ padding: '10px' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider">Guest Credits</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black">{remainingQueries}/5</span>
                      <Badge variant="secondary" className="bg-primary-purple text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Free
                      </Badge>
                    </div>
                    <Progress value={creditPercentage} className="h-2" />
                    <Button
                      onClick={() => router.push('/signup')}
                      size="sm"
                      className="w-full bg-primary-purple hover:bg-primary-purple/90 text-white"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => router.push(isLoggedIn ? '/dashboard' : '/login')}
              variant="outline"
              className="w-full justify-start glass hover:bg-white/10"
              style={{ marginTop: '10px', padding: '10px' }}
            >
              <User className="w-4 h-4 mr-2" />
              {isLoggedIn ? 'Dashboard' : 'Sign In'}
            </Button>

            <Button
              onClick={() => router.push('/landing')}
              variant="outline"
              className="w-full justify-start glass hover:bg-white/10"
              style={{ marginTop: '7px', padding: '10px' }}
            >
              <Sparkle className="w-4 h-4 mr-2" />
              Explore
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`flex-1 relative flex flex-col transition-all duration-300 ${sidebarOpen && !isDesktop ? '' : 'overflow-hidden'}`}
        style={{ marginLeft: isDesktop && sidebarOpen ? '340px' : '0' }}
      >
        {/* Header */}
        <header className="absolute top-0 left-0 w-full h-20 flex items-center justify-center px-6 z-40 bg-transparent pointer-events-none" style={{ padding: '12px' }}>
          <div className="max-w-6xl w-full flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                variant="ghost"
                size="icon"
                className="h-10 w-10 glass rounded-xl hover:scale-105 transition-transform"
              >
                {isDesktop ? (
                  sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              {!isLoggedIn && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => router.push('/login')}
                    variant="ghost"
                    size="sm"
                    className="hidden h-10 w-18 rounded-xl sm:flex glass hover:bg-white/10 transition-all hover:scale-105"
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={() => router.push('/signup')}
                    size="sm"
                    className="h-10 w-20 rounded-xl glass hover:bg-white/10 transition-all hover:scale-105"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Thinking Animation Overlay */}
        <AnimatePresence>
          {loading && !isSending && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !messages[messages.length - 1].content && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
              style={{ backgroundColor: 'transparent' }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-8"
              >
                {/* Video Animation Container - Centered on Viewport */}
                <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary-purple/20 blur-[80px] rounded-full animate-pulse" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Layout */}
        <div className={`flex-1 flex flex-col relative overflow-hidden ${messages.length === 0 ? 'justify-center items-center' : ''}`}>

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto no-scrollbar flex justify-center"
              style={{ marginTop: '50px' }}
            >
              <div className="max-w-6xl w-full" style={{ display: 'flex', flexDirection: 'column', gap: isDesktop ? '32px' : '20px', paddingTop: isDesktop ? '40px' : '24px', paddingBottom: '400px', paddingLeft: isDesktop ? '24px' : '12px', paddingRight: isDesktop ? '24px' : '12px' }}>
                {messages.map((message, index) => {
                  if (message.role === 'assistant' && !message.content && isSending) return null;
                  const parsed = parseMessageContent(message.content);

                  return (
                    <motion.div
                      key={message.id}
                      id={`msg-${message.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        scrollMarginTop: '120px' // Strong header offset
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
                            {message.role === 'user' ? (
                              <User className="w-3.5 h-3.5" style={{ color: 'var(--foreground)' }} />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--foreground)' }} />
                            )}
                            <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                              {message.role === 'user' ? (isLoggedIn ? 'You' : 'You (Guest)') : 'BandhanNova AI'}
                            </span>
                          </div>
                        </div>

                        {/* Message Content */}
                        <div
                          className="message-content-book body"
                          style={{
                            color: 'var(--foreground)',
                            lineHeight: '1.7',
                            letterSpacing: '0.2px',
                            fontWeight: '400',
                            wordBreak: 'break-word',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
                          }}
                        >
                          {message.role === 'assistant' && index === messages.length - 1 && !message.content ? (
                            <div className="flex flex-col items-start gap-4 py-4 w-full">
                              <div className="flex items-center gap-2 text-xl font-bold tracking-tight opacity-90" style={{ color: 'var(--foreground)' }}>
                                Thinking
                                <span className="flex w-10">
                                  <span className="dot-animation-1">.</span>
                                  <span className="dot-animation-2">.</span>
                                  <span className="dot-animation-3">.</span>
                                </span>
                              </div>
                              <div className="flex flex-col gap-2 w-full opacity-30">
                                <Skeleton className="h-4 w-[90%] bg-foreground/20" />
                                <Skeleton className="h-4 w-[75%] bg-foreground/20" />
                              </div>
                            </div>
                          ) : message.role === 'assistant' ? (
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
                          ) : (
                            <>
                              <MarkdownRenderer content={message.content} />
                              {message.role === 'user' && index === messages.length - 2 && isSending && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-[10px] font-bold opacity-40 mt-3 uppercase tracking-[0.2em] w-full text-right flex items-center justify-end gap-1"
                                  style={{ color: 'var(--foreground)' }}
                                >
                                  Message sending
                                  <span className="flex">
                                    <span className="dot-animation-1">.</span>
                                    <span className="dot-animation-2">.</span>
                                    <span className="dot-animation-3">.</span>
                                  </span>
                                </motion.div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Footer for AI Messages */}
                        {message.role === 'assistant' && message.content && (
                          <div style={{
                            marginTop: '20px',
                            paddingTop: '16px',
                            borderTop: '1px solid var(--background-tertiary)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                          }}>
                            {/* Generated By Footer */}
                            {(!loading || index !== messages.length - 1) && (
                              <div className="flex items-center gap-2 small" style={{ color: 'var(--foreground)', fontWeight: '500', opacity: 0.7 }}>
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                <span>✨ Generated by <b>BandhanNova AI</b></span>
                              </div>
                            )}

                            {/* Copy Button */}
                            <div style={{
                              display: 'flex',
                              gap: '8px',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <span className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                                BandhanNova AI can make mistakes. Double check important info.
                              </span>
                              <div style={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center'
                              }}>
                                <Button
                                  onClick={() => handleShare(message.content, message.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-white/10"
                                  title="Share"
                                >
                                  {copiedId === `share-${message.id}` ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Share2 className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  onClick={() => handleCopy(message.content, message.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-white/10"
                                  title="Copy"
                                >
                                  {copiedId === message.id ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <div style={{ height: '120px', width: '100%' }} />
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Empty State / Input Container */}
          <div className={`${messages.length === 0 ? 'max-w-5xl w-full px-6 flex flex-col items-center gap-12' : 'absolute bottom-0 left-0 w-full p-4 md:p-8 pointer-events-none flex justify-center'}`}
            style={messages.length > 0 ? {
              background: 'linear-gradient(to top, var(--background) 0%, var(--background) 70%, transparent 100%)',
              zIndex: 40
            } : {}}
          >

            {/* Welcome Message */}
            {messages.length === 0 && (
              <motion.div
                {...fadeInUp}
                className="text-center w-full flex flex-col items-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center"
                >
                  <div className="relative animate-float">
                    <Image
                      src="/bandhannova-logo-final.svg"
                      alt="BandhanNova Logo"
                      width={500}
                      height={500}
                      className="relative z-10"
                      priority
                    />
                  </div>
                </motion.div>
                <h1 className="text-5xl font-black mb-4 gradient-text">
                  {greeting || 'Hello!'}
                </h1>
                <p className="text-xl max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--foreground)', opacity: 1 }}>
                  How can I help you achieve your goals today?
                </p>
              </motion.div>
            )}

            {/* Input Box */}
            <motion.div
              layout
              className={`${messages.length === 0 ? 'w-full' : 'max-w-6xl w-full pointer-events-auto'}`}
            >
              <div className="relative w-full" style={{ padding: '7px', marginBottom: '12px' }}>
                <div className="relative rounded-xl border-2 border-white/20 bg-background/80 backdrop-blur-sm transition-all duration-200 focus-within:border-primary-purple/50 focus-within:bg-background/90 flex items-center">
                  <Textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask anything..."
                    className="flex-1 rounded-xl bg-transparent px-3 pr-16 text-[22px] focus-visible:ring-0 focus-visible:ring-offset-0 border-0 resize-none placeholder:text-muted-foreground w-full"
                    style={{ padding: '18px', paddingTop: '16px', paddingBottom: '16px', fontSize: '1.1rem', minHeight: '60px' }}
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-14 flex items-center justify-center rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                    style={{ background: 'var(--gradient-hero)' }}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div >

        {/* Auth Wall Dialog */}
        <Dialog open={showAuthWall !== null} onOpenChange={() => setShowAuthWall(null)}>
          <DialogContent className="sm:max-w-md glass-strong border-white/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-purple/10 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-cyan/10 blur-3xl rounded-full -ml-16 -mb-16" />

            <DialogHeader className="relative">
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-xl">
                <Lock className="w-8 h-8" />
              </div>
              <DialogTitle className="text-2xl font-black text-center bg-gradient-to-r from-primary-purple to-accent-cyan bg-clip-text text-transparent">
                {showAuthWall === 'limit' && 'Limit Reached!'}
                {showAuthWall === 'detected' && 'Welcome Back!'}
                {showAuthWall === 'locked' && 'Member Only Agent'}
              </DialogTitle>
              <DialogDescription className="text-center text-base pt-2">
                {showAuthWall === 'limit' && (
                  <>You've used your 5 free guest queries. Get <strong>unlimited access</strong> to all AI agents!</>
                )}
                {showAuthWall === 'detected' && (
                  <>Our system detects you've already used your free credits. Please sign in to continue.</>
                )}
                {showAuthWall === 'locked' && (
                  <>This specialized AI agent is for members only. Sign up free to unlock all agents!</>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-6 relative">
              <Button
                onClick={() => router.push('/signup')}
                className="w-full h-12 bg-gradient-hero text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="w-full h-12 glass hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowAuthWall(null)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                {showAuthWall === 'locked' ? 'Return to Chat' : "I'll wait (48h reset)"}
              </Button>
            </div>
          </DialogContent>
        </Dialog >
      </main >

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .dot-animation-1 { animation: dot 1.4s infinite; animation-delay: 0s; }
        .dot-animation-2 { animation: dot 1.4s infinite; animation-delay: 0.2s; }
        .dot-animation-3 { animation: dot 1.4s infinite; animation-delay: 0.4s; }

        @keyframes dot {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div >
  );
}

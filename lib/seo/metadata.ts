import { Metadata } from 'next';

// Base URL for the application
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://bandhannova.in';

// Default metadata for the entire application
export const defaultMetadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: 'BandhanNova Platforms – Building AI that actually helps',
        template: '%s | BandhanNova Platforms',
    },
    description:
        "India's first next-generation AI life-growing platform designed for the Gen-Z era. Multi-brain AI system for learning, creativity, social media, decision making, career building, and personal growth.",
    keywords: [
        'AI platform',
        'Indian AI',
        'Gen-Z',
        'personal growth',
        'AI learning',
        'career building',
        'multi-language AI',
        'AI assistant',
        'conversational AI',
        'study AI',
        'career AI',
        'content creator AI',
        'decision maker AI',
        'research AI',
    ],
    authors: [{ name: 'BandhanNova Platforms' }],
    creator: 'BandhanNova Platforms',
    publisher: 'BandhanNova Platforms',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: BASE_URL,
        siteName: 'BandhanNova Platforms',
        title: 'BandhanNova Platforms – Building AI that actually helps',
        description:
            "India's first next-generation AI life-growing platform for Gen-Z",
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'BandhanNova Platforms - AI for Gen-Z',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BandhanNova Platforms – Building AI that actually helps',
        description:
            "India's first next-generation AI life-growing platform for Gen-Z",
        images: ['/og-image.png'],
        creator: '@bandhannova',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/icon-192.png',
        shortcut: '/icon-192.png',
        apple: '/icon-192.png',
    },
    manifest: '/manifest.json',
};

// Page-specific metadata generators
export const pageMetadata = {
    home: (): Metadata => ({
        title: 'BandhanNova Platforms – AI Hub for Gen-Z India',
        description:
            'Experience 11+ specialized AI agents for learning, career building, content creation, and personal growth. Free to start, unlimited for members.',
        openGraph: {
            title: 'BandhanNova Platforms – AI Hub for Gen-Z India',
            description:
                'Experience 11+ specialized AI agents for learning, career building, content creation, and personal growth.',
            url: BASE_URL,
        },
    }),

    guestChat: (): Metadata => ({
        title: 'Try AI Chat Free – No Login Required',
        description:
            'Experience BandhanNova AI with 5 free queries. Chat with our conversational AI assistant without creating an account. Sign up for unlimited access to 11+ specialized agents.',
        keywords: [
            'free AI chat',
            'no login AI',
            'guest chat',
            'try AI free',
            'conversational AI',
            'AI assistant',
        ],
        openGraph: {
            title: 'Try AI Chat Free – No Login Required | BandhanNova',
            description:
                'Experience BandhanNova AI with 5 free queries. No login required.',
            url: `${BASE_URL}/guest-chat`,
        },
    }),

    dashboard: (): Metadata => ({
        title: 'Dashboard',
        description:
            'Access your personalized AI dashboard with unlimited queries across 11+ specialized AI agents.',
        robots: {
            index: false,
            follow: false,
        },
    }),

    chat: (agentName: string): Metadata => ({
        title: `${agentName} AI`,
        description: `Chat with ${agentName} AI agent for specialized assistance. Unlimited queries for BandhanNova members.`,
        robots: {
            index: false,
            follow: false,
        },
    }),

    login: (): Metadata => ({
        title: 'Login to BandhanNova',
        description:
            'Sign in to access unlimited AI queries across 11+ specialized agents. Continue your AI-powered growth journey.',
        openGraph: {
            title: 'Login to BandhanNova Platforms',
            description: 'Sign in to access unlimited AI queries.',
            url: `${BASE_URL}/login`,
        },
    }),

    signup: (): Metadata => ({
        title: 'Sign Up Free – Get Unlimited AI Access',
        description:
            'Create your free BandhanNova account and unlock unlimited access to 11+ specialized AI agents for learning, career, creativity, and personal growth.',
        keywords: [
            'sign up AI',
            'free AI account',
            'unlimited AI',
            'AI registration',
            'create AI account',
        ],
        openGraph: {
            title: 'Sign Up Free – Get Unlimited AI Access | BandhanNova',
            description:
                'Create your free account and unlock unlimited access to 11+ AI agents.',
            url: `${BASE_URL}/signup`,
        },
    }),

    about: (): Metadata => ({
        title: 'About Us – India\'s AI Platform for Gen-Z',
        description:
            'Learn about BandhanNova Platforms, India\'s first next-generation AI life-growing platform designed specifically for Gen-Z. Our mission, vision, and the team behind the AI revolution.',
        keywords: [
            'about BandhanNova',
            'Indian AI startup',
            'Gen-Z AI platform',
            'AI mission',
            'AI vision',
        ],
        openGraph: {
            title: 'About Us – India\'s AI Platform for Gen-Z | BandhanNova',
            description:
                'Learn about BandhanNova, India\'s first AI life-growing platform for Gen-Z.',
            url: `${BASE_URL}/about`,
        },
    }),

    contact: (): Metadata => ({
        title: 'Contact Us – Get in Touch',
        description:
            'Have questions or feedback? Contact the BandhanNova team. We\'re here to help you make the most of our AI platform.',
        keywords: ['contact BandhanNova', 'AI support', 'customer service', 'feedback'],
        openGraph: {
            title: 'Contact Us – Get in Touch | BandhanNova',
            description: 'Have questions? Contact the BandhanNova team.',
            url: `${BASE_URL}/contact`,
        },
    }),

    privacy: (): Metadata => ({
        title: 'Privacy Policy',
        description:
            'Read our privacy policy to understand how BandhanNova collects, uses, and protects your personal information.',
        openGraph: {
            title: 'Privacy Policy | BandhanNova Platforms',
            description: 'How we collect, use, and protect your personal information.',
            url: `${BASE_URL}/privacy`,
        },
    }),

    terms: (): Metadata => ({
        title: 'Terms of Service',
        description:
            'Read the terms and conditions for using BandhanNova Platforms and our AI services.',
        openGraph: {
            title: 'Terms of Service | BandhanNova Platforms',
            description: 'Terms and conditions for using BandhanNova Platforms.',
            url: `${BASE_URL}/terms`,
        },
    }),

    onboarding: (step: string): Metadata => ({
        title: `Onboarding – ${step}`,
        description: 'Complete your profile to get personalized AI experiences tailored to your goals and preferences.',
        robots: {
            index: false,
            follow: false,
        },
    }),
};

// Agent-specific metadata
export const agentMetadata: Record<string, { name: string; description: string }> = {
    'conversational': {
        name: 'Conversational AI',
        description: 'Your intelligent daily assistant for everything.',
    },
    'study-learning': {
        name: 'Study & Learning AI',
        description: 'Concept clarity, daily study plans, and notes assistant.',
    },
    'future-jobs-career': {
        name: 'Future Jobs & Career Build AI',
        description: 'Startup guidance, business planning, and career advisor.',
    },
    'creator-social': {
        name: 'Creator & Social Media AI',
        description: 'YouTube, Instagram, branding, and content strategist.',
    },
    'website-builder': {
        name: 'Website Builder AI',
        description: 'Build complete websites from a single prompt.',
    },
    'decision-maker': {
        name: 'Decision Maker AI',
        description: 'Smart decision making and logic analyzer.',
    },
    'search-engine': {
        name: 'Research & Discovery AI',
        description: 'Real-time deep research and fact-checked insights.',
    },
};

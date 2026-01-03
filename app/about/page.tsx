'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, Heart, Zap, Users, Globe, Shield, Sparkles } from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            icon: Heart,
            title: 'User-Centric',
            description: 'Every feature designed with Gen-Z needs in mind',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'Pushing boundaries of AI-powered learning',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your data, your control, always secure',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            icon: Globe,
            title: 'Inclusive',
            description: 'Supporting all Indian languages and beyond',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        }
    ];

    const features = [
        {
            icon: Sparkles,
            title: '7 Specialized AI Agents',
            description: 'From conversational AI to business strategy, each agent is expertly trained'
        },
        {
            icon: Users,
            title: 'Built for Gen-Z',
            description: 'Understanding the unique challenges and aspirations of young India'
        },
        {
            icon: Target,
            title: 'Action-Oriented',
            description: 'Not just answers, but actionable insights that drive real growth'
        },
        {
            icon: Eye,
            title: 'Memory System',
            description: 'AI that remembers you, learns from you, and grows with you'
        }
    ];

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Content */}
            <div className="relative z-10 flex justify-center" style={{ padding: '0 24px', width: '100%' }}>
                <div className="w-full" style={{ paddingTop: '80px', paddingBottom: '80px', maxWidth: '1200px' }}>
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                        style={{ marginBottom: '100px' }}
                    >
                        <div className="mb-8 flex justify-center">
                            <Image
                                src="/bandhannova-logo-final.svg"
                                alt="BandhanNova AI Hub"
                                width={600}
                                height={150}
                            />
                        </div>
                        <h1
                            className="font-bold mb-6"
                            style={{
                                fontSize: '56px',
                                color: 'var(--foreground)',
                                lineHeight: '1.2',
                                marginBottom: '30px'
                            }}
                        >
                            India's First <span className="gradient-text">AI Life-Growing Platform</span>
                        </h1>
                        <p
                            className="flex flex-col items-center text-center"
                            style={{
                                fontSize: '20px',
                                color: 'var(--foreground-secondary)',
                                lineHeight: '1.8',
                                maxWidth: '800px'
                            }}
                        >
                            BandhanNova AI Hub is revolutionizing how Gen-Z learns, grows, and achieves their dreams through intelligent AI companions that inspire action, not just provide answers.
                        </p>
                    </motion.div>

                    {/* Mission & Vision */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto"
                        style={{ marginBottom: '100px', maxWidth: '1200px' }}
                    >
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass rounded-3xl border"
                            style={{
                                padding: '48px',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(20px)'
                            }}
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
                                <Target className="w-10 h-10 text-white" />
                            </div>
                            <h2
                                className="font-bold mb-4 text-center"
                                style={{
                                    fontSize: '32px',
                                    color: 'var(--foreground)'
                                }}
                            >
                                Our Mission
                            </h2>
                            <p
                                className="text-center"
                                style={{
                                    fontSize: '16px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.8'
                                }}
                            >
                                To empower every young Indian with AI-powered tools that transform learning into action, confusion into clarity, and dreams into achievable goals.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass rounded-3xl border"
                            style={{
                                padding: '48px',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(20px)'
                            }}
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
                                <Eye className="w-10 h-10 text-white" />
                            </div>
                            <h2
                                className="font-bold mb-4 text-center"
                                style={{
                                    fontSize: '32px',
                                    color: 'var(--foreground)'
                                }}
                            >
                                Our Vision
                            </h2>
                            <p
                                className="text-center"
                                style={{
                                    fontSize: '16px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.8'
                                }}
                            >
                                To become the most trusted AI companion for Gen-Z across India, creating a generation of confident, skilled, and successful individuals who shape the future.
                            </p>
                        </motion.div>
                    </div>

                    {/* Core Values */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ marginBottom: '100px' }}
                    >
                        <h2
                            className="font-bold text-center mb-16"
                            style={{
                                fontSize: '40px',
                                color: 'var(--foreground)'
                            }}
                        >
                            Our Core <span className="gradient-text">Values</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto" style={{ maxWidth: '1200px' }}>
                            {values.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -8 }}
                                        className="glass rounded-2xl border text-center"
                                        style={{
                                            padding: '32px 24px',
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(20px)'
                                        }}
                                    >
                                        <div
                                            className="rounded-xl flex items-center justify-center mb-4 mx-auto"
                                            style={{
                                                width: '64px',
                                                height: '64px',
                                                background: value.gradient,
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                            }}
                                        >
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3
                                            className="font-bold mb-2"
                                            style={{
                                                fontSize: '20px',
                                                color: 'var(--foreground)'
                                            }}
                                        >
                                            {value.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: '14px',
                                                color: 'var(--foreground-secondary)',
                                                lineHeight: '1.6'
                                            }}
                                        >
                                            {value.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* What Makes Us Unique */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        style={{ marginBottom: '100px' }}
                    >
                        <h2
                            className="font-bold text-center mb-16"
                            style={{
                                fontSize: '40px',
                                color: 'var(--foreground)'
                            }}
                        >
                            What Makes Us <span className="gradient-text">Unique</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto" style={{ maxWidth: '1200px' }}>
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0 + index * 0.1 }}
                                        className="glass rounded-2xl border flex gap-6"
                                        style={{
                                            padding: '32px',
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(20px)'
                                        }}
                                    >
                                        <div
                                            className="rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{
                                                width: '64px',
                                                height: '64px',
                                                background: 'var(--gradient-hero)',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                            }}
                                        >
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3
                                                className="font-bold mb-2"
                                                style={{
                                                    fontSize: '22px',
                                                    color: 'var(--foreground)'
                                                }}
                                            >
                                                {feature.title}
                                            </h3>
                                            <p
                                                style={{
                                                    fontSize: '16px',
                                                    color: 'var(--foreground-secondary)',
                                                    lineHeight: '1.6'
                                                }}
                                            >
                                                {feature.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Our Innovations */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                        style={{ marginBottom: '100px' }}
                    >
                        <h2
                            className="font-bold text-center mb-16"
                            style={{
                                fontSize: '40px',
                                color: 'var(--foreground)'
                            }}
                        >
                            Our <span className="gradient-text">Innovations</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto" style={{ maxWidth: '1200px' }}>
                            {/* Ispat-v2-ultra */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 }}
                                whileHover={{ scale: 1.03, y: -8 }}
                                className="glass rounded-3xl border"
                                style={{
                                    padding: '40px 32px',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)'
                                }}
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
                                    <Zap className="w-10 h-10 text-white" />
                                </div>
                                <h3
                                    className="font-bold mb-3 text-center"
                                    style={{
                                        fontSize: '24px',
                                        color: 'var(--foreground)'
                                    }}
                                >
                                    Ispat-v2-ultra
                                </h3>
                                <p
                                    className="text-center mb-4"
                                    style={{
                                        fontSize: '16px',
                                        color: 'var(--foreground-secondary)',
                                        lineHeight: '1.7'
                                    }}
                                >
                                    Our flagship AI model designed for deep reasoning and complex problem-solving. Ispat-v2-ultra excels at understanding context, providing nuanced responses, and handling multi-step tasks with exceptional accuracy.
                                </p>
                                <div
                                    className="text-center text-sm font-semibold"
                                    style={{
                                        color: 'var(--accent-cyan)',
                                        marginTop: '16px'
                                    }}
                                >
                                    Available in Pro & Ultra Plans
                                </div>
                            </motion.div>

                            {/* Ispat-v3-maxx */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.6 }}
                                whileHover={{ scale: 1.03, y: -8 }}
                                className="glass rounded-3xl border relative"
                                style={{
                                    padding: '40px 32px',
                                    borderColor: 'var(--primary-purple)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <div
                                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-2xl text-xs font-semibold text-white text-center"
                                    style={{ background: 'var(--gradient-hero)' }}
                                >
                                    MOST ADVANCED
                                </div>
                                <div
                                    className="rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h3
                                    className="font-bold mb-3 text-center"
                                    style={{
                                        fontSize: '24px',
                                        color: 'var(--foreground)'
                                    }}
                                >
                                    Ispat-v3-maxx
                                </h3>
                                <p
                                    className="text-center mb-4"
                                    style={{
                                        fontSize: '16px',
                                        color: 'var(--foreground-secondary)',
                                        lineHeight: '1.7'
                                    }}
                                >
                                    The pinnacle of our AI innovation. Ispat-v3-maxx combines advanced reasoning, creative thinking, and emotional intelligence to provide truly transformative interactions. Built for those who demand excellence.
                                </p>
                                <div
                                    className="text-center text-sm font-semibold"
                                    style={{
                                        color: 'var(--accent-cyan)',
                                        marginTop: '16px'
                                    }}
                                >
                                    Exclusive to Maxx Plan
                                </div>
                            </motion.div>

                            {/* Barud3-fast */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.7 }}
                                whileHover={{ scale: 1.03, y: -8 }}
                                className="glass rounded-3xl border"
                                style={{
                                    padding: '40px 32px',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)'
                                }}
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
                                    <Zap className="w-10 h-10 text-white" />
                                </div>
                                <h3
                                    className="font-bold mb-3 text-center"
                                    style={{
                                        fontSize: '24px',
                                        color: 'var(--foreground)'
                                    }}
                                >
                                    Barud3-fast
                                </h3>
                                <p
                                    className="text-center mb-4"
                                    style={{
                                        fontSize: '16px',
                                        color: 'var(--foreground-secondary)',
                                        lineHeight: '1.7'
                                    }}
                                >
                                    Speed meets intelligence. Barud3-fast delivers lightning-quick responses without compromising quality. Perfect for rapid-fire questions, quick research, and real-time assistance when you need answers now.
                                </p>
                                <div
                                    className="text-center text-sm font-semibold"
                                    style={{
                                        color: 'var(--accent-cyan)',
                                        marginTop: '16px'
                                    }}
                                >
                                    Available in Pro, Ultra & Maxx
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Our Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 }}
                        className="glass rounded-3xl border mx-auto"
                        style={{
                            padding: '64px 48px',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            marginBottom: '80px',
                            maxWidth: '1200px'
                        }}
                    >
                        <h2
                            className="font-bold text-center mb-12"
                            style={{
                                fontSize: '40px',
                                color: 'var(--foreground)'
                            }}
                        >
                            Our <span className="gradient-text">Story</span>
                        </h2>
                        <div className="space-y-6">
                            <p
                                style={{
                                    fontSize: '18px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.8',
                                    textAlign: 'center'
                                }}
                            >
                                BandhanNova AI Hub was born from a simple observation: Gen-Z doesn't just want information—they want transformation. They don't need another search engine; they need a companion that understands their journey.
                            </p>
                            <p
                                style={{
                                    fontSize: '18px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.8',
                                    textAlign: 'center'
                                }}
                            >
                                We built BandhanNova to bridge the gap between AI's potential and India's aspirations. With support for multiple Indian languages, culturally relevant insights, and AI that actually remembers and learns from you, we're creating something unprecedented.
                            </p>
                            <p
                                style={{
                                    fontSize: '18px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.8',
                                    textAlign: 'center'
                                }}
                            >
                                This is just the beginning. Join us in building the future of AI-powered growth for India's youth.
                            </p>
                        </div>
                    </motion.div>

                    {/* Back to Dashboard */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0 }}
                        className="flex flex-col items-center text-center"
                    >
                        <Link
                            href="/dashboard"
                            className="flex flex-col items-center gap-3 rounded-xl transition-all hover:bg-white/5"
                            style={{
                                padding: '14px 16px',
                                color: 'var(--foreground-secondary)'
                            }}
                        >
                            Back to Dashboard
                        </Link>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

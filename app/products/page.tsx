'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    ArrowLeft,
    Mic,
    Headphones,
    Video,
    Lightbulb,
    Laptop,
    Monitor,
    Keyboard,
    HardDrive,
    Watch,
    Wifi,
    BookOpen,
    PenTool,
    Armchair,
    ExternalLink,
    Filter,
    ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Product categories with icons and taglines
const CATEGORIES = [
    {
        id: 'all',
        name: 'All Products',
        icon: ShoppingCart,
        tagline: 'Browse everything'
    },
    {
        id: 'creators',
        name: '🎙️ Creator Command Center',
        icon: Mic,
        tagline: 'Tools that turn ideas into influence.'
    },
    {
        id: 'laptops',
        name: '🧠 AI Power Machines',
        icon: Laptop,
        tagline: 'Built for coding, AI & serious work.'
    },
    {
        id: 'gadgets',
        name: '⚡ Future Tech Essentials',
        icon: Watch,
        tagline: 'Smart tools for a smarter life.'
    },
    {
        id: 'learning',
        name: '📘 Mind & Mastery Tools',
        icon: BookOpen,
        tagline: 'Upgrade your brain, not just your setup.'
    },
    {
        id: 'premium',
        name: '💼 Elite Tech Investments',
        icon: Headphones,
        tagline: 'Buy once. Use for years.'
    },
];

// Sample products - REPLACE affiliateLink with your Amazon Associate links
const PRODUCTS = [
    // Creator Command Center
    {
        id: 1,
        name: 'Blue Yeti USB Microphone',
        category: 'creators',
        description: 'Professional USB mic for streaming, podcasting & recording',
        price: '₹12,999',
        originalPrice: '₹15,999',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK', // Replace with your link
        badge: 'Bestseller',
        icon: Mic
    },
    {
        id: 2,
        name: 'Sony WH-1000XM5 Headphones',
        category: 'creators',
        description: 'Industry-leading noise cancellation for creators',
        price: '₹29,990',
        originalPrice: '₹34,990',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        badge: 'Premium',
        icon: Headphones
    },
    {
        id: 3,
        name: 'Logitech C920 Pro Webcam',
        category: 'creators',
        description: 'Full HD 1080p webcam for professional streaming',
        price: '₹6,495',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        icon: Video
    },
    {
        id: 4,
        name: 'Neewer Ring Light Kit',
        category: 'creators',
        description: '18-inch LED ring light with stand for perfect lighting',
        price: '₹4,999',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        icon: Lightbulb
    },

    // AI Power Machines
    {
        id: 5,
        name: 'MacBook Pro M3',
        category: 'laptops',
        description: 'Ultimate machine for AI development & coding',
        price: '₹1,69,900',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        badge: 'Top Pick',
        icon: Laptop
    },
    {
        id: 6,
        name: 'Dell UltraSharp 27" 4K Monitor',
        category: 'laptops',
        description: 'Professional 4K monitor for coding & design',
        price: '₹42,999',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        icon: Monitor
    },
    {
        id: 7,
        name: 'Keychron K2 Mechanical Keyboard',
        category: 'laptops',
        description: 'Wireless mechanical keyboard for programmers',
        price: '₹7,999',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        badge: 'Popular',
        icon: Keyboard
    },
    {
        id: 8,
        name: 'Samsung 1TB NVMe SSD',
        category: 'laptops',
        description: 'Blazing fast storage for your projects',
        price: '₹8,499',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        icon: HardDrive
    },

    // Future Tech Essentials
    {
        id: 9,
        name: 'Apple Watch Series 9',
        category: 'gadgets',
        description: 'Advanced health & fitness tracking',
        price: '₹41,900',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        badge: 'New',
        icon: Watch
    },
    {
        id: 10,
        name: 'Sony WF-1000XM5 Earbuds',
        category: 'gadgets',
        description: 'Premium ANC earbuds with exceptional sound',
        price: '₹19,990',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        icon: Headphones
    },
    {
        id: 11,
        name: 'TP-Link WiFi 6 Router',
        category: 'gadgets',
        description: 'Next-gen WiFi for seamless connectivity',
        price: '₹5,999',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        icon: Wifi
    },

    // Mind & Mastery Tools
    {
        id: 12,
        name: 'Atomic Habits by James Clear',
        category: 'learning',
        description: 'Build better habits, break bad ones',
        price: '₹399',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        badge: 'Bestseller',
        icon: BookOpen
    },
    {
        id: 13,
        name: 'Wacom Intuos Graphics Tablet',
        category: 'learning',
        description: 'Digital drawing tablet for creators',
        price: '₹6,999',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        icon: PenTool
    },

    // Elite Tech Investments
    {
        id: 14,
        name: 'Bose QuietComfort Ultra',
        category: 'premium',
        description: 'Ultimate noise cancellation experience',
        price: '₹34,999',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        badge: 'Premium',
        icon: Headphones
    },
    {
        id: 15,
        name: 'Herman Miller Aeron Chair',
        category: 'premium',
        description: 'Ergonomic chair for long coding sessions',
        price: '₹89,999',
        affiliateLink: 'https://amzn.to/YOUR_AFFILIATE_LINK',
        badge: 'Investment',
        icon: Armchair
    },
];

export default function ProductsPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredProducts = selectedCategory === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === selectedCategory);

    const currentCategory = CATEGORIES.find(c => c.id === selectedCategory);

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{ background: 'var(--gradient-mesh)', opacity: 0.3, zIndex: 0 }}
            />

            {/* Header */}
            <header style={{
                position: 'relative',
                zIndex: 1,
                padding: '24px',
                borderBottom: '1px solid var(--background-tertiary)'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/dashboard')}
                            style={{
                                padding: '8px',
                                background: 'rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="h2" style={{ color: 'var(--foreground)', marginBottom: '4px' }}>
                                Amazon Affiliate Store
                            </h1>
                            <p className="body" style={{ color: 'var(--foreground-tertiary)' }}>
                                {currentCategory?.tagline || 'Curated tech products for creators & developers'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '32px' }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px'
                    }}>
                        <Filter className="w-5 h-5" style={{ color: 'var(--foreground-tertiary)' }} />
                        <p className="body font-semibold" style={{ color: 'var(--foreground-tertiary)' }}>
                            Categories
                        </p>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '12px'
                    }}>
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            return (
                                <Button
                                    key={category.id}
                                    variant={isActive ? 'default' : 'ghost'}
                                    onClick={() => setSelectedCategory(category.id)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: '4px',
                                        padding: '16px',
                                        background: isActive ? 'var(--gradient-hero)' : 'rgba(255, 255, 255, 0.05)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        height: 'auto',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                                        <Icon className="w-5 h-5" />
                                        <span className="body font-semibold" style={{ fontSize: '14px' }}>
                                            {category.name}
                                        </span>
                                    </div>
                                    <span className="small" style={{
                                        color: isActive ? 'rgba(255,255,255,0.9)' : 'var(--foreground-tertiary)',
                                        fontSize: '11px'
                                    }}>
                                        {category.tagline}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Products Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredProducts.map((product, index) => {
                        const ProductIcon = product.icon;
                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--background-tertiary)',
                                    borderRadius: '12px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden'
                                }}>
                                    <CardHeader style={{ padding: '20px' }}>
                                        {/* Product Icon */}
                                        <div style={{
                                            width: '100%',
                                            height: '140px',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: '8px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid var(--background-tertiary)'
                                        }}>
                                            <ProductIcon className="w-16 h-16" style={{ color: 'var(--primary)' }} />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                            <CardTitle className="h4" style={{ color: 'var(--foreground)', fontSize: '16px' }}>
                                                {product.name}
                                            </CardTitle>
                                            {product.badge && (
                                                <Badge style={{
                                                    background: 'var(--gradient-hero)',
                                                    color: 'white',
                                                    fontSize: '9px',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                }}>
                                                    {product.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="body" style={{
                                            color: 'var(--foreground-tertiary)',
                                            fontSize: '13px',
                                            lineHeight: '1.5'
                                        }}>
                                            {product.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent style={{ marginTop: 'auto', padding: '0 20px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                                            <p className="h3" style={{ color: 'var(--primary)', fontSize: '20px' }}>
                                                {product.price}
                                            </p>
                                            {product.originalPrice && (
                                                <p className="small" style={{
                                                    color: 'var(--foreground-tertiary)',
                                                    textDecoration: 'line-through',
                                                    fontSize: '12px'
                                                }}>
                                                    {product.originalPrice}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter style={{ padding: '0 20px 20px' }}>
                                        <Button
                                            onClick={() => window.open(product.affiliateLink, '_blank')}
                                            style={{
                                                width: '100%',
                                                background: 'var(--gradient-hero)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                padding: '12px 20px',
                                                borderRadius: '8px',
                                                border: 'none'
                                            }}
                                        >
                                            <span className="body font-medium">View on Amazon</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            textAlign: 'center',
                            padding: '64px 24px',
                            color: 'var(--foreground-tertiary)'
                        }}
                    >
                        <ShoppingCart className="w-16 h-16" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <p className="h4" style={{ marginBottom: '8px', color: 'var(--foreground)' }}>No products found</p>
                        <p className="body">Try selecting a different category</p>
                    </motion.div>
                )}

                {/* Affiliate Disclosure */}
                <div style={{
                    marginTop: '48px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    border: '1px solid var(--background-tertiary)'
                }}>
                    <p className="small" style={{ color: 'var(--foreground-tertiary)', textAlign: 'center' }}>
                        💡 <strong>Affiliate Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases.
                        This means we may receive a small commission when you purchase through our links at no extra cost to you.
                    </p>
                </div>
            </main>
        </div>
    );
}

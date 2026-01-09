'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Book, Server, Sparkles, ShoppingCart, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Product categories
const CATEGORIES = [
    { id: 'all', name: 'All Products', icon: ShoppingCart },
    { id: 'books', name: 'Books', icon: Book },
    { id: 'hosting', name: 'Hosting', icon: Server },
    { id: 'ai-tools', name: 'AI Tools', icon: Sparkles },
];

// Sample products - Replace with your actual affiliate products
const PRODUCTS = [
    {
        id: 1,
        name: 'The AI Revolution Book',
        category: 'books',
        description: 'Complete guide to understanding and leveraging AI in your business',
        price: '$29.99',
        image: '/placeholder-book.jpg',
        affiliateLink: 'https://your-affiliate-link.com/book1',
        badge: 'Bestseller'
    },
    {
        id: 2,
        name: 'Premium Web Hosting',
        category: 'hosting',
        description: 'Fast, reliable hosting with 99.9% uptime guarantee',
        price: '$9.99/mo',
        image: '/placeholder-hosting.jpg',
        affiliateLink: 'https://your-affiliate-link.com/hosting1',
        badge: 'Popular'
    },
    {
        id: 3,
        name: 'ChatGPT Pro Access',
        category: 'ai-tools',
        description: 'Unlimited access to advanced AI models and features',
        price: '$20/mo',
        image: '/placeholder-ai.jpg',
        affiliateLink: 'https://your-affiliate-link.com/ai1',
        badge: 'New'
    },
    // Add more products here
];

export default function ProductsPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredProducts = selectedCategory === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            color: 'var(--foreground)'
        }}>
            {/* Header */}
            <header style={{
                padding: '24px',
                borderBottom: '1px solid var(--background-tertiary)',
                background: 'var(--background-secondary)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/dashboard')}
                            style={{ padding: '8px' }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="h2" style={{ color: 'var(--foreground)', marginBottom: '4px' }}>
                                Products
                            </h1>
                            <p className="body" style={{ color: 'var(--foreground-tertiary)' }}>
                                Discover premium tools, books, and services
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
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
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}>
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            return (
                                <Button
                                    key={category.id}
                                    variant={isActive ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(category.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 20px',
                                        background: isActive ? 'var(--primary)' : 'transparent',
                                        border: isActive ? 'none' : '1px solid var(--background-tertiary)'
                                    }}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="body font-medium">{category.name}</span>
                                </Button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Products Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card style={{
                                background: 'var(--background-secondary)',
                                border: '1px solid var(--background-tertiary)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <CardHeader>
                                    {/* Product Image Placeholder */}
                                    <div style={{
                                        width: '100%',
                                        height: '180px',
                                        background: 'var(--background-tertiary)',
                                        borderRadius: '8px',
                                        marginBottom: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <ShoppingCart className="w-12 h-12" style={{ color: 'var(--foreground-tertiary)' }} />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                        <CardTitle className="h4">{product.name}</CardTitle>
                                        {product.badge && (
                                            <Badge variant="secondary" style={{
                                                background: 'var(--primary)',
                                                color: 'white',
                                                fontSize: '10px',
                                                padding: '2px 8px'
                                            }}>
                                                {product.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="body" style={{ color: 'var(--foreground-tertiary)' }}>
                                        {product.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent style={{ marginTop: 'auto' }}>
                                    <p className="h3" style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                                        {product.price}
                                    </p>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        onClick={() => window.open(product.affiliateLink, '_blank')}
                                        style={{
                                            width: '100%',
                                            background: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span className="body font-medium">View Product</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
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
                        <p className="h4" style={{ marginBottom: '8px' }}>No products found</p>
                        <p className="body">Try selecting a different category</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

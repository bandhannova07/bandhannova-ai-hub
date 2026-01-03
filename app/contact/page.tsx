'use client';

import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, User, FileText } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement form submission
        console.log('Form submitted:', formData);
    };

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Content */}
            <div className="relative" style={{ zIndex: 10, paddingTop: '40px', paddingBottom: '20px' }}>
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
                    <div className="container mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="display mb-8" style={{ color: 'var(--foreground)' }}>
                                Let's <span className="gradient-text">Grow Together</span>
                            </h1>
                            <div className="flex justify-center items-center w-full" style={{ marginBottom: '20px' }}>
                                <p className="body-large max-w-3xl text-center px-8" style={{ color: 'var(--foreground-secondary)' }}>
                                    Have questions? Need support? Want to partner with us? Want to give us feedback? We'd love to hear from you!
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="relative px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="lg:col-span-2 glass rounded-3xl border"
                                style={{
                                    padding: '48px',
                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <h2 className="h2 mb-8" style={{ color: 'var(--foreground)', marginBottom: '10px' }}>Send us a message</h2>
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Name & Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)', marginBottom: '10px' }}>
                                                Name *
                                            </label>
                                            <div className="relative">
                                                <User
                                                    className="absolute w-5 h-5"
                                                    style={{
                                                        left: '16px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--foreground-tertiary)'
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-5 h-13 py-4 rounded-xl glass border-0 focus:ring-2 focus:ring-purple-500 transition-all"
                                                    style={{ color: 'var(--foreground)', background: 'var(--background-secondary)', paddingLeft: '50px' }}
                                                    placeholder="Your name"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)', marginBottom: '10px' }}>
                                                Email *
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute w-5 h-5"
                                                    style={{
                                                        left: '16px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--foreground-tertiary)'
                                                    }}
                                                />
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full h-13 px-5 py-4 rounded-xl glass border-0 focus:ring-2 focus:ring-purple-500 transition-all"
                                                    style={{ color: 'var(--foreground)', background: 'var(--background-secondary)', paddingLeft: '50px' }}
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inquiry Type */}
                                    <div>
                                        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)', marginBottom: '10px' }}>
                                            Inquiry Type
                                        </label>
                                        <select
                                            value={formData.inquiryType}
                                            onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                            className="w-full h-13 px-5 py-4 rounded-xl glass border-0 focus:ring-2 focus:ring-purple-500 transition-all"
                                            style={{ color: 'var(--foreground)', background: 'var(--background-secondary)', paddingLeft: '10px' }}
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="sales">Sales & Pricing</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="feedback">Feedback</option>
                                        </select>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)', marginBottom: '10px' }}>
                                            Subject *
                                        </label>
                                        <div className="relative">
                                            <FileText
                                                className="absolute w-5 h-5"
                                                style={{
                                                    left: '16px',
                                                    top: '40%',
                                                    bottom: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'var(--foreground-tertiary)'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full h-13 px-5 py-4 rounded-xl glass border-0 focus:ring-2 focus:ring-purple-500 transition-all"
                                                style={{ color: 'var(--foreground)', background: 'var(--background-secondary)', marginBottom: '10px', paddingLeft: '50px' }}
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)', marginBottom: '10px' }}>
                                            Message *
                                        </label>
                                        <textarea
                                            required
                                            rows={7}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-5 py-4 rounded-3xl glass border-0 focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                                            style={{ color: 'var(--foreground)', background: 'var(--background-secondary)', paddingLeft: '10px', paddingTop: '10px' }}
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full h-13 px-8 py-5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 text-lg"
                                        style={{
                                            background: 'var(--gradient-hero)',
                                            color: 'white',
                                            marginTop: '32px'
                                        }}
                                    >
                                        Send Message
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </motion.div>

                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="space-y-6"
                            >
                                {/* Email */}
                                <div className="glass rounded-2xl border" style={{ padding: '32px', borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: '25px' }}>
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-10 h-10 rounded-2xl flex flex-xol items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="h3" style={{ color: 'var(--foreground)' }}>Email Us</h3>
                                    </div>
                                    <p className="body" style={{ color: 'var(--foreground-secondary)', fontSize: '15px' }}>
                                        support@bandhannova.in
                                    </p>
                                </div>

                                {/* Response Time */}
                                <div className="glass rounded-2xl border" style={{ padding: '32px', borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: '25px' }}>
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-10 h-10 rounded-2xl flex flex-xol items-center justify-center" style={{ background: 'linear-gradient(135deg, #223CCF 0%, #00D9FF 100%)' }}>
                                            <MessageSquare className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="h3" style={{ color: 'var(--foreground)' }}>Response Time</h3>
                                    </div>
                                    <p className="body" style={{ color: 'var(--foreground-secondary)', fontSize: '15px' }}>
                                        We typically respond within 24 hours on business days
                                    </p>
                                </div>

                                {/* FAQ Link */}
                                <div className="glass rounded-2xl border" style={{ padding: '32px', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                                    <h3 className="h3 mb-4" style={{ color: 'var(--foreground)' }}>Quick Help</h3>
                                    <p className="body mb-6" style={{ color: 'var(--foreground-secondary)', fontSize: '15px' }}>
                                        Looking for instant answers? Check out our FAQ section
                                    </p>
                                    <Link
                                        href="/faq"
                                        className="w-full h-13 px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                        style={{
                                            background: 'var(--background-secondary)',
                                            color: 'var(--foreground)',
                                            marginTop: '15px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        View FAQ
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Social Links */}
                <section className="relative px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '60px' }}>
                    <div className="container mx-auto max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="glass rounded-3xl border text-center"
                            style={{ padding: '28px', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            <h2 className="h2 mb-5" style={{ color: 'var(--foreground)' }}>
                                Connect With Us
                            </h2>
                            <p className="body mb-8" style={{ color: 'var(--foreground-secondary)', fontSize: '16px', marginTop: '20px', marginBottom: '20px' }}>
                                Follow us on social media for updates, tips, and community discussions
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <a
                                    href="https://www.youtube.com/@BandhanNovaPlatforms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                                    style={{
                                        background: 'var(--background-secondary)',
                                        color: 'var(--foreground)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Youtube
                                </a>
                                <a
                                    href="https://www.instagram.com/bandhannovaplatforms/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                                    style={{
                                        background: 'var(--background-secondary)',
                                        color: 'var(--foreground)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://x.com/BandhanNovaPlat/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                                    style={{
                                        background: 'var(--background-secondary)',
                                        color: 'var(--foreground)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    X
                                </a>
                                <a
                                    href="https://www.facebook.com/bandhannovaplatforms/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                                    style={{
                                        background: 'var(--background-secondary)',
                                        color: 'var(--foreground)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Facebook
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </main>
    );
}

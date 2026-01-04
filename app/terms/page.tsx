'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
    const router = useRouter();
    return (
        <main className="relative min-h-screen overflow-hidden" style={{ padding: '48px 0' }}>
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Content */}
            <div className="relative z-10 w-full" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ marginBottom: '48px' }}
                >
                    <h1 className="display text-center" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                        Terms & Conditions
                    </h1>
                    <p className="body text-center" style={{ color: 'var(--foreground-secondary)' }}>
                        Last updated: December 26, 2024
                    </p>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass rounded-3xl"
                    style={{ padding: '48px 40px', marginBottom: '32px' }}
                >
                    <div style={{ color: 'var(--foreground-secondary)', lineHeight: '1.8' }}>
                        {/* Introduction */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                1. Introduction
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                Welcome to BandhanNova AI Hub ("we," "our," or "us"). By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
                            </p>
                            <p>
                                BandhanNova is India's first AI-powered life-operating system designed to help Gen-Z users learn faster, think clearer, and grow smarter through our suite of 7 specialized AI agents.
                            </p>
                        </section>

                        {/* Acceptance of Terms */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                2. Acceptance of Terms
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                By creating an account or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy.
                            </p>
                            <p>
                                You must be at least 13 years old to use our services. If you are under 18, you must have parental or guardian consent.
                            </p>
                        </section>

                        {/* User Accounts */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                3. User Accounts
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Account Creation:</strong> You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Account Security:</strong> You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
                            </p>
                            <p>
                                <strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.
                            </p>
                        </section>

                        {/* Services */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                4. Our Services
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                BandhanNova provides access to 7 specialized AI agents covering various aspects of personal and professional growth:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li>Creator & Social Growth AI</li>
                                <li>Creative & Productivity AI</li>
                                <li>Psychology & Personality AI</li>
                                <li>Study Planner & Learning AI</li>
                                <li>Business & Career Builder AI</li>
                                <li>Conversational Platform AI</li>
                                <li>Full Website Builder AI</li>
                            </ul>
                            <p>
                                We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
                            </p>
                        </section>

                        {/* Pricing & Payment */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                5. Pricing & Payment
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Free Tier:</strong> We offer a free tier with limited access to our AI agents.
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Paid Plans:</strong> Premium features require a paid subscription. All prices are in Indian Rupees (₹) unless otherwise stated.
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Billing:</strong> Subscriptions are billed monthly or annually based on your chosen plan. Payments are non-refundable except as required by law.
                            </p>
                            <p>
                                <strong>Price Changes:</strong> We reserve the right to modify pricing with 30 days' notice to existing subscribers.
                            </p>
                        </section>

                        {/* User Conduct */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                6. User Conduct
                            </h2>
                            <p style={{ marginBottom: '12px' }}>You agree NOT to:</p>
                            <ul style={{ marginLeft: '24px' }}>
                                <li>Use our services for any illegal or unauthorized purpose</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt our services</li>
                                <li>Share your account with others</li>
                                <li>Use our AI outputs for harmful, discriminatory, or unethical purposes</li>
                                <li>Reverse engineer or copy our technology</li>
                            </ul>
                        </section>

                        {/* Intellectual Property */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                7. Intellectual Property
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Our Content:</strong> All content, features, and functionality of BandhanNova are owned by us and protected by copyright, trademark, and other intellectual property laws.
                            </p>
                            <p>
                                <strong>Your Content:</strong> You retain ownership of content you create using our AI agents. However, you grant us a license to use, store, and process your content to provide our services.
                            </p>
                        </section>

                        {/* Limitation of Liability */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                8. Limitation of Liability
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                BandhanNova is provided "as is" without warranties of any kind. We do not guarantee that our services will be uninterrupted, error-free, or secure.
                            </p>
                            <p>
                                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                            </p>
                        </section>

                        {/* Changes to Terms */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                9. Changes to Terms
                            </h2>
                            <p>
                                We reserve the right to modify these Terms and Conditions at any time. We will notify users of significant changes via email or platform notification. Continued use of our services after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                10. Contact Us
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                If you have any questions about these Terms and Conditions, please contact us:
                            </p>
                            <p>
                                Email: <span style={{ color: 'var(--accent-cyan)' }}>legal@bandhannova.com</span><br />
                                Support: <span style={{ color: 'var(--accent-cyan)' }}>support@bandhannova.com</span>
                            </p>
                        </section>
                    </div>
                </motion.div>

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center"
                >
                    <button
                        onClick={() => router.back()}
                        className="text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 cursor-pointer"
                        style={{
                            color: 'var(--foreground-tertiary)',
                            display: 'inline-block',
                            background: 'transparent',
                            border: 'none',
                            padding: '8px 16px'
                        }}
                    >
                        ← Back
                    </button>
                </motion.div>
            </div>
        </main>
    );
}

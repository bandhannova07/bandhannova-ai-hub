'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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
                        Privacy Policy
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
                                At BandhanNova AI Hub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and AI services.
                            </p>
                            <p>
                                By using BandhanNova, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our services.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                2. Information We Collect
                            </h2>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                2.1 Personal Information
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                When you create an account, we collect:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                                <li>Name and email address</li>
                                <li>Password (encrypted)</li>
                                <li>Profile information (optional)</li>
                                <li>Payment information (processed securely by third-party providers)</li>
                            </ul>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                2.2 Usage Data
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                We automatically collect information about your interactions with our platform:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                                <li>AI agent usage and conversation history</li>
                                <li>Feature preferences and settings</li>
                                <li>Device information (browser, OS, IP address)</li>
                                <li>Log data and analytics</li>
                            </ul>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                2.3 Content You Create
                            </h3>
                            <p>
                                We store content you create using our AI agents, including prompts, generated outputs, and saved projects, to provide continuous service and improve your experience.
                            </p>
                        </section>

                        {/* How We Use Your Information */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                3. How We Use Your Information
                            </h2>
                            <p style={{ marginBottom: '12px' }}>We use your information to:</p>
                            <ul style={{ marginLeft: '24px' }}>
                                <li>Provide, maintain, and improve our AI services</li>
                                <li>Personalize your experience and remember your preferences</li>
                                <li>Process payments and manage subscriptions</li>
                                <li>Send important updates, notifications, and support messages</li>
                                <li>Analyze usage patterns to enhance our platform</li>
                                <li>Train and improve our AI models (using anonymized data)</li>
                                <li>Prevent fraud and ensure platform security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        {/* Data Sharing */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                4. How We Share Your Information
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                We do NOT sell your personal information. We may share your data only in the following circumstances:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our platform (hosting, payment processing, analytics)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                            </ul>
                            <p>
                                All third-party providers are contractually obligated to protect your data and use it only for specified purposes.
                            </p>
                        </section>

                        {/* Data Security */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                5. Data Security
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                We implement industry-standard security measures to protect your information:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li>End-to-end encryption for sensitive data</li>
                                <li>Secure HTTPS connections</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Data backup and disaster recovery systems</li>
                            </ul>
                            <p>
                                However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                            </p>
                        </section>

                        {/* Data Retention */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                6. Data Retention
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                We retain your personal information for as long as your account is active or as needed to provide services. You can request deletion of your data at any time.
                            </p>
                            <p>
                                After account deletion, we may retain certain information for legal compliance, fraud prevention, and legitimate business purposes for up to 90 days.
                            </p>
                        </section>

                        {/* Your Rights */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                7. Your Privacy Rights
                            </h2>
                            <p style={{ marginBottom: '12px' }}>You have the right to:</p>
                            <ul style={{ marginLeft: '24px' }}>
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Restriction:</strong> Limit how we process your data</li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                8. Cookies & Tracking
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                We use cookies and similar technologies to enhance your experience, analyze usage, and remember your preferences. You can control cookies through your browser settings.
                            </p>
                            <p>
                                Types of cookies we use: Essential (required for functionality), Analytics (usage tracking), and Preference (settings and customization).
                            </p>
                        </section>

                        {/* Children's Privacy */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                9. Children's Privacy
                            </h2>
                            <p>
                                Our services are designed for users aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe we have collected data from a child under 13, please contact us immediately.
                            </p>
                        </section>

                        {/* International Users */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                10. International Data Transfers
                            </h2>
                            <p>
                                BandhanNova is based in India. If you access our services from outside India, your information may be transferred to and processed in India. By using our services, you consent to this transfer.
                            </p>
                        </section>

                        {/* Changes to Policy */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                11. Changes to This Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification. The "Last updated" date at the top indicates when the policy was last revised.
                            </p>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                12. Contact Us
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                If you have questions about this Privacy Policy or want to exercise your privacy rights, contact us:
                            </p>
                            <p>
                                Email: <span style={{ color: 'var(--accent-cyan)' }}>privacy@bandhannova.com</span><br />
                                Support: <span style={{ color: 'var(--accent-cyan)' }}>support@bandhannova.com</span><br />
                                Data Protection Officer: <span style={{ color: 'var(--accent-cyan)' }}>dpo@bandhannova.com</span>
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

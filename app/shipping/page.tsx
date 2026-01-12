'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ShippingPage() {
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
                        Shipping Policy
                    </h1>
                    <p className="body text-center" style={{ color: 'var(--foreground-secondary)' }}>
                        Last updated: January 12, 2026
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
                                1. Digital Service Delivery
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                BandhanNova AI Hub is a <strong>100% digital platform</strong>. We provide AI-powered services that are delivered entirely online. There are no physical products to ship.
                            </p>
                            <p>
                                All our services, including access to our 7 specialized AI agents, are instantly available through your account dashboard upon successful subscription activation.
                            </p>
                        </section>

                        {/* Service Activation */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                2. Service Activation Timeline
                            </h2>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                2.1 Free Tier
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                Free tier access is activated <strong>immediately</strong> upon account creation. You can start using our AI agents right away with limited features.
                            </p>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                2.2 Paid Subscriptions
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                Premium features are activated within:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li><strong>Instant activation:</strong> Most payment methods (UPI, Cards, Net Banking)</li>
                                <li><strong>Up to 24 hours:</strong> Bank transfers and certain payment gateways</li>
                                <li><strong>Manual verification:</strong> International payments may take 24-48 hours</li>
                            </ul>
                            <p>
                                You will receive an email confirmation once your subscription is activated.
                            </p>
                        </section>

                        {/* Access Delivery */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                3. How You Access Our Services
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                Once your subscription is active, you can access BandhanNova services through:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li><strong>Web Platform:</strong> Login at bandhannova.com from any browser</li>
                                <li><strong>Mobile Responsive:</strong> Access from any smartphone or tablet</li>
                                <li><strong>Progressive Web App (PWA):</strong> Install on your device for app-like experience</li>
                                <li><strong>24/7 Availability:</strong> Access your AI agents anytime, anywhere</li>
                            </ul>
                            <p>
                                All your data, conversations, and projects are synced across devices in real-time.
                            </p>
                        </section>

                        {/* Delivery Issues */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                4. Service Delivery Issues
                            </h2>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                4.1 Payment Successful but No Access
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                If your payment was successful but you don't have access to premium features:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li>Wait 5-10 minutes and refresh your browser</li>
                                <li>Log out and log back in to your account</li>
                                <li>Check your email for activation confirmation</li>
                                <li>Contact support@bandhannova.com with your transaction ID</li>
                            </ul>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                4.2 Technical Issues
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                If you experience technical difficulties accessing our services:
                            </p>
                            <ul style={{ marginLeft: '24px' }}>
                                <li>Clear your browser cache and cookies</li>
                                <li>Try a different browser or device</li>
                                <li>Check our status page for any ongoing maintenance</li>
                                <li>Contact our technical support team</li>
                            </ul>
                        </section>

                        {/* Service Availability */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                5. Service Availability
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                We strive to maintain 99.9% uptime for our platform. However, service may be temporarily unavailable due to:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li>Scheduled maintenance (announced in advance)</li>
                                <li>Emergency security updates</li>
                                <li>Infrastructure upgrades</li>
                                <li>Force majeure events</li>
                            </ul>
                            <p>
                                We will notify users of planned maintenance at least 24 hours in advance via email and platform notifications.
                            </p>
                        </section>

                        {/* Geographic Restrictions */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                6. Geographic Availability
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                BandhanNova services are available globally, with primary focus on Indian users. Our services can be accessed from anywhere with internet connectivity.
                            </p>
                            <p>
                                <strong>Note:</strong> Some features may have regional limitations based on AI model availability and local regulations.
                            </p>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                7. Contact Us
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                For questions about service delivery or access issues:
                            </p>
                            <p>
                                Email: <span style={{ color: 'var(--accent-cyan)' }}>support@bandhannova.in</span><br />
                                Technical Support: <span style={{ color: 'var(--accent-cyan)' }}>tech@bandhannova.in</span><br />
                                Response Time: Within 24 hours
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

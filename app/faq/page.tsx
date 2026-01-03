'use client';

import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqCategories = [
        {
            category: 'Getting Started',
            icon: '🚀',
            questions: [
                {
                    question: 'What is BandhanNova?',
                    answer: 'BandhanNova is India\'s comprehensive AI platform designed for everyone - students, professionals, homemakers, and entrepreneurs. We offer multiple specialized AI assistants working together to help you with work, study, creativity, and personal growth.'
                },
                {
                    question: 'How is BandhanNova different from ChatGPT?',
                    answer: 'While ChatGPT is a general-purpose AI, BandhanNova offers 10 specialized AI agents (Creator & Social, Productivity, Psychology, Study, Business, Conversational, Website Builder, Image Maker, Kitchen & Recipe, and Search Engine AI) all working together. We\'re specifically designed for Indian users with support for 12 Indian languages and understanding of Indian context.'
                },
                {
                    question: 'Is BandhanNova free to use?',
                    answer: 'Yes! BandhanNova offers a free plan to get you started. We also have Pro and Premium plans with additional features and higher usage limits. Indian users can get special offers on premium plans.'
                },
                {
                    question: 'Do I need technical knowledge to use BandhanNova?',
                    answer: 'Not at all! BandhanNova is designed to be user-friendly for everyone, regardless of technical background. Simply sign up, choose an AI assistant, and start chatting naturally.'
                }
            ]
        },
        {
            category: 'Features & Capabilities',
            icon: '⚡',
            questions: [
                {
                    question: 'What AI assistants are available?',
                    answer: 'We offer 10 specialized AI assistants: 1) Creator & Social Growth AI, 2) Creative & Productivity AI, 3) Psychology & Personality AI, 4) Study Planner & Learning AI, 5) Business & Career Builder AI, 6) Conversational Platform AI, 7) Full Website Builder AI, 8) Image Maker AI, 9) Kitchen & Recipe AI, and 10) Search Engine AI.'
                },
                {
                    question: 'Can I use multiple AI assistants at once?',
                    answer: 'Yes! All our AI assistants work together seamlessly. You can switch between them or use them in combination to get the best results for your needs.'
                },
                {
                    question: 'What languages does BandhanNova support?',
                    answer: 'BandhanNova supports 12 languages: English, Hindi (हिंदी), Bengali (বাংলা), Marathi (मराठी), Tamil (தமிழ்), Gujarati (ગુજરાતી), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), and Urdu (اردو).'
                },
                {
                    question: 'Can I create images with BandhanNova?',
                    answer: 'Yes! Our Image Maker AI can create stunning images, graphics, and visual content from text descriptions. Perfect for social media, presentations, and creative projects.'
                },
                {
                    question: 'Can I build websites without coding?',
                    answer: 'Absolutely! Our Website Builder AI can create complete, professional websites from a single prompt - no coding knowledge required. Just describe what you want, and watch it come to life.'
                }
            ]
        },
        {
            category: 'Account & Billing',
            icon: '💳',
            questions: [
                {
                    question: 'How do I create an account?',
                    answer: 'Click on "Start Your Journey" or "Sign Up" button on our homepage. Enter your email, create a password, and verify your email address. That\'s it - you\'re ready to start!'
                },
                {
                    question: 'What are the different pricing plans?',
                    answer: 'We offer three plans: Free (basic features, limited usage), Pro (advanced features, higher limits), and Premium (unlimited access, priority support). Indian users may qualify for special offers.'
                },
                {
                    question: 'How can I upgrade my plan?',
                    answer: 'Go to your Dashboard, click on "Plans", choose your desired plan, and follow the payment process. Your upgrade will be instant!'
                },
                {
                    question: 'Can I cancel my subscription anytime?',
                    answer: 'Yes, you can cancel your subscription at any time from your Dashboard. You\'ll continue to have access until the end of your billing period.'
                },
                {
                    question: 'Do you offer refunds?',
                    answer: 'We offer a 7-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team within 7 days of purchase for a full refund.'
                }
            ]
        },
        {
            category: 'Privacy & Security',
            icon: '🔒',
            questions: [
                {
                    question: 'Is my data safe with BandhanNova?',
                    answer: 'Absolutely! We use industry-standard encryption and security measures to protect your data. Your conversations and personal information are stored securely and never shared with third parties without your consent.'
                },
                {
                    question: 'Do you use my conversations to train AI?',
                    answer: 'We respect your privacy. Your conversations are used only to improve your personal experience with our platform. We do not use your private data to train our AI models without explicit consent.'
                },
                {
                    question: 'Can I delete my account and data?',
                    answer: 'Yes, you have full control over your data. You can delete your account and all associated data at any time from your account settings. This action is permanent and cannot be undone.'
                },
                {
                    question: 'How do you handle payment information?',
                    answer: 'We use secure payment gateways and do not store your credit card information on our servers. All payment processing is handled by trusted third-party payment processors.'
                }
            ]
        },
        {
            category: 'Technical Support',
            icon: '🛠️',
            questions: [
                {
                    question: 'I forgot my password. How do I reset it?',
                    answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
                },
                {
                    question: 'Why is the AI not responding?',
                    answer: 'This could be due to high traffic or a temporary technical issue. Try refreshing the page or logging out and back in. If the problem persists, contact our support team at support@bandhannova.in.'
                },
                {
                    question: 'Can I use BandhanNova on mobile devices?',
                    answer: 'Yes! BandhanNova is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile. We also plan to release dedicated mobile apps soon.'
                },
                {
                    question: 'What browsers are supported?',
                    answer: 'BandhanNova works best on modern browsers like Chrome, Firefox, Safari, and Edge. Make sure your browser is updated to the latest version for the best experience.'
                },
                {
                    question: 'How do I report a bug or issue?',
                    answer: 'You can report bugs or issues through our Feedback button in the Dashboard, or email us directly at support@bandhannova.in. Please include details about the issue and screenshots if possible.'
                }
            ]
        },
        {
            category: 'Use Cases',
            icon: '💡',
            questions: [
                {
                    question: 'How can students benefit from BandhanNova?',
                    answer: 'Students can use our Study Planner & Learning AI for homework help, exam preparation, concept explanations, and study plans. The Psychology AI can help with confidence and communication skills.'
                },
                {
                    question: 'How can professionals use BandhanNova?',
                    answer: 'Professionals can use our Creative & Productivity AI for emails, presentations, and brainstorming. The Business & Career AI helps with career planning and skill development.'
                },
                {
                    question: 'How can homemakers benefit?',
                    answer: 'Homemakers can use our Kitchen & Recipe AI for delicious recipes, cooking tips, and meal planning. The Image Maker AI can help create beautiful content for personal projects.'
                },
                {
                    question: 'How can entrepreneurs use BandhanNova?',
                    answer: 'Entrepreneurs can use our Business & Career AI for business planning, the Creator & Social AI for marketing, the Website Builder AI for online presence, and the Image Maker AI for branding materials.'
                }
            ]
        }
    ];

    const filteredFAQs = faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Content */}
            <div className="relative" style={{ zIndex: 10, paddingTop: '40px', paddingBottom: '60px' }}>
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                    <div className="container mx-auto text-center max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex justify-center" style={{ marginBottom: '24px' }}>
                                <div className="p-5 rounded-xl glass border" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                                    <HelpCircle className="w-12 h-12" style={{ color: 'var(--accent-cyan)' }} />
                                </div>
                            </div>
                            <h1 className="display" style={{ color: 'var(--foreground)', marginBottom: '24px' }}>
                                Frequently Asked <span className="gradient-text">Questions</span>
                            </h1>
                            <p className="body-large" style={{ color: 'var(--foreground-secondary)', marginBottom: '32px' }}>
                                Find answers to common questions about BandhanNova
                            </p>

                            {/* Search Bar */}
                            <div className="flex justify-center w-full">
                                <div className="relative w-full max-w-2xl">
                                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--foreground-tertiary)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search for answers..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-xl glass border-0 focus:ring-2 focus:ring-purple-500 transition-all"
                                        style={{
                                            color: 'var(--foreground)',
                                            background: 'var(--background-secondary)',
                                            paddingLeft: '56px',
                                            paddingRight: '24px',
                                            paddingTop: '16px',
                                            paddingBottom: '16px'
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ Categories */}
                <section className="relative px-4 sm:px-6 lg:px-8" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
                    <div className="container mx-auto max-w-4xl">
                        {filteredFAQs.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center glass rounded-xl border"
                                style={{ padding: '48px', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <p className="body-large" style={{ color: 'var(--foreground-secondary)' }}>
                                    No results found for "{searchQuery}". Try different keywords.
                                </p>
                            </motion.div>
                        ) : (
                            filteredFAQs.map((category, categoryIndex) => (
                                <motion.div
                                    key={categoryIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                                    style={{ marginBottom: '48px' }}
                                >
                                    {/* Category Header */}
                                    <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
                                        <span className="text-3xl">{category.icon}</span>
                                        <h2 className="h2" style={{ color: 'var(--foreground)' }}>
                                            {category.category}
                                        </h2>
                                    </div>

                                    {/* Questions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {category.questions.map((faq, index) => {
                                            const globalIndex = categoryIndex * 100 + index;
                                            const isOpen = openIndex === globalIndex;

                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className="glass rounded-xl border overflow-hidden"
                                                    style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                                                >
                                                    <button
                                                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                                        className="w-full flex items-center justify-between text-left transition-all hover:bg-white/5"
                                                        style={{ padding: '20px 24px' }}
                                                    >
                                                        <span className="h3 pr-4" style={{ color: 'var(--foreground)' }}>
                                                            {faq.question}
                                                        </span>
                                                        <ChevronDown
                                                            className={`w-5 h-5 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                                                            style={{ color: 'var(--accent-cyan)' }}
                                                        />
                                                    </button>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '20px' }}
                                                        >
                                                            <p className="body" style={{
                                                                color: 'var(--foreground-secondary)',
                                                                paddingTop: '12px',
                                                                lineHeight: '1.7'
                                                            }}>
                                                                {faq.answer}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Still Have Questions */}
                <section className="relative px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
                    <div className="container mx-auto max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="glass rounded-xl border text-center"
                            style={{ padding: '40px 32px', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                Still Have Questions?
                            </h2>
                            <p className="body" style={{ color: 'var(--foreground-secondary)', marginBottom: '28px', fontSize: '16px' }}>
                                Can't find the answer you're looking for? Our support team is here to help!
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex flex-col items-center justify-center w-40 h-12 gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                                style={{
                                    background: 'var(--gradient-hero)',
                                    color: 'white',
                                    textDecoration: 'none'
                                }}
                            >
                                Contact Support
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </main>
    );
}

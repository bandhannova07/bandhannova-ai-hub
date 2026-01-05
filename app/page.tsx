'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Info } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();

  const scrollToPlatformOverview = () => {
    const element = document.getElementById('platform-overview');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToSignup = () => {
    router.push('/signup');
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient Mesh Background */}
      <div
        className="fixed inset-0 opacity-30"
        style={{ background: 'var(--gradient-mesh)' }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ zIndex: 10 }}>
        <div className="container mx-auto text-center">
          {/* Large Logo - FIRST (Boss feedback - MASSIVE 800x800!) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
            style={{ marginBottom: '50px', marginTop: '20px' }}
          >
            <div className="relative animate-float">
              <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: 'var(--gradient-hero)' }} />
              <Image
                src="/bandhannova-logo-final.svg"
                alt="BandhanNova Logo"
                width={700}
                height={700}
                className="relative z-10"
                priority
              />
            </div>
          </motion.div>

          {/* Badge - MORE SPACE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex justify-center"
            style={{ marginBottom: '20px' }}
          >
            <Badge variant="outline" className="px-4 py-2 h-8 w-80 glass flex items-center justify-center gap-2 text-sm font-medium rounded-2xl" style={{ color: 'var(--foreground-secondary)' }}>
              <Sparkles className="w-4 h-4 text-accent-cyan" style={{ color: 'var(--accent-cyan)' }} />
              India's Next Generation AI Ecosystem
            </Badge>
          </motion.div>

          {/* Main Headline - MORE SPACE */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="display"
            style={{ color: 'var(--foreground)', marginBottom: '20px' }}
          >
            Your Complete AI Solution for
            <br />
            <span className="gradient-text">Work, Study & Growing Future</span>
          </motion.h1>

          {/* Subheadline - PERFECTLY HORIZONTAL CENTER (Boss feedback) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex justify-center items-center w-full"
            style={{ marginBottom: '30px' }}
          >
            <p
              className="body-large max-w-5xl text-center px-8"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              All specialized AI assistants working together to help you succeed. Whether you're a student, professional, homemaker or entrepreneur—we've got you covered.
            </p>
          </motion.div>

          {/* CTA Buttons - WITH TOP SPACING */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            style={{ marginTop: '0px', marginBottom: '40px' }}
          >
            <Button
              onClick={goToSignup}
              size="lg"
              className="group relative px-14 py-5 rounded-2xl h-12 font-bold text-xl text-white overflow-hidden transition-all duration-300 hover:scale-105 min-w-[280px]"
              style={{ background: 'var(--gradient-hero)' }}
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Start Growing (Free)
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Button>

            <Button
              onClick={scrollToPlatformOverview}
              variant="outline"
              size="lg"
              className="group px-14 py-5 rounded-2xl h-12 font-bold text-xl glass transition-all duration-300 hover:scale-105 hover:glass-strong min-w-[280px] flex items-center justify-center"
            >
              <span className="flex items-center gap-2 justify-center">
                Explore Features
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <span className="text-sm" style={{ color: 'var(--foreground-tertiary)' }}>Scroll to explore</span>
              <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-2" style={{ borderColor: 'var(--foreground-tertiary)' }}>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--primary-purple)' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section id="platform-overview" className="relative py-24 px-4 sm:px-6 lg:px-8" style={{ zIndex: 10 }}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="h1 mb-4" style={{ color: 'var(--foreground)', marginTop: '80px' }}>
              Everything You Need <span className="gradient-text">in One Place</span>
            </h2>
            <div className="flex justify-center items-center w-full">
              <p className="body-large max-w-2xl text-center" style={{ color: 'var(--foreground-secondary)' }}>
                Not just another AI chatbot—this is your complete digital assistant for work, learning, and personal growth.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ marginTop: '40px' }}>
            {[
              {
                title: 'All AI Specialists Working Together',
                description: 'Multiple AI experts collaborate to give you accurate, helpful answers every time',
                icon: '🧠',
              },
              {
                title: 'Conversations That Feel Natural',
                description: 'No robotic responses with our latest model Ispat-v2-ultra/pro and barud2-fast/pro. Get helpful, context-aware answers that understand your needs',
                icon: '💡',
              },
              {
                title: 'Learns and Grows With You',
                description: 'The more you use it, the better it understands you. Like having a personal assistant who never forgets',
                icon: '🚀',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass p-8 rounded-2xl h-auto min-h-[160px] place-items-center text-center flex flex-col justify-center transition-all duration-300 hover:glass-strong"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="h3 mb-3" style={{ color: 'var(--foreground)' }}>{item.title}</h3>
                <p className="body text-sm md:text-base" style={{ color: 'var(--foreground-secondary)', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center" style={{ zIndex: 10 }}>
        <div className="container mx-auto flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="h1 mb-4" style={{ color: 'var(--foreground)', marginTop: '80px' }}>
              Many specialized AI agents <span className="gradient-text">in one powerful platform</span>
            </h2>
            <div className="flex justify-center items-center w-full" style={{ marginBottom: '40px' }}>
              <p className="body-large max-w-2xl text-center" style={{ color: 'var(--foreground-secondary)' }}>
                Each AI is trained for specific tasks. Together, they can help you with almost anything.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Creator & Social Growth AI',
                description: 'YouTube, Instagram, branding, content strategy, and audience psychology guidance',
                icon: '🎬',
                gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C683D7 100%)',
              },
              {
                title: 'Creative & Productivity AI',
                description: 'Smart idea generation for emails, projects, presentations, and problem-solving',
                icon: '💡',
                gradient: 'linear-gradient(135deg, #C683D7 0%, #223CCF 100%)',
              },
              {
                title: 'Psychology & Personality AI',
                description: 'Confidence, communication, mindset tools—perfect for introverts and self-growth',
                icon: '🧠',
                gradient: 'linear-gradient(135deg, #223CCF 0%, #00D9FF 100%)',
              },
              {
                title: 'Study Planner & Learning AI',
                description: 'Concept clarity, daily study plans, notes, motivation, and exam preparation',
                icon: '📚',
                gradient: 'linear-gradient(135deg, #00D9FF 0%, #FF6B9D 100%)',
              },
              {
                title: 'Business & Career Builder AI',
                description: 'Startup guidance, business planning, career clarity, and skill-based income ideas',
                icon: '💼',
                gradient: 'linear-gradient(135deg, #FF6B9D 0%, #223CCF 100%)',
              },
              {
                title: 'Conversational Platform AI',
                description: 'Context-aware AI that understands the platform and remembers your preferences',
                icon: '💬',
                gradient: 'linear-gradient(135deg, #C683D7 0%, #00D9FF 100%)',
              },
              {
                title: 'Full Website Builder AI',
                description: 'Create complete, professional websites from a single prompt—no coding needed',
                icon: '🌐',
                gradient: 'linear-gradient(135deg, #223CCF 0%, #FF6B9D 100%)',
              },
              {
                title: 'Image Maker AI',
                description: 'Create stunning images, graphics, and visual content from text descriptions. Perfect for social media, presentations, and creative projects',
                icon: '🎨',
                gradient: 'linear-gradient(135deg, #FF6B9D 0%, #00D9FF 100%)',
              },
              {
                title: 'Kitchen & Recipe AI',
                description: 'Get delicious recipes, cooking tips, meal planning, and kitchen hacks. Perfect for homemakers and food enthusiasts',
                icon: '👩‍🍳',
                gradient: 'linear-gradient(135deg, #00D9FF 0%, #C683D7 100%)',
              },
              {
                title: 'Search Engine AI',
                description: 'Get instant answers from the web with AI-powered search. Find information, research topics, and discover content faster than ever',
                icon: '🔍',
                gradient: 'linear-gradient(135deg, #C683D7 0%, #223CCF 100%)',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group relative glass p-6 rounded-2xl h-40 place-items-center text-center flex flex-col justify-center transition-all duration-300 hover:glass-strong overflow-hidden"
                style={{}}
              >
                {/* Gradient border on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: item.gradient,
                    padding: '3px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="text-4xl mb-4 inline-block p-3 h-14 w-14 rounded-2xl"
                    style={{ background: item.gradient, marginBottom: '10px', marginTop: '10px' }}
                  >
                    <div className="flex flex-col h-full w-full justify-center items-center">{item.icon}</div>
                  </div>
                  <h3 className="h3 mb-3 text-lg" style={{ color: 'var(--foreground)' }}>{item.title}</h3>
                  <p className="body small" style={{ color: 'var(--foreground-secondary)' }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Language Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8" style={{ zIndex: 10, marginTop: '80px' }}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="h1 mb-4" style={{ color: 'var(--foreground)' }}>
              Speak Your Language, <br /><span className="gradient-text">Grow Your Way</span>
            </h2>
            <div className="flex justify-center items-center w-full" style={{ marginBottom: '40px' }}>
              <p className="body-large max-w-2xl text-center" style={{ color: 'var(--foreground-secondary)' }}>
                High-quality AI guidance accessible across India
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {['English', 'हिंदी', 'বাংলা', 'मराठी', 'தமிழ்', 'ગુજરાતી', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം', 'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'اردو'].map((lang, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="glass px-4 md:px-8 py-2 md:py-4 rounded-2xl min-w-[80px] md:min-w-[120px] flex items-center justify-center font-medium text-sm md:text-lg"
                style={{ color: 'var(--foreground)' }}
              >
                {lang}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8" style={{ zIndex: 10, marginTop: '90px' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="h1 mb-8" style={{ color: 'var(--foreground)', marginBottom: '30px', fontSize: '2rem' }}>
              Our <span className="gradient-text">Vision</span>
            </h2>

            <div className="glass p-12 rounded-3xl mb-12">
              <blockquote className="text-lg md:text-2xl font-medium mb-6 italic" style={{ color: 'var(--foreground)', paddingBlock: '20px', marginLeft: '8px', marginRight: '10px' }}>
                "BandhanNova is not just an AI app—it is a life-operating system."
              </blockquote>
              <p className="body text-sm md:text-base mb-8" style={{ color: 'var(--foreground-secondary)', paddingBlock: '20px', marginLeft: '5px', marginRight: '5px' }}>
                Our long-term vision is to help millions of users learn faster, think clearer,
                grow smarter, and build skills, confidence, and careers—all through one intelligent,
                responsive, and emotionally aware AI platform.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2" style={{ marginTop: '70px', marginBottom: '30px' }}>
              {[
                { number: '2,40,000+', label: 'Active Users' },
                { number: '7,24,0,000+', label: 'Conversations' },
                { number: '97%', label: 'User Satisfaction (last month)' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-6xl font-bold gradient-text">{stat.number}</div>
                  <div className="body text-sm md:text-base" style={{ color: 'var(--foreground-secondary)', marginBottom: '18px' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8" style={{ zIndex: 10 }}>
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="display mb-6" style={{ color: 'var(--foreground)', marginBottom: '15px' }}>
              Ready to <span className="gradient-text">Grow?</span>
            </h2>
            <p className="body-large mb-12" style={{ color: 'var(--foreground-secondary)', marginBottom: '15px' }}>
              Join thousands growing smarter every day with India's first AI life-growing platform
            </p>

            <div className="flex flex-col items-center justify-center" style={{ marginBottom: '3rem' }}>
              <Button
                onClick={goToSignup}
                size="lg"
                className="w-auto group relative px-10 py-5 h-12 rounded-2xl font-bold text-xl text-white overflow-hidden transition-all duration-300 hover:scale-105"
                style={{ background: 'var(--gradient-hero)' }}
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Start Your Journey (Free)
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t py-12 px-4 sm:px-6 lg:px-8" style={{ zIndex: 10, borderColor: 'var(--background-tertiary)' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Tagline */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold" style={{ color: 'var(--foreground)', marginBottom: '10px', marginTop: '24px' }}>
                  <Image
                    src="/bandhannova-logo-final.svg"
                    alt="BandhanNova Logo"
                    width={250}
                    height={250}
                  />
                </span>
              </div>
              <p className="body mb-4" style={{ color: 'var(--foreground-secondary)' }}>
                Where AI Doesn't Just Answer—It Inspires Action.
              </p>
              <p className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                India's first AI life-growing platform for all Indians
              </p>
            </div>

            {/* Quick Links */}
            <div style={{ marginBottom: '30px' }}>
              <h3 className="font-bold mb-6" style={{ color: 'var(--foreground)', marginTop: '5px' }}>Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="small hover:underline" style={{ color: 'var(--foreground-secondary)' }}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="small hover:underline" style={{ color: 'var(--foreground-secondary)' }}>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="small hover:underline" style={{ color: 'var(--foreground-secondary)' }}>
                    Privacy & Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="small hover:underline" style={{ color: 'var(--foreground-secondary)' }}>
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--background-tertiary)' }}>
            <p className="small" style={{ color: 'var(--foreground-tertiary)', marginTop: '30px', marginBottom: '30px' }}>
              © 2026 BandhanNova Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}


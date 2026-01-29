export type Profession = 'student' | 'developer' | 'designer' | 'creative' | 'business' | 'other';
export type AgentId = 'conversational' | 'study-learning' | 'search-engine' | 'decision-maker' | 'creator-social' | 'future-jobs-career';

export const SUGGESTIONS: Record<AgentId, Record<Profession, string[]>> = {
    'conversational': {
        'student': [
            "How can I better manage my study schedule?",
            "What are some effective note-taking techniques?",
            "Can you help me brainstorm ideas for my essay?",
            "Explain quantum physics in simple terms.",
            "Tell me a joke to destress from exams."
        ],
        'developer': [
            "How can I improve my coding productivity?",
            "Explain the difference between SQL and NoSQL.",
            "Give me a quick breakdown of latest AI trends.",
            "How do I deal with burnout in tech?",
            "Suggest some fun side project ideas."
        ],
        'designer': [
            "What are some upcoming design trends for 2026?",
            "How can I improve my client communication?",
            "Suggest some tools for better color palettes.",
            "How to stay creative when feeling stuck?",
            "What's the best way to present a portfolio?"
        ],
        'creative': [
            "How do I find my unique creative voice?",
            "Suggest some content ideas for a weekly vlog.",
            "How to balance creativity with business?",
            "What are the best platforms for creators today?",
            "Give me tips for better storytelling."
        ],
        'business': [
            "How can I scale my small business using AI?",
            "What are some key leadership qualities?",
            "Explain modern digital marketing strategies.",
            "How to improve customer retention?",
            "Suggest some networking tips for founders."
        ],
        'other': [
            "How can I start my day more productively?",
            "Suggest some healthy habits for a busy life.",
            "What are some interesting facts about space?",
            "How to stay motivated for long-term goals?",
            "Give me a daily mindfulness exercise."
        ]
    },
    'study-learning': {
        'student': [
            "Create a 4-week study plan for final exams.",
            "Explain the concept of photosynthesis in detail.",
            "Give me some memory hacks for history dates.",
            "Can you quiz me on basic calculus?",
            "How to write a high-scoring research paper?"
        ],
        'developer': [
            "What's the best path to learn System Design?",
            "Explain how the React Fiber architecture works.",
            "Suggest some advanced books for software architecture.",
            "How to prepare for a Senior Developer interview?",
            "Break down the basics of Web3 for me."
        ],
        'designer': [
            "Explain the principles of Gestalt in design.",
            "How to learn 3D modeling from scratch?",
            "What are the best courses for UI/UX advanced level?",
            "Explain the history of Minimalism in design.",
            "How can I use AI to speed up my design workflow?"
        ],
        'creative': [
            "How to master the art of video editing?",
            "Suggest a learning path for digital illustration.",
            "What are the key elements of a viral screenplay?",
            "Explain the psychology behind color in branding.",
            "How to build a personal brand as a creator?"
        ],
        'business': [
            "Explain the basics of financial accounting.",
            "What are the best resources to learn negotiation?",
            "How to understand market research data?",
            "Explain the concept of 'Blue Ocean Strategy'.",
            "What are some must-read books for entrepreneurs?"
        ],
        'other': [
            "Suggest a path to learn a new language quickly.",
            "How to start learning about personal finance?",
            "What are the basics of critical thinking?",
            "How to build a consistent reading habit?",
            "Explain the concept of 'Growth Mindset'."
        ]
    },
    'search-engine': {
        'student': [
            "Find the most cited papers on climate change 2025.",
            "Search for the best student scholarships in Europe.",
            "What are the top-rated universities for AI research?",
            "Find free online courses for data science with certificates.",
            "Search for current trends in educational technology."
        ],
        'developer': [
            "Search for the latest benchmarks of popular LLMs.",
            "Find open-source alternatives to popular SaaS tools.",
            "What are the most used JavaScript frameworks in 2026?",
            "Find recent security vulnerabilities in NPM packages.",
            "Search for documentation on the latest Next.js features."
        ],
        'designer': [
            "Search for the best UI design inspiration sites.",
            "Find case studies on successful rebranding projects.",
            "What are the top design systems used by big tech?",
            "Find high-quality royalty-free asset libraries.",
            "Search for the latest updates in Figma and Adobe tools."
        ],
        'creative': [
            "Find the most trending hashtags for Instagram today.",
            "Search for success stories of independent creators.",
            "What are the latest tools for AI video generation?",
            "Find communities for digital artists to collaborate.",
            "Search for recent changes in YouTube's algorithm."
        ],
        'business': [
            "Search for market trends in the fintech industry.",
            "Find competitors for a new e-commerce startup.",
            "What are the best locations for a new tech hub?",
            "Search for recent venture capital deals in India.",
            "Find laws and regulations for AI-based businesses."
        ],
        'other': [
            "Search for the best travel destinations this year.",
            "Find recent news on health and wellness breakthroughs.",
            "What are the most popular hobbies people are starting?",
            "Find reviews for the latest smart home gadgets.",
            "Search for community events happening in my area."
        ]
    },
    'decision-maker': {
        'student': [
            "Should I choose a Master's degree or a job?",
            "Help me pick between two elective subjects.",
            "Should I study abroad or in my home country?",
            "Is getting a student loan a good idea for me?",
            "Which internship offer should I accept?"
        ],
        'developer': [
            "Should we use microservices or a monolith?",
            "Is it worth switching our stack to Rust?",
            "Should I join a startup or a big tech company?",
            "Is contributing to open-source worth my time?",
            "Should I focus on management or tech leadership?"
        ],
        'designer': [
            "Should I go freelance or work for an agency?",
            "Is Figma enough, or should I learn Framer too?",
            "Should I specialize in niche UI or stay generalist?",
            "Is it time to update my portfolio from scratch?",
            "Should I invest in a better workstation now?"
        ],
        'creative': [
            "Should I focus on YouTube or TikTok right now?",
            "Is it time to start a paid newsletter?",
            "Should I collaborate with this brand? (Give details)",
            "Should I hire an assistant for video editing?",
            "Is it worth starting a podcast in 2026?"
        ],
        'business': [
            "Should I pivot my business model based on current data?",
            "Is it the right time to seek outside investment?",
            "Should I outsource our marketing or build an in-house team?",
            "Should we expand to a new geographic market?",
            "Is this merger a good strategic move?"
        ],
        'other': [
            "Should I buy a house now or keep renting?",
            "Is it worth switching to a hybrid car today?",
            "Should I quit my job to follow my passion?",
            "How to decide between two very different job offers?",
            "Should I move to a new city for better opportunities?"
        ]
    },
    'creator-social': {
        'student': [
            "How can I share my learning journey on social media?",
            "Suggest some reels ideas for documenting college life.",
            "How to build a personal brand as a student expert?",
            "What's the best way to network with mentors on LinkedIn?",
            "Give me content ideas for a student productivity channel."
        ],
        'developer': [
            "How to build a tech following on Twitter/X?",
            "Suggest content ideas for a coding tutorial series.",
            "How to share my open-source work to get more stars?",
            "What type of content works best for dev conferences?",
            "Give me hooks for a technical blog post on LinkedIn."
        ],
        'designer': [
            "How to showcase my design process on Instagram?",
            "Suggest some ideas for 'Before vs After' design reels.",
            "How to build a community around design feedback?",
            "What are the best ways to get design clients from social?",
            "Give me content ideas for a Pinterest design board."
        ],
        'creative': [
            "How to create a viral hook for short-form video?",
            "Suggest a 30-day content calendar for a new creator.",
            "How to monetize a small but engaged audience?",
            "What's the secret to consistent growth on YouTube?",
            "Give me tips for staying authentic while growing."
        ],
        'business': [
            "How can I use social media to drive B2B sales?",
            "Suggest content ideas for a founder-led brand.",
            "How to manage social media for a small local business?",
            "What's the best way to handle negative comments?",
            "Give me ideas for a product launch campaign."
        ],
        'other': [
            "How to start a hobby-based blog or page?",
            "Suggest simple content ideas for sharing my daily life.",
            "How to use social media for social causes I care about?",
            "What are the best apps for editing photos on the go?",
            "Give me tips for better smartphone photography."
        ]
    },
    'future-jobs-career': {
        'student': [
            "What will be the most in-demand jobs in 2030?",
            "How to build a resume that beats AI filters?",
            "Which skills should I learn alongside my degree?",
            "How to find high-paying remote internships?",
            "What are the career prospects in sustainable energy?"
        ],
        'developer': [
            "How will AI change the software engineering career path?",
            "What are the best roles for a developer wanting to move into AI?",
            "How to prepare for the 'Future of Work' as a coder?",
            "Should I focus on prompt engineering as a core skill?",
            "What are the highest paying niche tech jobs today?"
        ],
        'designer': [
            "What's the future of UI design in an AR/VR world?",
            "How to transition from traditional graphic design to Product Design?",
            "Will AI replace UI designers? How to stay relevant.",
            "What are the top soft skills for design leaders?",
            "How to build a global career as a remote designer?"
        ],
        'creative': [
            "How to turn content creation into a full-time career?",
            "What are the emerging roles in the creator economy?",
            "How to protect my creative work from unauthorized AI use?",
            "What's the career path for a creative strategist?",
            "How to build multiple income streams as a creator?"
        ],
        'business': [
            "What are the best industries for new startups in 2026?",
            "How to transition from an employee to a business owner?",
            "What are the key leadership skills for the future?",
            "How to build a global team for a remote-first company?",
            "What are the career benefits of an MBA vs practical experience?"
        ],
        'other': [
            "How to change careers after age 40 successfully?",
            "What are some high-paying jobs that don't require a degree?",
            "How to negotiate a salary in the current job market?",
            "What are the best ways to network effectively in 2026?",
            "How to build a 'portfolio career' with multiple interests?"
        ]
    }
};

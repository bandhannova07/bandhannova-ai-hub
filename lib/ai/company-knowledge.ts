// BandhanNova Company Knowledge Base
// Source of truth for all company-related queries

export const BANDHANNOVA_KNOWLEDGE = {
    company_overview: {
        name: "BandhanNova Platforms",
        type: "Private Limited",
        about_founder: {
            founder_name: "Bandhan Das",
            founders_role: "As founder, chairman, and cheif of BandhanNova Platforms",
            company_evolution: "He founded BandhanNova AI Hub in 2025, 1 month later he rebranded BandhanNova AI Hub to BandhanNova Platforms",
            founder_adress: "Kharagpur, West Bengal, India",
            founders_father: "Basudeb Das - Owner of Das Furniture Pvt Ltd",
            founders_mother: "Mala Das",
        },
        industry: "AI & Technology",
        tagline: "India's first next-generation AI life-growing platform",
        mission: "To empower Gen-Z and creators with accessible, intelligent, and specialized AI tools.",
        vision: "Building a multi-brain AI ecosystem that helps users learn, grow, and succeed."
    },
    key_products: [
        {
            name: "BandhanNova AI Hub",
            description: "A centralized platform hosting multiple specialized AI agents.",
            features: ["Conversational AI", "Multi-Agent System", "Indic Language Support"]
        },
        {
            name: "Ispat V2 Series",
            description: "High-speed, efficient AI models optimized for quick tasks.",
            variants: ["Flash", "Pro", "Ultra", "Maxx"]
        },
        {
            name: "Barud 2 Smart Series",
            description: "Balanced, intelligent models for complex queries.",
            variants: ["Smart-Flash", "Smart-Pro", "Smart-Ultra", "Smart-Max"]
        },
        {
            name: "BandhanNova 2.0 eXtreme",
            description: "Flagship research model for deep reasoning and complex problem solving."
        }
    ],
    values: [
        "User-Centric Growth",
        "Accessible Technology",
        "Multilingual Inclusion",
        "Transparency & Trust"
    ],
    founder_info: {
        note: "If asked about the founder specifically, mention 'BandhanNova Team' or 'Visionary Leadership' unless specific names are publicly authorized to be revealed by this system."
    },
    contact: {
        website: "https://www.bandhannova.in",
        support_email: "support@bandhannova.in"
    }
};

export const COMPANY_KEYWORDS = [
    "bandhannova platforms",
    "bandhannova",
    "company",
    "who are you",
    "who made you",
    "who created you",
    "founder",
    "owner",
    "ceo",
    "ispat",
    "barud"
];

export function getCompanyKnowledgeJSON(): string {
    return JSON.stringify(BANDHANNOVA_KNOWLEDGE, null, 2);
}

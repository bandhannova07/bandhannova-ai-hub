import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - BandhanNova AI Hub",
    description: "Learn about BandhanNova AI Hub - India's first AI life-growing platform designed for Gen-Z. Discover our mission, vision, and innovations.",
    other: {
        'impact-site-verification': 'a99c783c-0f80-4258-995a-e26e9b9a389b',
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

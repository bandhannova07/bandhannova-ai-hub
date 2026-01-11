'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            onClick={toggleTheme}
            variant="ghost"
            className="flex items-center gap-3 rounded-xl transition-all hover:scale-105 justify-start text-white"
            style={{
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                width: '100%'
            }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <>
                    <Sun className="w-5 h-5" />
                    <span className="body font-medium">Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="w-5 h-5" />
                    <span className="body font-medium">Dark Mode</span>
                </>
            )}
        </Button>
    );
}

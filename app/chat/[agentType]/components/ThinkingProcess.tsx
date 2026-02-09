'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Brain } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ThinkingProcessProps {
    content: string;
    isComplete: boolean;
}

export function ThinkingProcess({ content, isComplete }: ThinkingProcessProps) {
    const [isExpanded, setIsExpanded] = useState(true); // Start expanded

    // Auto-collapse when thinking is complete
    useEffect(() => {
        if (isComplete) {
            // Small delay before collapsing for smooth UX
            const timer = setTimeout(() => {
                setIsExpanded(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    if (!content || content.trim() === '') {
        return null;
    }

    return (
        <div className="thinking-section mb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="thinking-toggle w-full flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all hover:bg-purple-500/20"
                style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderBottom: isExpanded ? 'none' : '1px solid rgba(139, 92, 246, 0.3)'
                }}
            >
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                )}
                <Brain className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                <span
                    className="body font-semibold"
                    style={{ color: 'var(--foreground)' }}
                >
                    {isExpanded ? 'AI Thinking Process' : 'View AI Thinking Process'}
                </span>
                {!isComplete && (
                    <span
                        className="ml-auto small animate-pulse"
                        style={{ color: '#8b5cf6' }}
                    >
                        Thinking...
                    </span>
                )}
            </button>

            {isExpanded && (
                <div
                    className="thinking-content p-4 rounded-b-xl animate-slideDown"
                    style={{
                        background: 'rgba(139, 92, 246, 0.05)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderTop: 'none'
                    }}
                >
                    <MarkdownRenderer content={content} />
                </div>
            )}
        </div>
    );
}

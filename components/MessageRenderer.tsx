import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Check, Copy } from 'lucide-react';

interface MessageRendererProps {
    content: string;
    role: 'user' | 'assistant';
    isTyping?: boolean;
}

export function MessageRenderer({ content, role, isTyping = false }: MessageRendererProps) {
    const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (role === 'user') {
        return <div className="whitespace-pre-wrap">{content}</div>;
    }

    // Simple, clean rendering for AI messages
    return (
        <div className="ai-message-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                    // Clean headings
                    h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-3 mt-4 text-white">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-xl font-bold mb-2 mt-3 text-white">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-lg font-semibold mb-2 mt-3 text-white">
                            {children}
                        </h3>
                    ),

                    // Simple paragraphs
                    p: ({ children }) => (
                        <p className="mb-3 leading-relaxed text-gray-200">
                            {children}
                        </p>
                    ),

                    // Bold text
                    strong: ({ children }) => (
                        <strong className="font-bold text-white">
                            {children}
                        </strong>
                    ),

                    // Italic text
                    em: ({ children }) => (
                        <em className="italic text-gray-300">
                            {children}
                        </em>
                    ),

                    // Clean lists
                    ul: ({ children }) => (
                        <ul className="mb-3 space-y-1 ml-6 list-disc">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-3 space-y-1 ml-6 list-decimal">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-gray-200 leading-relaxed">
                            {children}
                        </li>
                    ),

                    // Code blocks with copy button
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');

                        if (!inline && match) {
                            return (
                                <div className="relative group my-3">
                                    <div className="absolute top-2 right-2 z-10">
                                        <button
                                            onClick={() => copyCode(codeString)}
                                            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5"
                                        >
                                            {copiedCode === codeString ? (
                                                <>
                                                    <Check className="w-3 h-3 text-green-400" />
                                                    <span className="text-xs text-green-400">Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3 text-gray-300" />
                                                    <span className="text-xs text-gray-300">Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm border border-white/10">
                                        <span className="text-xs text-gray-300 font-mono">{match[1]}</span>
                                    </div>
                                    <pre className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 pt-10 overflow-x-auto">
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    </pre>
                                </div>
                            );
                        }

                        // Inline code
                        return (
                            <code className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-gray-200 font-mono text-sm" {...props}>
                                {children}
                            </code>
                        );
                    },

                    // Simple blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-white/30 pl-3 py-1 my-3 bg-white/5 rounded-r">
                            <div className="text-gray-300 italic">
                                {children}
                            </div>
                        </blockquote>
                    ),

                    // Clean tables
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-3">
                            <table className="min-w-full border-collapse">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-white/5">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="divide-y divide-white/10">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => (
                        <tr className="hover:bg-white/5 transition-colors">
                            {children}
                        </tr>
                    ),
                    th: ({ children }) => (
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white border border-white/10">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-3 py-2 text-sm text-gray-200 border border-white/10">
                            {children}
                        </td>
                    ),

                    // Simple links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                        >
                            {children}
                        </a>
                    ),

                    // Simple horizontal rule
                    hr: () => (
                        <hr className="my-4 border-0 h-px bg-white/20" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
            {isTyping && (
                <span className="inline-block w-0.5 h-4 ml-1 bg-white animate-pulse"
                    style={{ animation: 'blink 1s infinite' }} />
            )}
        </div>
    );
}

// Advanced Markdown Component - Better than ChatGPT
// Supports code highlighting, tables, lists, and more

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                // Preserve line breaks and spacing
                skipHtml={false}
                components={{
                    // Preserve line breaks
                    p({ children }) {
                        return <p className="markdown-paragraph">{children}</p>;
                    },
                    // Code blocks with copy button
                    code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        const inline = !match && !className;

                        return !inline ? (
                            <div className="code-block-wrapper">
                                <div className="code-block-header">
                                    <span className="code-language">{match ? match[1] : 'code'}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(codeString)}
                                        className="copy-button"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <pre className={className}>
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code className="inline-code" {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Enhanced tables
                    table({ children }) {
                        return (
                            <div className="table-wrapper">
                                <table>{children}</table>
                            </div>
                        );
                    },
                    // Better unordered lists
                    ul({ children }) {
                        return <ul className="custom-list">{children}</ul>;
                    },
                    // Better ordered lists with proper numbering
                    ol({ children, start }: any) {
                        return <ol className="custom-ordered-list" start={start}>{children}</ol>;
                    },
                    // List items with proper spacing
                    li({ children }) {
                        return <li className="custom-list-item">{children}</li>;
                    },
                    // Enhanced blockquotes
                    blockquote({ children }) {
                        return <blockquote className="custom-blockquote">{children}</blockquote>;
                    },
                    // Better headings
                    h1({ children }) {
                        return <h1 className="markdown-h1">{children}</h1>;
                    },
                    h2({ children }) {
                        return <h2 className="markdown-h2">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="markdown-h3">{children}</h3>;
                    },
                    // Links with icons
                    a({ href, children }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="markdown-link"
                            >
                                {children}
                                <span className="link-icon">↗</span>
                            </a>
                        );
                    },
                    // Line breaks
                    br() {
                        return <br className="markdown-br" />;
                    },
                }}
            >
                {content}
            </ReactMarkdown>

            <style jsx>{`
                .markdown-content {
                    font-size: 16px;
                    line-height: 1.7;
                    color: var(--foreground);
                }

                /* Desktop: Larger text */
                @media (min-width: 1024px) {
                    .markdown-content {
                        font-size: 18px;
                        line-height: 1.8;
                    }
                }

                /* Headings */
                .markdown-h1 {
                    font-size: 2em;
                    font-weight: 700;
                    margin: 1.5em 0 0.5em;
                    color: var(--foreground);
                    border-bottom: 2px solid var(--background-tertiary);
                    padding-bottom: 0.3em;
                }

                .markdown-h2 {
                    font-size: 1.5em;
                    font-weight: 600;
                    margin: 1.3em 0 0.5em;
                    color: var(--foreground);
                }

                .markdown-h3 {
                    font-size: 1.25em;
                    font-weight: 600;
                    margin: 1em 0 0.5em;
                    color: var(--foreground-secondary);
                }

                /* Code blocks */
                .code-block-wrapper {
                    margin: 1.5em 0;
                    border-radius: 12px;
                    overflow: hidden;
                    background: var(--background-secondary);
                    border: 1px solid var(--background-tertiary);
                }

                .code-block-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75em 1em;
                    background: rgba(255, 255, 255, 0.03);
                    border-bottom: 1px solid var(--background-tertiary);
                }

                .code-language {
                    font-size: 0.85em;
                    font-weight: 600;
                    color: var(--foreground-secondary);
                    text-transform: uppercase;
                }

                .copy-button {
                    padding: 0.4em 0.8em;
                    font-size: 0.85em;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 6px;
                    color: var(--foreground);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .copy-button:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                pre {
                    margin: 0;
                    padding: 1.5em;
                    overflow-x: auto;
                    font-size: 0.9em;
                    line-height: 1.6;
                }

                .inline-code {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.2em 0.4em;
                    border-radius: 4px;
                    font-size: 0.9em;
                    font-family: 'Fira Code', 'Courier New', monospace;
                    color: #ff6b9d;
                }

                /* Tables */
                .table-wrapper {
                    overflow-x: auto;
                    margin: 1.5em 0;
                    border-radius: 8px;
                    border: 1px solid var(--background-tertiary);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.95em;
                }

                table th {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.75em 1em;
                    text-align: left;
                    font-weight: 600;
                    border-bottom: 2px solid var(--background-tertiary);
                }

                table td {
                    padding: 0.75em 1em;
                    border-bottom: 1px solid var(--background-tertiary);
                }

                table tr:last-child td {
                    border-bottom: none;
                }

                table tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }

                /* Lists */
                .custom-list,
                .custom-ordered-list {
                    margin: 1em 0;
                    padding-left: 2em;
                    list-style-position: outside;
                }

                .custom-list {
                    list-style-type: disc;
                }

                .custom-ordered-list {
                    list-style-type: decimal;
                    counter-reset: item;
                }

                .custom-list-item {
                    margin: 0.75em 0;
                    line-height: 1.7;
                    padding-left: 0.5em;
                }

                .custom-list li::marker {
                    color: var(--foreground-secondary);
                    font-weight: 600;
                }

                .custom-ordered-list li::marker {
                    color: var(--foreground);
                    font-weight: 700;
                }

                /* Blockquotes */
                .custom-blockquote {
                    margin: 1.5em 0;
                    padding: 1em 1.5em;
                    border-left: 4px solid var(--foreground-secondary);
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 0 8px 8px 0;
                    font-style: italic;
                    color: var(--foreground-secondary);
                }

                /* Links */
                .markdown-link {
                    color: #00d9ff;
                    text-decoration: none;
                    border-bottom: 1px solid transparent;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.2em;
                }

                .markdown-link:hover {
                    border-bottom-color: #00d9ff;
                }

                .link-icon {
                    font-size: 0.8em;
                    opacity: 0.7;
                }

                /* Paragraphs */
                .markdown-paragraph {
                    margin: 0.8em 0;
                    line-height: 1.7;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }

                .markdown-paragraph:first-child {
                    margin-top: 0;
                }

                .markdown-paragraph:last-child {
                    margin-bottom: 0;
                }

                /* Line breaks */
                .markdown-br {
                    display: block;
                    margin: 0.5em 0;
                    content: "";
                }

                /* Horizontal rules */
                .markdown-content hr {
                    margin: 2em 0;
                    border: none;
                    border-top: 1px solid var(--background-tertiary);
                }
            `}</style>
        </div>
    );
}

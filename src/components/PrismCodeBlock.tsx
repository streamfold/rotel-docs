import React, { useEffect, useRef } from 'react';

// This component assumes Prism.js is available globally (as it is in Docusaurus)
// If using outside Docusaurus, you'll need to import Prism.js
declare global {
    interface Window {
        Prism?: {
            highlight: (code: string, grammar: any, language: string) => string;
            languages: Record<string, any>;
        };
    }
}

export interface PrismCodeBlockProps {
    children: string;
    language?: 'javascript' | 'python' | 'bash' | 'json' | 'css' | 'html' | 'typescript' | 'sql' | 'jsx' | 'tsx';
    title?: string;
    showLineNumbers?: boolean;
    className?: string;
    theme?: 'dark' | 'light';
}

const PrismCodeBlock: React.FC<PrismCodeBlockProps> = ({
                                                           children,
                                                           language = 'javascript',
                                                           title,
                                                           showLineNumbers = false,
                                                           className = '',
                                                           theme = 'dark'
                                                       }) => {
    const codeRef = useRef<HTMLElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const lines = children.split('\n');

    const getLanguageColor = (lang: string): string => {
        const colorMap: Record<string, string> = {
            javascript: 'border-l-yellow-400',
            jsx: 'border-l-yellow-400',
            typescript: 'border-l-indigo-400',
            tsx: 'border-l-indigo-400',
            python: 'border-l-blue-400',
            bash: 'border-l-gray-400',
            json: 'border-l-green-400',
            css: 'border-l-purple-400',
            html: 'border-l-red-400',
            sql: 'border-l-orange-400'
        };
        return colorMap[lang] || colorMap.javascript;
    };

    const getThemeClasses = () => {
        if (theme === 'light') {
            return {
                container: 'bg-gray-50 text-gray-800',
                header: 'bg-gray-100 text-gray-700 border-gray-200',
                pre: 'text-gray-800',
                lineNumbers: 'text-gray-400'
            };
        }
        return {
            container: 'bg-gray-900 text-gray-100',
            header: 'bg-gray-800 text-gray-300 border-gray-700',
            pre: 'text-gray-100',
            lineNumbers: 'text-gray-500'
        };
    };

    const themeClasses = getThemeClasses();

    useEffect(() => {
        if (window.Prism && codeRef.current) {
            // Map language aliases
            const languageMap: Record<string, string> = {
                'javascript': 'js',
                'typescript': 'ts',
                'python': 'py',
                'bash': 'bash',
                'json': 'json',
                'css': 'css',
                'html': 'html',
                'sql': 'sql',
                'jsx': 'jsx',
                'tsx': 'tsx'
            };

            const prismLanguage = languageMap[language] || language;
            const grammar = window.Prism.languages[prismLanguage];

            if (grammar) {
                if (showLineNumbers) {
                    // Handle line-by-line highlighting for line numbers
                    const highlightedLines = lines.map(line => {
                        return window.Prism!.highlight(line, grammar, prismLanguage);
                    });

                    // Update each line span with highlighted content
                    const lineSpans = codeRef.current.querySelectorAll('.line-content');
                    lineSpans.forEach((span, index) => {
                        if (highlightedLines[index] !== undefined) {
                            span.innerHTML = highlightedLines[index];
                        }
                    });
                } else {
                    // Highlight the entire code block
                    const highlighted = window.Prism.highlight(children, grammar, prismLanguage);
                    codeRef.current.innerHTML = highlighted;
                }
            }
        }
    }, [children, language, showLineNumbers, lines]);

    return (
        <div className={`${themeClasses.container} rounded-lg overflow-hidden border-l-4 ${getLanguageColor(language)} shadow-lg ${className}`}>
            {title && (
                <div className={`${themeClasses.header} px-4 py-2 text-sm font-medium border-b`}>
                    <span className="text-gray-400 text-xs uppercase tracking-wide mr-2">{language}</span>
                    {title}
                </div>
            )}
            <div className="p-4">
        <pre ref={preRef} className={`${themeClasses.pre} text-sm overflow-x-auto text--left`}>
          <code ref={codeRef} className={`language-${language}`}>
            {showLineNumbers ? (
                lines.map((line, index) => (
                    <div key={index} className="flex">
                  <span className={`${themeClasses.lineNumbers} text-xs mr-4 select-none w-8 text-right`}>
                    {index + 1}
                  </span>
                        <span className="line-content">{line}</span>
                    </div>
                ))
            ) : (
                children
            )}
          </code>
        </pre>
            </div>
        </div>
    );
};

export default PrismCodeBlock;

import React from 'react';

export interface CodeBlockProps {
    children: string;
    language?: 'javascript' | 'python' | 'bash' | 'json' | 'css' | 'html' | 'typescript' | 'sql';
    title?: string;
    showLineNumbers?: boolean;
    className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
                                                 children,
                                                 language = 'javascript',
                                                 title,
                                                 showLineNumbers = false,
                                                 className = ''
                                             }) => {
    const lines = children.split('\n');

    const getLanguageColor = (lang: string): string => {
        const colorMap: Record<string, string> = {
            javascript: 'border-l-yellow-400',
            python: 'border-l-blue-400',
            bash: 'border-l-gray-400',
            json: 'border-l-green-400',
            css: 'border-l-purple-400',
            html: 'border-l-red-400',
            typescript: 'border-l-indigo-400',
            sql: 'border-l-orange-400'
        };
        return colorMap[lang] || colorMap.javascript;
    };

    return (
        <div className={`bg-gray-900 rounded-lg overflow-hidden border-l-4 ${getLanguageColor(language)} shadow-lg ${className}`}>
            {title && (
                <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm font-medium border-b border-gray-700">
                    <span className="text-gray-400 text-xs uppercase tracking-wide mr-2">{language}</span>
                    {title}
                </div>
            )}
            <div className="p-4">
        <pre className="text-gray-100 text-sm overflow-x-auto text--left">
          <code>
            {showLineNumbers ? (
                lines.map((line, index) => (
                    <div key={index} className="flex">
                  <span className="text-gray-500 text-xs mr-4 select-none w-8 text-right">
                    {index + 1}
                  </span>
                        <span>{line}</span>
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

export default CodeBlock;

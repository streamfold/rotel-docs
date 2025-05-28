import React from 'react';

export interface InlineCodeProps {
    children: React.ReactNode;
    language?: 'javascript' | 'python' | 'bash' | 'json' | 'css' | 'html' | 'typescript' | 'sql';
    className?: string;
    showLanguage?: boolean;
}

const InlineCode: React.FC<InlineCodeProps> = ({
                                                   children,
                                                   language = 'javascript',
                                                   className = '',
                                                   showLanguage = false
                                               }) => {
    // Language-specific styling
    const getLanguageStyles = (lang: string): string => {
        const baseStyles = 'px-2 py-1 rounded text-sm font-mono';
        const languageMap: Record<string, string> = {
            javascript: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            python: 'bg-blue-100 text-blue-800 border border-blue-200',
            bash: 'bg-gray-100 text-gray-800 border border-gray-200',
            json: 'bg-green-100 text-green-800 border border-green-200',
            css: 'bg-purple-100 text-purple-800 border border-purple-200',
            html: 'bg-red-100 text-red-800 border border-red-200',
            typescript: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
            sql: 'bg-orange-100 text-orange-800 border border-orange-200'
        };

        return `${baseStyles} ${languageMap[lang] || languageMap.javascript}`;
    };

    return (
        <span className={`${getLanguageStyles(language)} ${className}`}>
      {showLanguage && (
          <span className="text-xs uppercase tracking-wide opacity-60 mr-1">
          {language}:
        </span>
      )}
            {children}
    </span>
    );
};

export default InlineCode;

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                display: ['"Space Grotesk"', 'sans-serif'],
                body: ['"DM Sans"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                soc: {
                    dark: '#0F172A',
                    panel: '#1E293B',
                    primary: '#8B5CF6',
                    accent: '#F97316',
                    success: '#10B981',
                    danger: '#EF4444',
                    base: '#F8FAFC',
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fadeIn': 'fadeIn 0.2s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        }
    }
}
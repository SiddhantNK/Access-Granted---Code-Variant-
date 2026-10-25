/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          'surface-secondary': 'var(--surface-secondary)',
          'surface-tertiary': 'var(--surface-tertiary)',
          text: 'var(--text)',
          'text-muted': 'var(--text-muted)',
          'text-subtle': 'var(--text-subtle)',
          border: 'var(--border)',
          'border-subtle': 'var(--border-subtle)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          'accent-surface': 'var(--accent-surface)',
          'accent-foreground': 'var(--accent-foreground)',
          gold: 'var(--gold)',
          'gold-surface': 'var(--gold-surface)',
          destructive: 'var(--destructive)',
          'destructive-surface': 'var(--destructive-surface)',
          overlay: 'var(--overlay)',
          'destructive-foreground': 'var(--destructive-foreground)',
          ring: 'var(--ring)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      keyframes: {
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        floatSubtle: 'floatSubtle 4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.25s ease-out',
        slideUp: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

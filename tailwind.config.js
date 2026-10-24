/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Floating animation for ghost
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px)',
            opacity: '1',
          },
          '50%': { 
            transform: 'translateY(-12px) translateX(0px)',
            opacity: '1',
          },
        },

        // Blinking animation for eyes
        blink: {
          '0%, 90%, 100%': { 
            transform: 'scaleY(1)',
          },
          '95%': { 
            transform: 'scaleY(0.05)',
          },
        },

        // Gentle sway for longer floats
        sway: {
          '0%, 100%': { 
            transform: 'translateX(0px) rotate(0deg)',
          },
          '50%': { 
            transform: 'translateX(4px) rotate(1deg)',
          },
        },

        // Bounce for celebrations
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(0)',
          },
          '50%': { 
            transform: 'translateY(-20px)',
          },
        },

        // Wobble for scared state
        wobble: {
          '0%, 100%': { 
            transform: 'translateX(0)',
          },
          '25%': { 
            transform: 'translateX(-5px)',
          },
          '75%': { 
            transform: 'translateX(5px)',
          },
        },

        // Spin for loading states
        spin: {
          'to': { 
            transform: 'rotate(360deg)',
          },
        },

        // Pulse for emphasis
        pulse: {
          '0%, 100%': { 
            opacity: '1',
          },
          '50%': { 
            opacity: '0.7',
          },
        },

        // Fade in
        fadeIn: {
          '0%': { 
            opacity: '0',
          },
          '100%': { 
            opacity: '1',
          },
        },

        // Slide in from bottom
        slideUp: {
          '0%': { 
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },

        // Scale in
        scaleIn: {
          '0%': { 
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1',
          },
        },

        // Shake for error states
        shake: {
          '0%, 100%': { 
            transform: 'translateX(0)',
          },
          '25%': { 
            transform: 'translateX(-8px)',
          },
          '75%': { 
            transform: 'translateX(8px)',
          },
        },

        // Swoosh for navigation
        swoosh: {
          '0%': { 
            transform: 'translateX(-100px) rotate(-45deg)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateX(0) rotate(0deg)',
            opacity: '1',
          },
        },

        // Confetti fall
        fall: {
          'to': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0',
          },
        },
      },

      animation: {
        float: 'float 3s ease-in-out infinite',
        floatSlow: 'float 4s ease-in-out infinite',
        floatFast: 'float 2s ease-in-out infinite',
        blink: 'blink 4s infinite',
        sway: 'sway 2.5s ease-in-out infinite',
        bounce: 'bounce 0.6s ease-in-out infinite',
        wobble: 'wobble 0.4s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
        scaleIn: 'scaleIn 0.4s ease-out',
        shake: 'shake 0.5s ease-in-out',
        swoosh: 'swoosh 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        spin: 'spin 1s linear infinite',
        fall: 'fall 3s ease-in forwards',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

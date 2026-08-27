/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Background tints — decorative only, not for text
        c1: "#EDF6F7",
        c2: "#C8E6EA",
        c3: "#94CDD4",
        // Brand / actions — dark enough for white text (WCAG AA+)
        c4: "#127076",
        c5: "#0B5258",
        c6: "#083840",
        ink: {
          DEFAULT: "#0F172A",
          muted: "#334155",
          faint: "#64748B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFB",
        },
      },
      boxShadow: {
        soft: "0 2px 16px -2px rgba(11, 82, 88, 0.10)",
        card: "0 4px 24px -4px rgba(11, 82, 88, 0.14)",
        float: "0 12px 40px -8px rgba(11, 82, 88, 0.18)",
        nav: "0 1px 0 rgba(255,255,255,0.9) inset, 0 1px 3px rgba(15,23,42,0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        mesh: 'radial-gradient(at 15% 10%, #EDF6F7 0px, transparent 55%), radial-gradient(at 85% 20%, #D9EEF1 0px, transparent 50%), radial-gradient(at 50% 90%, #C8E6EA 0px, transparent 45%)',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(18, 112, 118, 0.12), transparent)',
      },
    },
  },
  plugins: [],
}

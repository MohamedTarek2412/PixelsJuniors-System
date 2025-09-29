// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Pixels Juniors Academy Brand Colors
        pixels: {
          dark: 'rgb(35, 31, 32)',           // Main dark gray
          orange: 'rgb(227, 106, 37)',       // Bright golden orange
          darkest: 'rgb(36, 30, 32)',        // Darkest gray
          gray: 'rgb(33, 31, 32)',           // Dark gray
          charcoal: 'rgb(34, 30, 31)',       // Dark charcoal
          white: 'rgb(255, 255, 255)',       // Pure white
          'orange-dark': 'rgb(212, 129, 37)', // Darker golden orange
          purple: 'rgb(35, 30, 34)',         // Purple dark gray
          medium: 'rgb(36, 32, 33)',         // Medium gray
          brown: 'rgb(35, 31, 30)'           // Brown dark gray
        },
        // Custom gradients support
        gradient: {
          'orange-start': 'rgb(227, 106, 37)',
          'orange-end': 'rgb(212, 129, 37)',
          'dark-start': 'rgb(35, 31, 32)',
          'dark-end': 'rgb(36, 32, 33)'
        }
      },
      fontFamily: {
        'arabic': ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
        'english': ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'pixels': '0 10px 25px -5px rgba(227, 106, 37, 0.1), 0 4px 6px -2px rgba(227, 106, 37, 0.05)',
        'pixels-lg': '0 20px 40px -10px rgba(227, 106, 37, 0.15), 0 8px 12px -4px rgba(227, 106, 37, 0.1)',
        'dark': '0 10px 25px -5px rgba(35, 31, 32, 0.3), 0 4px 6px -2px rgba(35, 31, 32, 0.2)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-orange': 'pulseOrange 2s infinite',
        'bounce-gentle': 'bounceGentle 0.6s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        pulseOrange: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(227, 106, 37, 0.7)'
          },
          '70%': { 
            boxShadow: '0 0 0 10px rgba(227, 106, 37, 0)'
          }
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0,0,0)'
          },
          '40%, 43%': {
            transform: 'translate3d(0, -15px, 0)'
          },
          '70%': {
            transform: 'translate3d(0, -7px, 0)'
          },
          '90%': {
            transform: 'translate3d(0, -2px, 0)'
          }
        }
      },
      backdropBlur: {
        'xs': '2px'
      }
    }
  },
  plugins: [
    // Custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient-orange': {
          'background': 'linear-gradient(135deg, rgb(227, 106, 37), rgb(212, 129, 37))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text'
        },
        '.bg-gradient-pixels': {
          'background': 'linear-gradient(135deg, rgb(35, 31, 32) 0%, rgb(36, 30, 32) 25%, rgb(33, 31, 32) 50%, rgb(35, 30, 34) 75%, rgb(36, 32, 33) 100%)'
        },
        '.bg-gradient-orange': {
          'background': 'linear-gradient(135deg, rgb(227, 106, 37), rgb(212, 129, 37))'
        },
        '.glass-effect': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)'
        },
        '.card-hover': {
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-5px)',
            'box-shadow': '0 20px 40px -10px rgba(227, 106, 37, 0.15)'
          }
        },
        '.btn-primary': {
          'background': 'linear-gradient(135deg, rgb(227, 106, 37), rgb(212, 129, 37))',
          'color': 'white',
          'border': 'none',
          'transition': 'all 0.2s ease',
          '&:hover': {
            'background': 'linear-gradient(135deg, rgb(212, 129, 37), rgb(227, 106, 37))',
            'transform': 'translateY(-1px)',
            'box-shadow': '0 10px 20px rgba(227, 106, 37, 0.3)'
          }
        },
        '.input-focus': {
          'transition': 'all 0.2s ease',
          '&:focus': {
            'ring': '2px',
            'ring-color': 'rgb(227, 106, 37)',
            'border-color': 'transparent',
            'transform': 'scale(1.02)'
          }
        }
      };
      addUtilities(newUtilities);
    }
  ]
};
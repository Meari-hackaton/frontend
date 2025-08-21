module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // MEARI 브랜드 색상
      colors: {
        'meari': {
          50: '#eef4ff',
          100: '#cfe0ff',
          200: '#93c5fd',
          300: '#60a5fa',
          400: '#3b82f6',
          500: '#1e40af',
          600: '#1e3a8a',
          700: '#1e3a8a',
        }
      },
      // 브랜드 그라데이션
      backgroundImage: {
        'meari-gradient': 'linear-gradient(135deg, #eef4ff 0%, #cfe0ff 50%, #e9f0ff 100%)',
        'meari-radial': 'radial-gradient(1200px 700px at 48% 55%, rgba(147,197,253,0.46), transparent 60%)',
        'meari-wave': 'linear-gradient(to bottom, transparent, rgba(147,197,253,0.1))'
      },
      // 웨이브 애니메이션
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'plane-fly': 'plane-fly 8s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.8s ease-in-out',
        'slideIn': 'slideIn 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'plane-fly': {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '50%': { transform: 'translateX(20px) translateY(-15px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      // 글래스모피즘 효과
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
  
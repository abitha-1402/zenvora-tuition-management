import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  light = false
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Logo Mark */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-sm shadow-[#7047D7]/20`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="zenvoraGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7047D7" />
              <stop offset="100%" stopColor="#45258D" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="22" fill="url(#zenvoraGradLogo)" />
          {/* Subtle Geometric Hexagon background */}
          <polygon
            points="50,15 78,32 78,68 50,85 22,68 22,32"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeOpacity="0.3"
            fill="none"
          />
          {/* Graduation Cap Mortarboard */}
          <polygon points="50,30 80,44 50,58 20,44" fill="#FFFFFF" />
          {/* Cap Skull Base */}
          <path
            d="M32,50 L32,62 C32,70 68,70 68,62 L68,50 Z"
            fill="#E5D9FA"
          />
          {/* Tassel */}
          <circle cx="50" cy="44" r="2.5" fill="#45258D" />
          <path d="M50,44 Q38,48 33,56" stroke="#FAF9FF" strokeWidth="2" strokeLinecap="round" />
          <polygon points="33,56 31,68 35,68" fill="#F3EEFF" />
          {/* Modern Zen Diamond/Accent at bottom */}
          <polygon points="50,72 55,77 50,82 45,77" fill="#FFFFFF" opacity="0.85" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight ${textSizes[size]} ${light ? 'text-white' : 'text-slate-900'}`}>
            Zenvora
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7047D7]"></span>
        </div>
        {showTagline && (
          <span className={`text-[11px] leading-tight font-medium ${light ? 'text-white/70' : 'text-slate-500'}`}>
            Smart Tuition Management System
          </span>
        )}
      </div>
    </div>
  );
};

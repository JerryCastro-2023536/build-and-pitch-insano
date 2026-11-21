import React from 'react';

export interface BalamJaguarAvatarProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const BalamJaguarAvatar: React.FC<BalamJaguarAvatarProps> = ({
  className = '',
  size = 40,
  animated = false
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${animated ? 'hover:scale-105 transition-transform' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Deep Indigo background disk */}
        <circle cx="50" cy="50" r="46" fill="#1E1548" />
        
        {/* Outer geometric shield (Saffron) */}
        <polygon points="50,16 78,38 78,72 50,90 22,72 22,38" fill="#F5A623" />
        
        {/* Inner cream mask */}
        <polygon points="50,26 70,43 70,69 50,81 30,69 30,43" fill="#FFF8F0" />
        
        {/* Magenta huipil ears */}
        <polygon points="20,25 35,32 18,48" fill="#B90C55" />
        <polygon points="80,25 65,32 82,48" fill="#B90C55" />
        
        {/* Almond eyes */}
        <path d="M35 50 Q42 43 49 50 Q42 55 35 50 Z" fill="#625499" />
        <circle cx="43" cy="49" r="2.5" fill="#0D9488" />
        <path d="M51 50 Q58 43 65 50 Q58 55 51 50 Z" fill="#625499" />
        <circle cx="57" cy="49" r="2.5" fill="#0D9488" />
        
        {/* Mathematical markings on cheeks (+ and = subtle symbols) */}
        <path d="M36 60 L40 60 M38 58 L38 62" stroke="#B90C55" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M60 59 L64 59 M60 62 L64 62" stroke="#B90C55" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Triangular nose */}
        <polygon points="50,56 46,62 54,62" fill="#B90C55" />
        
        {/* Whiskers & mouth */}
        <path d="M50 62 L50 68 M44 68 L56 68" stroke="#1E1548" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

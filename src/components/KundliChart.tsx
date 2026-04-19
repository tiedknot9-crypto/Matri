import React from 'react';

export const KundliChart: React.FC = () => {
  return (
    <div className="relative w-full aspect-square max-w-[400px] border-2 border-gold mx-auto bg-ivory/50">
      {/* North Indian Diamond Chart Structure */}
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-gold stroke-[0.5] fill-none">
        {/* Outer Box */}
        <rect x="0" y="0" width="100" height="100" />
        {/* Main Diagonals */}
        <line x1="0" y1="0" x2="100" y2="100" />
        <line x1="100" y1="0" x2="0" y2="100" />
        {/* Inner Diamond */}
        <line x1="50" y1="0" x2="100" y2="50" />
        <line x1="100" y1="50" x2="50" y2="100" />
        <line x1="50" y1="100" x2="0" y2="50" />
        <line x1="0" y1="50" x2="50" y2="0" />

        {/* Labels for Houses */}
        <text x="50" y="35" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">1</text>
        <text x="35" y="20" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">2</text>
        <text x="15" y="25" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">3</text>
        <text x="30" y="50" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">4</text>
        <text x="15" y="75" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">5</text>
        <text x="35" y="80" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">6</text>
        <text x="50" y="65" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">7</text>
        <text x="65" y="80" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">8</text>
        <text x="85" y="75" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">9</text>
        <text x="70" y="50" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">10</text>
        <text x="85" y="25" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">11</text>
        <text x="65" y="20" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-bold">12</text>

        {/* Planet Placeholders (Example) */}
        <text x="50" y="42" textAnchor="middle" fontSize="3" fill="#D4AF37">Su, Me</text>
        <text x="50" y="72" textAnchor="middle" fontSize="3" fill="#D4AF37">Ma</text>
        <text x="30" y="55" textAnchor="middle" fontSize="3" fill="#D4AF37">Mo</text>
        <text x="70" y="55" textAnchor="middle" fontSize="3" fill="#D4AF37">Ju</text>
      </svg>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';

interface GunaMilanMeterProps {
  score: number;
}

export const GunaMilanMeter: React.FC<GunaMilanMeterProps> = ({ score }) => {
  const percentage = (score / 36) * 100;
  const strokeDasharray = 283; // 2 * PI * r
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="45"
          className="stroke-gold/20 fill-none stroke-[8px]"
        />
        <motion.circle
          cx="96"
          cy="96"
          r="45"
          initial={{ strokeDashoffset: strokeDasharray }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="stroke-gold fill-none stroke-[8px]"
          strokeDasharray={strokeDasharray}
          style={{ strokeLinecap: 'round' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-vermilion">{score}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">/ 36 Gunas</span>
        <div className="mt-1 h-0.5 w-8 bg-gold/50 rounded-full" />
      </div>
    </div>
  );
};

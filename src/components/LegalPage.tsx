import React from 'react';
import { motion } from 'motion/react';
import { XCircle, Shield, FileText, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  title: string;
  content: string;
  onClose: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ title, content, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ivory z-[100] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-vermilion font-bold uppercase tracking-widest text-xs mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
             <Shield size={120} className="text-vermilion" />
          </div>
          
          <header className="text-center mb-16 relative">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-vermilion mb-4 underline decoration-gold/30 underline-offset-8">
              {title}
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">Matrimonial Plus — Official Document</p>
          </header>

          <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-traditional border border-gold/10 relative">
            {/* Corner Motifs */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-gold/20 rounded-tl-[2rem] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-gold/20 rounded-br-[2rem] pointer-events-none"></div>

            <div className="prose prose-vermilion max-w-none">
              <div className="text-traditional-text font-serif leading-relaxed whitespace-pre-wrap text-lg">
                {content || "Information coming soon..."}
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-ivory/50 flex flex-col items-center">
               <div className="w-12 h-12 bg-ivory rounded-full flex items-center justify-center border border-gold/10 mb-4">
                  <FileText className="text-gold" size={24} />
               </div>
               <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest leading-loose">
                 This document is legally binding.<br/>
                 © {new Date().getFullYear()} Matrimonial Plus Matchmaking Services
               </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

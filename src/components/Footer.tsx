import React from 'react';

interface FooterProps {
  onShowLegal: (type: 'terms' | 'privacy' | 'refund') => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowLegal }) => {
  return (
    <footer className="bg-[#1a1a1a] text-[#888] py-10 border-t-2 border-gold font-sans">
      <div className="container mx-auto px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs">
            © {new Date().getFullYear()} Digital Communique Private Limited. All Rights Reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-wider font-bold">
            <button onClick={() => onShowLegal('terms')} className="hover:text-gold transition-colors">Terms of Service</button>
            <button onClick={() => onShowLegal('privacy')} className="hover:text-gold transition-colors">Privacy Policy</button>
            <button onClick={() => onShowLegal('refund')} className="hover:text-gold transition-colors">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};


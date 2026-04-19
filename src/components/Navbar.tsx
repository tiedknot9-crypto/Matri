import React from 'react';
import { Shield, Sparkles, User, Wallet, Bell, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC<{ onLoginClick?: () => void }> = ({ onLoginClick }) => {
  const { settings, currentUser, logout, wallets } = useApp();
  const balance = currentUser ? (wallets[currentUser.id] || 0) : 0;

  return (
    <nav className="bg-linear-to-b from-vermilion-light to-vermilion text-white border-b-3 border-gold min-h-20 py-2 md:py-0 sticky top-0 z-50 flex items-center shadow-lg">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 flex flex-col md:row justify-between items-center gap-4 md:gap-0">
        <div className="flex items-center gap-2 md:gap-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-8 md:h-10 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="text-xl md:text-2xl">🪔</div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-white leading-none">Matrimonial Plus</h1>
            <p className="text-[8px] md:text-[10px] text-white/80 font-bold tracking-widest uppercase">योग्य जीवनसाथी</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-hide">
          {currentUser && (
            <div className="wallet-info bg-white/10 border border-gold px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-2 flex-shrink-0">
              <Wallet size={14} className="text-gold md:w-4 md:h-4" />
              <span className="text-[10px] md:text-sm font-bold text-white whitespace-nowrap">₹{balance.toLocaleString()}</span>
            </div>
          )}
          
          {currentUser ? (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gold p-0.5 cursor-pointer overflow-hidden flex-shrink-0">
                <img 
                  src={currentUser.photoUrl || "https://picsum.photos/seed/user/100/100"} 
                  alt="User" 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={logout}
                className="text-[10px] md:text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-2 md:px-3 py-1 rounded transition-all text-gold border border-gold/30 whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          ) : (
             <button 
               onClick={onLoginClick}
               className="bg-gold text-vermilion px-4 md:px-6 py-2 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-white transition-all shadow-md whitespace-nowrap"
             >
               Member Login
             </button>
          )}
        </div>
      </div>
    </nav>
  );
};


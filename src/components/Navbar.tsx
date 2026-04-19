import React from 'react';
import { Shield, Sparkles, User, Wallet, Bell, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC<{ onLoginClick?: () => void }> = ({ onLoginClick }) => {
  const { settings, currentUser, logout, wallets } = useApp();
  const balance = currentUser ? (wallets[currentUser.id] || 0) : 0;

  return (
    <nav className="bg-linear-to-b from-vermilion-light to-vermilion text-white border-b-3 border-gold h-20 sticky top-0 z-50 flex items-center shadow-lg">
      <div className="container mx-auto px-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="text-2xl">🪔</div>
          )}
          <div>
            <h1 className="text-2xl font-serif font-bold text-white leading-none">Matrimonial Plus</h1>
            <p className="text-[10px] text-white/80 font-bold tracking-widest uppercase">योग्य जीवनसाथी</p>
          </div>
        </div>

        {currentUser && (
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-white/90">🙏 Namaste, {currentUser.name}</span>
              <span className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border border-white/20 text-gold">
                <ShieldCheck size={10} /> Verified Account
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="wallet-info bg-white/10 border border-gold px-4 py-2 rounded-full flex items-center gap-2">
              <Wallet size={16} className="text-gold" />
              <span className="text-sm font-bold text-white">Balance: ₹{balance.toLocaleString()}</span>
            </div>
          )}
          
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold p-0.5 cursor-pointer overflow-hidden">
                <img 
                  src={currentUser.photoUrl || "https://picsum.photos/seed/user/100/100"} 
                  alt="User" 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={logout}
                className="text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-all text-gold border border-gold/30"
              >
                Logout
              </button>
            </div>
          ) : (
             <button 
               onClick={onLoginClick}
               className="bg-gold text-vermilion px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-md"
             >
               Member Login
             </button>
          )}
        </div>
      </div>
    </nav>
  );
};


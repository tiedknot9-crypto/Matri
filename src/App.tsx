/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MatchCard } from './components/MatchCard';
import { KundliChart } from './components/KundliChart';
import { GunaMilanMeter } from './components/GunaMilanMeter';
import { mockProfiles } from './data';
import { Sparkles, Calendar, Clock, MapPin, Search, ShieldCheck, Heart, User, Users, Shield, Eye, EyeOff, LifeBuoy, XCircle, Send, Star, CheckCircle, Wallet as WalletIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAstrologicalInsight } from './services/astrologyService';
import { cn } from './lib/utils';
import { UserProfile, AdminSettings, MatchingPreferences, DEFAULT_PREFERENCES, PRICING } from './types';
import { PreferenceSettings } from './components/PreferenceSettings';
import { WalletPanel } from './components/WalletPanel';

import { AppProvider, useApp } from './context/AppContext';
import { AdminPanel } from './components/AdminPanel';
import { LegalPage } from './components/LegalPage';
import { RegistrationForm } from './components/RegistrationForm';

export default function Root() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

const ServiceCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-3xl border border-gold/10 hover:shadow-traditional hover:translate-y-[-4px] transition-all text-center space-y-4">
    <div className="flex justify-center">{icon}</div>
    <h3 className="text-lg font-bold text-vermilion">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const MatchmakingPreview = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6 lg:px-10">
       <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vermilion/5 border border-vermilion/10 text-vermilion text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <Heart size={14} className="fill-vermilion" /> Premium Experience
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-vermilion leading-tight">
            Unlock Auspicious Matches & <br className="hidden md:block"/>
            <span className="text-gold italic font-normal">Deep Astrological Insights</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed italic">
            "Destiny brings two souls together, but we help you find the one whose stars align with yours."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
             <div className="bg-ivory/50 p-6 md:p-8 rounded-3xl border border-gold/10 space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gold/10">
                   <Users className="text-vermilion" size={20} md:size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-vermilion">Verified Recommendations</h3>
                <p className="text-xs md:text-sm text-gray-500">Access thousands of handpicked profiles verified by our dedicated family managers. No fakes, only serious marriage proposals.</p>
             </div>
             <div className="bg-ivory/50 p-6 md:p-8 rounded-3xl border border-gold/10 space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gold/10">
                   <Sparkles className="text-gold" size={20} md:size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-vermilion">Guna Milan & Dosha analysis</h3>
                <p className="text-xs md:text-sm text-gray-500">View detailed Kundli charts and astrological compatibility scores instantly. We handle the complex Manglik and Shani calculations for you.</p>
             </div>
          </div>

          <div className="pt-4 md:pt-8 w-full md:w-auto px-4 md:px-0">
             <a href="#register" className="inline-flex items-center justify-center gap-3 bg-vermilion text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg shadow-2xl shadow-vermilion/20 hover:scale-105 transition-all w-full md:w-auto">
               Get Started for Free <Heart size={20} />
             </a>
             <p className="text-[10px] md:text-xs text-gray-400 mt-4">Takes less than 2 minutes to create your profile</p>
          </div>
       </div>
    </div>
  </section>
);

function App() {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [legalView, setLegalView] = useState<'terms' | 'privacy' | 'refund' | null>(null);
  const [isFamilyMode, setIsFamilyMode] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  const [showSupport, setShowSupport] = useState(false);
  const [ticketData, setTicketData] = useState({ subject: '', message: '' });
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [dashboardTab, setDashboardTab] = useState<'matches' | 'requests' | 'wallet'>('matches');
  const [paymentResult, setPaymentResult] = useState<{status: string, txnid: string, amount: string, error?: string} | null>(null);

  const { settings, addTicket, currentUser, login, updatePreferences, profiles, wallets, debitWallet, addConnection, acceptConnection, connections, rechargeWallet } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const txnid = params.get('txnid');
    const amount = params.get('amount');
    const error = params.get('error');

    if (status && txnid && amount) {
      // Normalize common pseudo-errors and empty strings
      const rawError = String(error || '').trim();
      const normalizedError = (
        !rawError || 
        rawError === 'E000' || 
        rawError.toLowerCase() === 'no error' || 
        rawError.toLowerCase() === 'success' ||
        rawError.toLowerCase() === 'null' ||
        rawError.toLowerCase() === 'undefined'
      ) ? undefined : rawError;
      
      setPaymentResult({ status, txnid, amount, error: normalizedError });
      if (status === 'success' && currentUser) {
        rechargeWallet(currentUser.id, Number(amount));
      }
      // Remove query parameters to prevent re-processing on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [currentUser?.id, rechargeWallet]);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket(currentUser?.id || 'anonymous', ticketData.subject, ticketData.message);
    setTicketData({ subject: '', message: '' });
    setShowSupport(false);
    alert('Support ticket submitted successfully!');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(loginEmail, loginPassword);
    if (result === 'admin') {
      setView('admin');
      setShowLogin(false);
    } else if (result === 'user') {
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Invalid credentials. Please check your Email/ID and Password.');
    }
  };

  useEffect(() => {
    // Simulated insight for first load
    const targetUser = currentUser || profiles.find(p => p.id === 'user_profile_id');
    if (targetUser) {
      setIsInsightLoading(true);
      getAstrologicalInsight({ 
        name: targetUser.name, 
        score: 32, 
        doshas: ['None'],
        dob: targetUser.dob,
        birthTime: targetUser.birthTime,
        birthPlace: targetUser.birthPlace
      })
      .then(resp => {
        setAiInsight(resp);
        setIsInsightLoading(false);
      });
    }
  }, [currentUser, profiles]);

  const handleConnect = (receiverId: string) => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }

    const cost = PRICING[currentUser.tier].request;
    const balance = wallets[currentUser.id] || 0;

    if (balance < cost) {
      alert(`Insufficient balance. This action requires ₹${cost}. Please recharge your wallet.`);
      setDashboardTab('wallet');
      return;
    }

    debitWallet(currentUser.id, cost, `Interest request sent to ID: ${receiverId}`);
    addConnection(currentUser.id, receiverId);
    alert(`Interest sent successfully! ₹${cost} debited from wallet.`);
  };

  const handleAcceptConnection = (connectionId: string) => {
    if (!currentUser) return;

    const cost = PRICING[currentUser.tier].acceptance;
    const balance = wallets[currentUser.id] || 0;

    if (balance < cost) {
      alert(`Insufficient balance to accept this request (Requires ₹${cost}).`);
      setDashboardTab('wallet');
      return;
    }

    debitWallet(currentUser.id, cost, `Auspicious match request accepted`);
    acceptConnection(connectionId);
    alert(`Connection accepted! ₹${cost} debited.`);
  };

  const getLegalContent = () => {
    if (legalView === 'terms') return { title: 'Terms & Conditions', content: settings.termsAndConditions };
    if (legalView === 'privacy') return { title: 'Privacy Policy', content: settings.privacyPolicy };
    if (legalView === 'refund') return { title: 'Refund Policy', content: settings.refundPolicy };
    return null;
  };

  const currentLegal = getLegalContent();

  if (view === 'admin') return (
    <div className="relative">
      <AdminPanel />
      <button 
        onClick={() => setView('user')}
        className="fixed bottom-6 right-6 bg-gold text-vermilion p-4 rounded-full shadow-2xl font-bold hover:scale-110 transition-all z-50 flex items-center gap-2"
      >
        <Eye size={20} /> Exit Admin
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-500 ${isFamilyMode ? 'bg-[#fcf8f2]' : 'bg-white'}`}>
      <Navbar onLoginClick={() => setShowLogin(true)} />

      {isFamilyMode && (
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="bg-saffron text-white text-[10px] uppercase font-bold tracking-[0.2em] text-center py-2 shadow-lg z-[60] flex items-center justify-center gap-4"
        >
          <Users size={14} /> 
          Family Mode Active — Prioritizing Guardianship & Shared Values
          <Users size={14} />
        </motion.div>
      )}

      <AnimatePresence>
        {legalView && currentLegal && (
          <LegalPage 
            title={currentLegal.title} 
            content={currentLegal.content} 
            onClose={() => setLegalView(null)} 
          />
        )}
      </AnimatePresence>
      
      {/* Support Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <button 
          onClick={() => setShowSupport(true)}
          className="bg-peacock text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all flex items-center gap-2 border-2 border-ivory"
          title="Raise Support Ticket"
        >
          <LifeBuoy size={24} />
        </button>
      </div>
      
      <AnimatePresence>
        {showSupport && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gold/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold text-vermilion">Submit Support Ticket</h3>
                <button onClick={() => setShowSupport(false)} className="text-gray-400 hover:text-vermilion"><XCircle size={24} /></button>
              </div>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                  <input 
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl bg-ivory/20 text-sm outline-none focus:ring-1 focus:ring-gold"
                    value={ticketData.subject}
                    onChange={e => setTicketData({...ticketData, subject: e.target.value})}
                    placeholder="e.g., Payment issue, Profile update"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</label>
                  <textarea 
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl bg-ivory/20 text-sm outline-none focus:ring-1 focus:ring-gold"
                    rows={4}
                    value={ticketData.message}
                    onChange={e => setTicketData({...ticketData, message: e.target.value})}
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                <button type="submit" className="w-full bg-vermilion text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Send size={18} /> Send Ticket
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-grow">
        {/* Main Content Area */}
        <main className="flex-1 p-0 space-y-0 bg-[#faf9f6]">
          
          {/* Hero Section */}
          <section className="relative min-h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center text-center px-4 md:px-6">
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://picsum.photos/seed/sacred/1920/1080?blur=2" 
                 alt="Wedding background" 
                 className="w-full h-full object-cover opacity-20"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-linear-to-b from-ivory via-transparent to-ivory"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 max-w-3xl mx-auto py-12 md:py-0"
            >
              <div className="flex justify-center mb-4 md:mb-6">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20">
                    <Sparkles className="text-gold" size={24} md:size={32} />
                 </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-vermilion mb-4 md:mb-6 leading-tight">
                Authentic Matchmaking for <br className="hidden md:block"/>
                <span className="text-gold italic font-normal">Traditional Families</span>
              </h1>
              <p className="text-traditional-text font-serif italic text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
                Where every connection is blessed by stars and verified by humans. Find your destined life partner today.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 md:gap-6 mt-4 md:mt-8 px-4 sm:px-0">
                <div className="relative group flex-1 max-w-full sm:max-w-[280px]">
                  <a href="#register" className="flex items-center justify-center bg-vermilion text-white h-[56px] md:h-[64px] px-6 md:px-8 rounded-full font-bold shadow-2xl shadow-vermilion/30 hover:bg-vermilion-light hover:scale-105 transition-all text-base md:text-lg w-full">
                    Join Now — It's Free
                  </a>
                  <p className="absolute -bottom-6 left-0 right-0 text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                    Takes less than 2 mins
                  </p>
                </div>

                <div className="relative flex-1 max-w-full sm:max-w-[280px]">
                  <button 
                    onClick={() => setIsFamilyMode(!isFamilyMode)} 
                    className={cn(
                      "h-[56px] md:h-[64px] px-6 md:px-8 rounded-full font-bold transition-all text-base md:text-lg w-full border-2 flex items-center justify-center gap-2 shadow-xl",
                      isFamilyMode ? "bg-saffron text-white border-saffron" : "bg-white text-vermilion border-vermilion hover:bg-ivory"
                    )}
                  >
                    <Users size={18} md:size={20} />
                    {isFamilyMode ? 'Standard View' : 'Family Mode'}
                  </button>
                  <p className="absolute -bottom-6 left-0 right-0 text-[10px] text-gray-500 font-medium italic opacity-70 hidden sm:block">
                    {isFamilyMode ? 'Elder-friendly view active' : 'For parents & guardians'}
                  </p>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-16 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-gold/10 text-[11px] text-gray-500 max-w-xl mx-auto"
              >
                <p className="font-bold text-vermilion uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                  <ShieldCheck size={14} /> What is Family Mode?
                </p>
                <p className="leading-relaxed">
                  A specialized, high-security interface designed for elders. It prioritizes <strong>Verified Lineage</strong>, 
                  <strong>Career Stability</strong>, and <strong>Family Backgrounds</strong>, while simplifying the UI for accessibility.
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* Services Section */}
          <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4 md:px-10">
              <div className="text-center mb-10 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-vermilion mb-4">Our Sacred Services</h2>
                <div className="w-20 md:w-24 h-1 bg-gold/30 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <ServiceCard 
                  icon={<Search size={28} md:size={32} className="text-vermilion" />}
                  title="Find Perfect Partner"
                  desc="Filter through thousands of verified profiles across castes and religions."
                />
                <ServiceCard 
                  icon={<Sparkles size={28} md:size={32} className="text-gold" />}
                  title="Kundli Matching"
                  desc="Detailed Guna Milan and Dosha analysis powered by expert astrology."
                />
                <ServiceCard 
                  icon={<LifeBuoy size={28} md:size={32} className="text-peacock" />}
                  title="Personal Support"
                  desc="Dedicated managers to assist you in every step of your journey."
                />
                <ServiceCard 
                  icon={<Star size={28} md:size={32} className="text-saffron" />}
                  title="Rate Profiles"
                  desc="Give feedback and help us improve recommendations for your family."
                />
              </div>
            </div>
          </section>

          <div id="register" className="py-20 bg-[#faf9f6]">
             <RegistrationForm settings={settings} isPublic={true} />
          </div>

          {!currentUser ? (
            <MatchmakingPreview />
          ) : (
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
              {/* Payment Result Notification */}
              <AnimatePresence>
                {paymentResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className={`mb-8 md:mb-12 p-4 md:p-6 rounded-3xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-xl ${
                      paymentResult.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-4 text-center md:text-left">
                      <div className={`p-2 md:p-3 rounded-full ${paymentResult.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {paymentResult.status === 'success' ? <CheckCircle size={24} md:size={32} /> : <XCircle size={24} md:size={32} />}
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-bold font-serif">
                          {paymentResult.status === 'success' ? 'Auspicious Start! Recharge Successful' : 'Payment Interrupted'}
                        </h4>
                        <p className="text-xs md:text-sm opacity-80">
                          {paymentResult.error ? (
                            <span className="text-red-600 font-bold">Error: {paymentResult.error}</span>
                          ) : (
                            <>Transaction ID: <span className="font-mono">{paymentResult.txnid}</span> • Amount: ₹{paymentResult.amount}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setPaymentResult(null)} className="p-2 hover:bg-black/5 rounded-full transition-all">
                      <XCircle size={24} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dashboard Navigation */}
              <div className="flex flex-wrap items-center gap-2 mb-8 md:mb-12 p-1.5 md:p-2 bg-ivory/30 rounded-2xl md:rounded-[2rem] border border-gold/10 w-fit">
                <button 
                  onClick={() => setDashboardTab('matches')}
                  className={`px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-full font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                    dashboardTab === 'matches' ? 'bg-vermilion text-white shadow-lg' : 'text-gray-500 hover:bg-white/50'
                  }`}
                >
                  <Heart size={14} md:size={16} /> <span className="whitespace-nowrap">Matches</span>
                </button>
                <button 
                  onClick={() => setDashboardTab('requests')}
                  className={`px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-full font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                    dashboardTab === 'requests' ? 'bg-vermilion text-white shadow-lg' : 'text-gray-500 hover:bg-white/50'
                  }`}
                >
                  <Users size={14} md:size={16} /> <span className="whitespace-nowrap">Requests</span>
                </button>
                <button 
                  onClick={() => setDashboardTab('wallet')}
                  className={`px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-full font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                    dashboardTab === 'wallet' ? 'bg-vermilion text-white shadow-lg' : 'text-gray-500 hover:bg-white/50'
                  }`}
                >
                  <WalletIcon size={14} md:size={16} /> <span className="whitespace-nowrap">Wallet</span>
                </button>
              </div>

              <div className="space-y-12 md:space-y-16">
                {dashboardTab === 'matches' && (
                  <>
                    {/* Preferences Section */}
                    <section id="preferences" className="scroll-mt-24">
                       <PreferenceSettings 
                         preferences={currentUser.preferences || DEFAULT_PREFERENCES} 
                         onUpdate={(prefs) => {
                           updatePreferences(currentUser.id, prefs);
                           alert('Preferences saved! Matching engine updated.');
                         }}
                       />
                    </section>

                    {/* Recommended Matches Area */}
                    <div className="space-y-8">
                      <header className="border-b border-gold/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-vermilion flex items-center gap-3">
                              <Heart className={`${isFamilyMode ? 'text-saffron fill-saffron' : 'text-gold'}`} size={28} /> 
                              {isFamilyMode ? 'Family Verified Matches (कुल रक्षक चयन)' : 'Recommended Matches (शुभ मिलान)'}
                            </h2>
                            <p className="text-sm text-gray-500 italic mt-1 font-serif">
                              {isFamilyMode 
                                ? 'Detailed lineage and family background priority.' 
                                : 'Auspicious connections discovered by your stars.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-peacock/10 text-peacock text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 border border-peacock/20">
                            <ShieldCheck size={14} /> {isFamilyMode ? 'Verified Backgrounds' : '100% Human Verified'}
                          </span>
                        </div>
                      </header>

                      {/* Matches Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <AnimatePresence>
                        {[...profiles]
                          .filter(p => !p.isManager && p.id !== currentUser.id && p.approvalStatus === 'Approved')
                          .filter(p => {
                            // High-level filtering based on user seeking Bride (Female) or Groom (Male)
                            if (currentUser.gender === 'Male') return p.gender === 'Female';
                            if (currentUser.gender === 'Female') return p.gender === 'Male';
                            return true; // Simple logic for demo
                          })
                          .sort((a, b) => {
                            const prefs = currentUser.preferences || DEFAULT_PREFERENCES;
                            const calculateScore = (p: UserProfile) => {
                               let score = 0;
                               if (p.job === currentUser.job) score += (prefs.job * 0.8);
                               if (p.education?.[0] === currentUser.education?.[0]) score += (prefs.education * 0.8);
                               if (p.income === currentUser.income) score += (prefs.income * 0.8);
                               if (p.familyBackground === currentUser.familyBackground) score += (prefs.familyBackground * 0.8);
                               return score + Math.random() * 20;
                            };
                            return calculateScore(b) - calculateScore(a);
                          })
                          .slice(0, 4)
                          .map(profile => (
                          <MatchCard key={profile.id} profile={profile} onConnect={handleConnect} isFamilyMode={isFamilyMode} />
                        ))}
                      </AnimatePresence>

                      {/* Kundli Promotion Card from Design */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-orange-50 border border-dashed border-saffron rounded-xl flex items-center justify-center text-center p-6 md:p-8 transition-all hover:shadow-md cursor-pointer"
                      >
                        <div>
                          <span className="text-2xl md:text-3xl mb-2 block">🪐</span>
                          <strong className="text-vermilion block text-sm md:text-base">View Your Kundli Chart</strong>
                          <span className="text-[10px] md:text-xs text-gray-600 font-sans">Understand your Doshas & Guna Milan potential</span>
                        </div>
                      </motion.div>
                      </div>
                    </div>

                    {/* Kundli Matching Section - Expanded Details */}
                    <section className="bg-white border border-gold rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                          <div className="md:col-span-2 space-y-4 md:space-y-6">
                              <h2 className="text-xl md:text-2xl font-bold text-vermilion border-b border-ivory pb-2">Birth Details (जन्म विवरण)</h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</label>
                                  <input className="w-full bg-ivory border border-gray-200 rounded px-3 py-2 text-sm" placeholder="DD/MM/YYYY" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time of Birth</label>
                                  <input className="w-full bg-ivory border border-gray-200 rounded px-3 py-2 text-sm" placeholder="HH:MM AM/PM" />
                                </div>
                              </div>
                              <div className="p-4 bg-ivory/50 rounded-lg italic text-xs md:text-sm text-gray-700 border-l-2 border-gold">
                                {isInsightLoading ? 'Reading your stars...' : aiInsight}
                              </div>
                          </div>
                          <div className="flex flex-col items-center justify-center space-y-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gold/10">
                            <GunaMilanMeter score={30} />
                            <KundliChart />
                          </div>
                        </div>
                    </section>
                  </>
                )}

                {dashboardTab === 'requests' && (
                  <div className="space-y-12">
                    <section className="space-y-6">
                      <h3 className="text-2xl font-serif font-bold text-vermilion">Incoming Requests (प्राप्त अनुरोध)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {connections.filter(c => c.receiverId === currentUser.id).length === 0 ? (
                          <div className="col-span-2 text-center py-12 bg-ivory/20 rounded-3xl border border-dashed border-gold/30 text-gray-400">
                            No incoming requests yet.
                          </div>
                        ) : (
                          connections.filter(c => c.receiverId === currentUser.id).map(conn => {
                            const sender = profiles.find(p => p.id === conn.senderId);
                            if (!sender) return null;
                            return (
                              <div key={conn.id} className="bg-white p-6 rounded-3xl border border-gold shadow-sm flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                  <img src={sender.photoUrl} className="w-16 h-16 rounded-2xl object-cover border-2 border-ivory" referrerPolicy="no-referrer" />
                                  <div>
                                    <h4 className="font-bold text-vermilion">{sender.name} {sender.surname}</h4>
                                    <p className="text-xs text-gray-500">{sender.job} • {sender.location}</p>
                                    <span className={`text-[9px] font-bold uppercase ${conn.status === 'Accepted' ? 'text-green-600' : 'text-gold'}`}>
                                      Status: {conn.status}
                                    </span>
                                  </div>
                                </div>
                                {conn.status === 'Pending' && (
                                  <button 
                                    onClick={() => handleAcceptConnection(conn.id)}
                                    className="bg-vermilion text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-vermilion/20"
                                  >
                                    Accept (₹{PRICING[currentUser.tier].acceptance})
                                  </button>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-2xl font-serif font-bold text-vermilion">Sent Requests (भेजे गए अनुरोध)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {connections.filter(c => c.senderId === currentUser.id).length === 0 ? (
                          <div className="col-span-2 text-center py-12 bg-ivory/20 rounded-3xl border border-dashed border-gold/30 text-gray-400">
                            You haven't sent any interest yet.
                          </div>
                        ) : (
                          connections.filter(c => c.senderId === currentUser.id).map(conn => {
                            const receiver = profiles.find(p => p.id === conn.receiverId);
                            if (!receiver) return null;
                            return (
                              <div key={conn.id} className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                  <img src={receiver.photoUrl} className="w-16 h-16 rounded-2xl object-cover border-2 border-ivory" referrerPolicy="no-referrer" />
                                  <div>
                                    <h4 className="font-bold text-gray-800">{receiver.name} {receiver.surname}</h4>
                                    <p className="text-xs text-gray-500">{receiver.job} • {receiver.location}</p>
                                    <span className="text-[9px] font-bold uppercase text-peacock">
                                      {conn.status === 'Pending' ? 'Waiting for response' : 'Auspicious Match Found!'}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {conn.status}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </section>
                  </div>
                )}

                {dashboardTab === 'wallet' && (
                  <WalletPanel />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer onShowLegal={setLegalView} />

      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-10 max-w-md w-full shadow-2xl border border-gold/20 text-center space-y-6 md:space-y-8"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-vermilion/5 rounded-full flex items-center justify-center mx-auto border border-vermilion/10">
                <Shield className="text-vermilion" size={28} md:size={32} />
              </div>
              <div className="space-y-1 md:space-y-2">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-vermilion">Secure Access</h3>
                <p className="text-xs md:text-sm text-gray-500 px-4 md:px-0">Sign in to view your auspicious matches and Kundli reports.</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email or Client ID</label>
                     <input 
                       required
                       className="w-full p-3 md:p-4 border border-gray-100 rounded-xl md:rounded-2xl bg-ivory/50 text-sm outline-none focus:ring-1 focus:ring-gold"
                       placeholder="e.g., karthik@example.com or user"
                       value={loginEmail}
                       onChange={e => setLoginEmail(e.target.value)}
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                     <input 
                       required
                       type="password"
                       className="w-full p-3 md:p-4 border border-gray-100 rounded-xl md:rounded-2xl bg-ivory/50 text-sm outline-none focus:ring-1 focus:ring-gold"
                       placeholder="••••••••"
                       value={loginPassword}
                       onChange={e => setLoginPassword(e.target.value)}
                     />
                  </div>
                  <div className="p-3 bg-ivory/30 rounded-xl text-[9px] md:text-[10px] text-gray-400 italic">
                    For demo: Admin (admin / 12345) | User (user / 12345)
                  </div>
                  <button type="submit" className="w-full bg-vermilion text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-vermilion/20 hover:scale-[1.02] transition-all">
                    Enter Matrimonial Plus
                  </button>
              </form>
              
              <div className="pt-4 border-t border-ivory">
                <p className="text-xs text-gray-400">Not registered yet? <a href="#register" onClick={() => setShowLogin(false)} className="text-vermilion font-bold hover:underline">Create a profile</a></p>
              </div>
              <button onClick={() => setShowLogin(false)} className="text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-vermilion">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


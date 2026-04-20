import React from 'react';
import { Heart, Star, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import { UserProfile, getPricing } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

interface MatchCardProps {
  profile: UserProfile;
  onConnect: (id: string) => void;
  isFamilyMode?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ profile, onConnect, isFamilyMode }) => {
  const { currentUser, reportProfile } = useApp();
  const isElite = profile.tier === 'Elite';
  const displayCost = currentUser ? getPricing(currentUser.tier, profile.tier) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-4 relative transition-all duration-300",
        isFamilyMode ? "border-saffron shadow-sm bg-orange-50/10" : "border-gold shadow-traditional hover:shadow-lg"
      )}
    >
      {isFamilyMode && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-saffron text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase z-10">
          <ShieldCheck size={10} /> Family Audit OK
        </div>
      )}
      <div className="tilak-badge" />
      
      {/* Image Area */}
      <div className={cn(
        "w-full sm:w-28 h-32 bg-ivory rounded-lg border-2 overflow-hidden flex-shrink-0",
        isFamilyMode ? "border-saffron/30" : "border-ivory"
      )}>
        <img
          src={profile.photoUrl}
          alt={profile.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details Area */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-vermilion flex items-center gap-2">
                {profile.name} {profile.surname}
                {profile.isManager && (
                  <span className="flex items-center gap-1 bg-peacock/10 text-peacock px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-peacock/20">
                    <ShieldCheck size={10} /> Manager Account
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 text-peacock font-bold text-[10px] uppercase">
                <ShieldCheck size={12} /> {isFamilyMode ? '🛡️ Formal verification clear' : '🪐 Kundli Match'}
              </div>
            </div>
            {isElite && (
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded font-bold uppercase",
                isFamilyMode ? "bg-saffron text-white" : "bg-gold text-vermilion"
              )}>
                Elite Member
              </span>
            )}
          </div>
          
          <div className="meta-info text-[11px] text-gray-600 leading-relaxed font-sans mt-2">
            <p className="font-semibold text-gray-800">
              {profile.education?.[0] || 'Qualification N/A'} • {profile.job} • {profile.location}
            </p>
            <p>Caste: {profile.caste} • Gotra: {profile.gotra} • {profile.income}</p>
            
            {isFamilyMode && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-3 pt-2 border-t border-saffron/10 grid grid-cols-2 gap-2 text-[10px]"
              >
                <div>
                  <span className="text-gray-400 font-bold uppercase mr-1">Father:</span>
                  <span className="text-gray-700">{profile.fatherJob || 'Business'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase mr-1">Mother:</span>
                  <span className="text-gray-700">{profile.motherJob || 'Homemaker'}</span>
                </div>
                <div className="col-span-2 italic text-gray-400">
                  {profile.siblings || '1 Sibling'}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 sm:mt-0">
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
            isFamilyMode ? "bg-saffron/10 text-saffron border border-saffron/20" : "bg-ivory border border-gold text-traditional-text"
          )}>
            {isFamilyMode ? 'Background Verified' : 'Matching Potential: High ✨'}
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={() => onConnect(profile.id)}
              disabled={profile.isSuspended}
              className={cn(
                "flex-1 sm:flex-none px-4 py-2 text-[11px] rounded-md font-bold transition-all border border-transparent shadow-sm",
                profile.isSuspended ? "bg-gray-200 cursor-not-allowed text-gray-500" :
                isFamilyMode ? "bg-saffron text-white hover:bg-saffron/90" : "bg-saffron text-white hover:opacity-90"
              )}
            >
              {profile.isSuspended ? 'Account Suspended' : (isFamilyMode ? 'Request Meeting' : `रुचि व्यक्त करें (₹${displayCost})`)}
            </button>
            <button className={cn(
              "px-4 py-2 border text-[11px] rounded-md font-bold transition-all shadow-sm",
              isFamilyMode ? "bg-white text-saffron border-saffron hover:bg-orange-50" : "bg-transparent text-vermilion border-gold hover:bg-ivory"
            )}>
              Family View
            </button>
            <button 
              onClick={() => {
                const reason = prompt('Reason for reporting? (Fraud/Abusive)');
                if (reason && reportProfile) {
                  reportProfile(profile.id, reason);
                }
              }}
              className="px-2 py-2 text-red-500 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-100"
              title="Report Profile"
            >
              <Shield size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


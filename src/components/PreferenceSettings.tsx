import React, { useState } from 'react';
import { Settings2, Save, Sparkles, Briefcase, GraduationCap, Coins, Users } from 'lucide-react';
import { MatchingPreferences } from '../types';
import { motion } from 'motion/react';

interface PreferenceSettingsProps {
  preferences: MatchingPreferences;
  onUpdate: (prefs: MatchingPreferences) => void;
}

export const PreferenceSettings: React.FC<PreferenceSettingsProps> = ({ preferences, onUpdate }) => {
  const [localPrefs, setLocalPrefs] = useState<MatchingPreferences>(preferences);

  const handleChange = (key: keyof MatchingPreferences, value: number) => {
    setLocalPrefs({ ...localPrefs, [key]: value });
  };

  const totalWeight = Object.values(localPrefs).reduce((sum: number, val) => sum + (val as number), 0);

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gold/10 shadow-traditional space-y-8">
      <div className="flex items-center justify-between border-b border-ivory pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-vermilion/5 rounded-full flex items-center justify-center">
            <Settings2 className="text-vermilion" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-vermilion">Match Weightage</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Adjust what matters most to you</p>
          </div>
        </div>
        <button 
          onClick={() => onUpdate(localPrefs)}
          className="flex items-center gap-2 bg-saffron text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
        >
          <Save size={16} /> Save Preferences
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <WeightSlider 
          icon={<Briefcase size={18} />} 
          label="Job / Career" 
          value={localPrefs.job} 
          onChange={v => handleChange('job', v)} 
          color="text-peacock"
        />
        <WeightSlider 
          icon={<GraduationCap size={18} />} 
          label="Education" 
          value={localPrefs.education} 
          onChange={v => handleChange('education', v)} 
          color="text-peacock"
        />
        <WeightSlider 
          icon={<Coins size={18} />} 
          label="Income" 
          value={localPrefs.income} 
          onChange={v => handleChange('income', v)} 
          color="text-gold"
        />
        <WeightSlider 
          icon={<Users size={18} />} 
          label="Family Background" 
          value={localPrefs.familyBackground} 
          onChange={v => handleChange('familyBackground', v)} 
          color="text-vermilion"
        />
        <WeightSlider 
          icon={<Sparkles size={18} />} 
          label="Horoscope / Kundli" 
          value={localPrefs.horoscope} 
          onChange={v => handleChange('horoscope', v)} 
          color="text-saffron"
        />
        
        <div className="flex flex-col items-center justify-center p-6 bg-ivory/20 rounded-2xl border border-dashed border-gold/30">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Weightage</p>
           <p className={`text-3xl font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-vermilion'}`}>{totalWeight}%</p>
           <p className="text-[10px] text-gray-400 text-center mt-2 px-4 italic">Recommended: Keep total sum near 100% for balanced matching.</p>
        </div>
      </div>
    </div>
  );
};

const WeightSlider = ({ icon, label, value, onChange, color }: { icon: any, label: string, value: number, onChange: (v: number) => void, color: string }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm font-bold text-gray-700">{label}</span>
      </div>
      <span className={`text-sm font-bold ${color}`}>{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={e => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 bg-ivory rounded-lg appearance-none cursor-pointer accent-vermilion"
    />
  </div>
);

import React from 'react';
import { Search, MapPin, Briefcase, GraduationCap, Users } from 'lucide-react';

export const FilterPanel: React.FC = () => {
  return (
    <div className="bg-white border-r border-[#E0D5C1] p-6 space-y-6 sticky top-24 min-h-[calc(100vh-110px)]">
      <h3 className="text-xs font-serif font-bold text-vermilion uppercase tracking-widest border-b border-ivory pb-2">
        Quick Search | खोज
      </h3>
      
      <div className="space-y-4">
        {/* Community */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">
            Community / Caste
          </label>
          <select className="w-full bg-ivory border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all">
            <option>Brahmin - Iyer</option>
            <option>Kshatriya</option>
            <option>Vaishya</option>
          </select>
        </div>

        {/* Gotra */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">
            Gotra
          </label>
          <input 
            type="text" 
            placeholder="Enter Gotra..."
            className="w-full bg-ivory border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all"
          />
        </div>

        {/* Education */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">
            Education
          </label>
          <select className="w-full bg-ivory border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all">
            <option>Masters / MBA / PhD</option>
            <option>Bachelors / B.E.</option>
          </select>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">
            Location
          </label>
          <select className="w-full bg-ivory border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all">
            <option>Maharashtra</option>
            <option>Karnataka</option>
            <option>Delhi NCR</option>
          </select>
        </div>

        {/* Income Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">
            Income Range
          </label>
          <select className="w-full bg-ivory border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all">
            <option>Elite ({'>'} 1 Cr PA)</option>
            <option>Normal ({'<'} 1 Cr PA)</option>
          </select>
        </div>

        <button className="w-full bg-saffron text-white py-2.5 rounded shadow-sm font-bold text-xs hover:opacity-90 transition-all mt-4 uppercase tracking-tighter">
          Apply Filters
        </button>
      </div>
    </div>
  );
};


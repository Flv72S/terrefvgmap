
import React from 'react';
import { Search, Filter, ChevronRight, LocateFixed, MapPin } from 'lucide-react';
import { Farm } from '../types';

interface SidebarProps {
  farms: Farm[];
  categories: string[];
  selectedFarmId: string | null;
  onSelectFarm: (farm: Farm) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onNearMe: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  farms, 
  categories,
  selectedFarmId, 
  onSelectFarm, 
  selectedCategory, 
  setSelectedCategory,
  onNearMe
}) => {
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";

  return (
    <aside className="w-full md:w-[400px] h-full bg-white dark:bg-[#1a1614] flex flex-col border-r border-gray-200 dark:border-white/10 z-20 overflow-hidden shadow-xl transition-colors duration-300">
      {/* Search & Filters Area */}
      <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-[13px] uppercase tracking-[0.2em] font-black text-[#43362d] dark:text-[#8d7a6e] mb-4">Esplora il Territorio</h2>
        
        <div className="w-full space-y-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#2a2420] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#43362d] outline-none transition-all appearance-none cursor-pointer text-gray-700 dark:text-gray-200 text-xs font-bold"
            >
              <option value="All">Tutte le categorie</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={onNearMe}
            className="w-full flex items-center justify-center gap-2 bg-[#43362d] hover:bg-[#2d241e] text-white py-3 px-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] text-[11px] uppercase tracking-wider"
          >
            <LocateFixed size={16} />
            Aziende vicino a me
          </button>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar dark:bg-[#1a1614] transition-colors duration-300">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{farms.length} Risultati</span>
        </div>
        
        {farms.length > 0 ? (
          farms.map((farm) => (
            <div 
              key={farm.id}
              onClick={() => onSelectFarm(farm)}
              className={`group flex items-center p-3 rounded-2xl cursor-pointer transition-all border ${
                selectedFarmId === farm.id 
                ? 'bg-[#f7f5f4] dark:bg-[#2a2420] border-[#43362d] dark:border-[#8d7a6e] shadow-md' 
                : 'bg-white dark:bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 mr-4 shadow-sm border dark:border-white/10 bg-gray-100 dark:bg-white/5">
                <img 
                  src={farm.imageUrl} 
                  alt={farm.name} 
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1a1614] ${farm.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 truncate">{farm.name}</h3>
                <p className="text-[10px] text-[#43362d] dark:text-[#8d7a6e] font-black uppercase tracking-tighter">{farm.category}</p>
                <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
                  <MapPin size={10} />
                  <span className="text-[10px] uppercase tracking-wider font-medium text-gray-600 dark:text-gray-400">{farm.comune}</span>
                </div>
              </div>
              <ChevronRight size={18} className={`text-gray-300 dark:text-gray-600 transition-transform ${selectedFarmId === farm.id ? 'translate-x-1 text-[#43362d] dark:text-[#8d7a6e]' : ''}`} />
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Search className="mx-auto text-gray-200 dark:text-gray-800 mb-2" size={32} />
            <p className="text-gray-400 dark:text-gray-600 text-xs font-bold uppercase">Nessuna azienda trovata</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

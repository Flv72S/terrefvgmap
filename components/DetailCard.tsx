
import React, { useState } from 'react';
import { X, Facebook, Instagram, Mail, Sparkles, Send, MapPin, CheckCircle2, Navigation, Phone, Globe, Download } from 'lucide-react';
import { Farm } from '../types';
import { askAboutFarm } from '../services/gemini';

interface DetailCardProps {
  farm: Farm;
  onClose: () => void;
}

const DetailCard: React.FC<DetailCardProps> = ({ farm, onClose }) => {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsAsking(true);
    const answer = await askAboutFarm(farm, question);
    setAiResponse(answer);
    setIsAsking(false);
  };

  // Assicura che l'URL sia assoluto per evitare che venga interpretato come relativo dal browser
  const ensureAbsoluteUrl = (url: string | undefined) => {
    if (!url || url.trim() === "") return undefined;
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    return `https://${cleanUrl}`;
  };

  const portalLink = ensureAbsoluteUrl(farm.portalUrl);
  const qrBaseUrl = portalLink || `https://www.terrefvg.it/azienda/${farm.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrBaseUrl)}`;

  return (
    <div className="absolute inset-y-0 left-0 w-full md:w-[450px] bg-white dark:bg-[#1a1614] shadow-2xl z-[1001] overflow-y-auto no-scrollbar transform animate-slide-in-left flex flex-col border-r border-gray-100 dark:border-white/5 transition-colors duration-300">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-90"
      >
        <X size={24} />
      </button>

      {/* Hero Section (Header Image) */}
      <div className="relative h-72 flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img 
          src={farm.imageUrl} 
          alt={farm.name} 
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#43362d]/90 via-transparent to-transparent pointer-events-none" />
        
        {/* Info Overlay (Bottom Left) */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 pointer-events-none">
          <div className="flex-1 min-w-0">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full mb-3 uppercase tracking-[0.2em] border border-white/30">
              {farm.category}
            </span>
            <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md truncate" title={farm.name}>{farm.name}</h2>
          </div>
          
          {/* Social Icons (Dynamic URLs from Excel) */}
          <div className="flex gap-3 pb-1 flex-shrink-0 pointer-events-auto">
            {farm.socials.fb && (
              <a href={ensureAbsoluteUrl(farm.socials.fb)} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-all hover:scale-110">
                <Facebook size={18} strokeWidth={2} />
              </a>
            )}
            {farm.socials.ig && (
              <a href={ensureAbsoluteUrl(farm.socials.ig)} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-all hover:scale-110">
                <Instagram size={18} strokeWidth={2} />
              </a>
            )}
            {farm.socials.email && (
              <a href={`mailto:${farm.socials.email}`} className="text-white/90 hover:text-white transition-all hover:scale-110">
                <Mail size={18} strokeWidth={2} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8 flex-1">
        {/* Characteristics Tags (From Excel 'tag' column) */}
        <div className="flex flex-wrap gap-2">
          {farm.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-[#f7f5f4] dark:bg-[#2a2420] text-[#43362d] dark:text-[#d2cbc6] text-[9px] font-black rounded-lg border border-[#d2cbc6] dark:border-white/10 uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>

        {/* AI Section */}
        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#43362d] dark:bg-[#8d7a6e] rounded-lg flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <h3 className="font-black text-[11px] uppercase tracking-widest text-[#43362d] dark:text-gray-200">Chiedi all'AI</h3>
          </div>
          <form onSubmit={handleAsk} className="relative mb-4">
            <input 
              type="text" 
              placeholder="Esempio: Cosa posso mangiare qui?" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-[#1a1614] border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#43362d] text-gray-700 dark:text-gray-200 text-xs font-bold"
            />
            <button 
              disabled={isAsking}
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#43362d] dark:bg-[#8d7a6e] text-white rounded-lg flex items-center justify-center hover:bg-[#2d241e] transition-colors disabled:opacity-50 active:scale-95"
            >
              <Send size={16} />
            </button>
          </form>
          {aiResponse && (
            <div className="bg-white dark:bg-[#1a1614] p-4 rounded-xl border border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-gray-400 animate-fade-in leading-relaxed italic border-l-4 border-l-[#43362d]">
              "{aiResponse}"
            </div>
          )}
          {isAsking && (
            <div className="text-center py-2">
              <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-[#43362d] border-r-transparent align-[-0.125em]" />
              <span className="ml-2 text-[10px] font-black text-[#43362d] dark:text-[#8d7a6e] uppercase tracking-tighter">L'AI sta scrivendo...</span>
            </div>
          )}
        </div>

        {/* Description Section (Logo on Right) */}
        <div className="grid grid-cols-3 gap-6 items-start">
          <div className="col-span-2 relative pl-4 border-l-2 border-[#43362d]/10 dark:border-white/10">
            <p className="text-[#43362d] dark:text-gray-300 italic leading-relaxed text-[13px] font-medium">
              "{farm.description}"
            </p>
          </div>
          <div className="col-span-1 flex justify-end">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#f7f5f4] dark:border-white/10 shadow-lg bg-white p-1">
              {farm.logoUrl ? (
                <img src={farm.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div className="w-full h-full bg-[#f7f5f4] flex items-center justify-center text-[#43362d] font-bold text-xs">FVG</div>
              )}
            </div>
          </div>
        </div>

        {/* Excellence Section (From Excel 'prodotti' column) */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-[#43362d] dark:text-gray-100 uppercase tracking-tighter">Prodotti di Eccellenza</h3>
          <div className="grid grid-cols-1 gap-2">
            {farm.products.length > 0 ? farm.products.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#f7f5f4] dark:bg-white/5 p-3 rounded-xl border border-transparent hover:border-[#43362d]/20 transition-colors">
                <CheckCircle2 size={18} className="text-[#43362d] dark:text-[#8d7a6e]" />
                <span className="text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-tight">{p}</span>
              </div>
            )) : (
              <p className="text-xs text-gray-400 italic">Nessun prodotto specificato.</p>
            )}
          </div>
        </div>

        {/* Photo Gallery Section (From Excel 'foto1', 'foto2' columns) */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-[#43362d] dark:text-gray-100 uppercase tracking-tighter">Galleria fotografica</h3>
          <div className="grid grid-cols-2 gap-4">
            {farm.gallery.length > 0 ? farm.gallery.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm">
                <img src={img} alt={`${farm.name} gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            )) : (
              <div className="col-span-2 text-center py-4 text-xs text-gray-400 italic bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed dark:border-white/10">Nessuna foto in galleria.</div>
            )}
          </div>
        </div>

        {/* Contact Info (Style sync with Sidebar) */}
        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f7f5f4] dark:bg-white/5 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-[#43362d] dark:text-[#8d7a6e]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-medium text-gray-600 dark:text-gray-400 mb-0.5">Indirizzo</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-bold">{farm.address}, {farm.comune}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f7f5f4] dark:bg-white/5 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-[#43362d] dark:text-[#8d7a6e]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-medium text-gray-600 dark:text-gray-400 mb-0.5">Telefono</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-bold">{farm.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f7f5f4] dark:bg-white/5 flex items-center justify-center shrink-0">
              <Globe size={18} className="text-[#43362d] dark:text-[#8d7a6e]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-medium text-gray-600 dark:text-gray-400 mb-0.5">Sito Web</p>
              {farm.website ? (
                <a href={ensureAbsoluteUrl(farm.website)} target="_blank" rel="noopener noreferrer" className="text-sm text-[#43362d] dark:text-[#d2cbc6] font-black hover:underline uppercase tracking-tighter">
                  {farm.website.replace(/https?:\/\/(www\.)?/, '')}
                </a>
              ) : (
                <span className="text-sm text-gray-400 italic">Sito non disponibile</span>
              )}
            </div>
          </div>
        </div>

        {/* QR Section (Points to 'link portale') */}
        <div className="bg-[#43362d] dark:bg-[#2a2420] rounded-3xl p-8 flex flex-col items-center gap-5 text-center shadow-xl shadow-[#43362d]/20 dark:shadow-none">
          <div className="bg-white p-4 rounded-2xl shadow-inner">
            <img src={qrUrl} alt="QR Code Badge" className="w-32 h-32" />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-white text-[11px] uppercase tracking-widest">Digital Badge TerreFVG</h3>
            <p className="text-xs text-white/70 max-w-[220px] leading-relaxed">
              Inquadra per la scheda completa sul portale ufficiale <span className="text-white font-bold underline">terrefvg.it</span>
            </p>
          </div>
          <a 
            href={qrUrl} 
            download={`qr-terrefvg-${farm.id}.png`}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-[#43362d] text-[10px] font-black rounded-xl hover:bg-gray-50 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Download size={14} />
            Download PNG
          </a>
        </div>

        {/* CTA Footer */}
        <div className="pt-4 pb-12">
          <button className="w-full py-5 bg-[#43362d] hover:bg-[#2d241e] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#43362d]/30 dark:shadow-none transition-all flex items-center justify-center gap-3 group active:scale-[0.98]">
            Ottieni Indicazioni
            <Navigation size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-left { animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default DetailCard;

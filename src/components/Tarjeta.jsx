import React, { useState } from 'react';
import ModalMenu from './ModalMenu';

export default function Tarjeta({ negocio, esFavorito, onToggleFav }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";

  const abrirMapa = () => {
    const query = encodeURIComponent(`${negocio.nombre} Parral Chihuahua`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative flex flex-col h-full group transition-all duration-500 hover:border-[#8B5CF6]/30 animate-fade-in-up">
        
        {/* BOTÓN FAVORITO */}
        <button 
          onClick={() => onToggleFav(negocio.id)}
          className={`absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-xl w-12 h-12 rounded-[1.25rem] flex items-center justify-center border transition-all shadow-lg hover:scale-110 active:scale-90 ${
            esFavorito ? 'border-yellow-400/50' : 'border-white/20'
          }`}
        >
          <span className={`text-2xl transition-all duration-300 ${esFavorito ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-white/80'}`}>
            ★
          </span>
        </button>

        {/* BOTÓN UBICACIÓN */}
        <button 
          onClick={abrirMapa}
          className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-xl w-12 h-12 rounded-[1.25rem] flex items-center justify-center border border-white/20 hover:scale-110 active:scale-90 transition-all hover:bg-[#8B5CF6]/30 shadow-lg"
        >
          <span className="text-xl">📍</span>
        </button>

        {/* IMAGEN */}
        <div className="h-44 overflow-hidden bg-[#252525] relative flex-shrink-0">
          <img 
            src={negocio.imagen} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt={negocio.nombre}
            onError={(e) => { e.target.src = fallbackImage; }}
          />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#1E1E1E] to-transparent pointer-events-none"></div>
        </div>

        {/* CONTENIDO FLEXIBLE (CRECE SEGÚN DESCRIPCIÓN) */}
        <div className="p-6 pt-4 flex flex-col flex-grow">
          <div className="mb-2">
            <span className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest bg-[#8B5CF6]/10 px-2 py-0.5 rounded">
              {negocio.categoria}
            </span>
          </div>

          <h3 className="text-lg font-black italic uppercase text-white mb-2 leading-none">
            {negocio.nombre}
          </h3>

          <p className="text-gray-400 text-[11px] leading-relaxed mb-6">
            {negocio.descripcion}
          </p>
          
          {/* BOTONES SIEMPRE ABAJO */}
          <div className="flex gap-2 mt-auto">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="flex-1 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase text-white hover:bg-white/10 transition-all border border-white/5"
            >
              Menú
            </button>
            <a 
              href={`https://wa.me/${negocio.telefono}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-3 bg-[#8B5CF6] rounded-xl text-[9px] font-black uppercase text-center text-white hover:bg-[#7C3AED] transition-all"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <ModalMenu 
        negocio={negocio} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
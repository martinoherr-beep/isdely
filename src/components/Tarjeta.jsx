import { useState } from 'react';
import ModalMenu from './ModalMenu';

export default function Tarjeta({ negocio, esFavorito, onToggleFav }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#8B5CF6]/40 transition-all duration-500 shadow-2xl relative flex flex-col h-full group">
        
        {/* Botón Favoritos (Izquierda) */}
        <button 
          onClick={onToggleFav} 
          className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10 hover:scale-110 active:scale-90 transition-all"
        >
          <span className={`text-lg leading-none ${esFavorito ? 'text-yellow-400' : 'text-white/20'}`}>
            {esFavorito ? '⭐' : '☆'}
          </span>
        </button>

        {/* PIN DE UBICACIÓN (Derecha) - CORREGIDO */}
        <a 
          href={negocio.mapa} // <--- Aquí usa la URL de Google Maps de tu data.js
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10 hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition-all group/map"
          onClick={(e) => e.stopPropagation()} // Evita conflictos con otros clics
        >
          <span className="text-lg block group-hover/map:animate-bounce">📍</span>
        </a>

        {/* Imagen */}
        <div className="relative h-52 overflow-hidden">
          <img 
            src={negocio.imagen} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            alt={negocio.nombre} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent" />
        </div>

        <div className="p-7 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-[#8B5CF6] transition-colors italic uppercase tracking-tighter">
            {negocio.nombre}
          </h3>
          
          <div className="flex items-center gap-1.5 mb-4 text-gray-500 italic text-[11px]">
             <span className="text-[#8B5CF6]">●</span> {negocio.ubicacion}
          </div>

          <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-light leading-relaxed">
            {negocio.descripcion}
          </p>
          
          <div className="flex gap-3 mt-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
            >
              Ver Menú
            </button>
            
            <a 
              href={`https://wa.me/${negocio.telefono}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-4 bg-[#8B5CF6] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7C3AED] shadow-lg shadow-[#8B5CF6]/20 transition-all text-center"
            >
              Contacto
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
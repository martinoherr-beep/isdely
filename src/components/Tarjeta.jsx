import { useState } from 'react';
import ModalMenu from './ModalMenu';

export default function Tarjeta({ negocio, esFavorito, onToggleFav }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Imagen de respaldo de alta calidad (Comida japonesa/arroz para el Onigiri si falla)
  const fallbackImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800";

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#8B5CF6]/40 transition-all duration-500 shadow-2xl relative flex flex-col h-full group">
        
        {/* BOTÓN FAVORITOS - Mejorado */}
        <button 
          onClick={onToggleFav} 
          className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
        >
          <span className={`text-lg leading-none ${esFavorito ? 'text-yellow-400' : 'text-white/30'}`}>
            {esFavorito ? '⭐' : '☆'}
          </span>
        </button>

        {/* PIN DE UBICACIÓN - Mejorado */}
        <a 
          href={negocio.mapa} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-[#8B5CF6] transition-all group/map"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-lg block group-hover/map:animate-bounce">📍</span>
        </a>

        {/* CONTENEDOR DE IMAGEN */}
        <div className="relative h-56 w-full bg-[#252525] overflow-hidden">
          <img 
            src={negocio.imagen} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            alt={negocio.nombre} 
            onError={(e) => {
              // Si falla, forzamos la imagen de respaldo
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
          {/* Degradado para que el texto resalte */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent opacity-80" />
          
          <span className="absolute bottom-4 right-6 bg-[#8B5CF6] text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-lg z-10">
            {negocio.categoria}
          </span>
        </div>

        {/* CONTENIDO */}
        <div className="p-8 flex flex-col flex-grow">
          <h3 className="text-2xl font-black mb-2 group-hover:text-[#8B5CF6] transition-colors italic uppercase tracking-tighter">
            {negocio.nombre}
          </h3>
          
          <div className="flex items-center gap-2 mb-4 text-[#8B5CF6] italic text-[10px] font-bold">
             <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse"></span> 
             <span className="text-gray-500">{negocio.ubicacion}</span>
          </div>

          <p className="text-gray-400 text-sm mb-8 line-clamp-2 font-light leading-relaxed h-10">
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
              className="flex-1 py-4 bg-[#8B5CF6] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7C3AED] shadow-lg shadow-[#8B5CF6]/30 transition-all text-center flex items-center justify-center"
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
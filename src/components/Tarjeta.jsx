import { useState } from 'react';
import ModalMenu from './ModalMenu';

export default function Tarjeta({ negocio, esFavorito, onToggleFav }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Esta imagen se mostrará si el link de data.js llega a fallar
  const fallbackImage = "https://images.unsplash.com/photo-1495193653217-a637a7f4fe3c?w=800";

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#8B5CF6]/40 transition-all duration-500 shadow-2xl relative flex flex-col h-full group">
        
        {/* BOTÓN FAVORITOS (Esquina Superior Izquierda) */}
        <button 
          onClick={onToggleFav} 
          className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10 hover:scale-110 active:scale-90 transition-all"
        >
          <span className={`text-lg leading-none ${esFavorito ? 'text-yellow-400' : 'text-white/20'}`}>
            {esFavorito ? '⭐' : '☆'}
          </span>
        </button>

        {/* PIN DE UBICACIÓN (Esquina Superior Derecha) */}
        <a 
          href={negocio.mapa} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10 hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition-all group/map"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-lg block group-hover/map:animate-bounce">📍</span>
        </a>

        {/* CONTENEDOR DE IMAGEN CON FALLBACK */}
        <div className="relative h-52 overflow-hidden">
          <img 
            src={negocio.imagen} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            alt={negocio.nombre} 
            onError={(e) => {
              e.target.onerror = null; // Previene bucles si la imagen de fallback también falla
              e.target.src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent" />
          
          {/* Badge de Categoría */}
          <span className="absolute bottom-4 right-6 bg-[#8B5CF6] text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
            {negocio.categoria}
          </span>
        </div>

        {/* CUERPO DE LA TARJETA */}
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
          
          {/* BOTONES DE ACCIÓN */}
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

      {/* MODAL DEL MENÚ INTERACTIVO */}
      <ModalMenu 
        negocio={negocio} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
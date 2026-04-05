import React from 'react';

export default function Tarjeta({ negocio, esFavorito, onToggleFav, onClick }) {
  const fallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
  const imagenPortada = negocio.imagen || negocio.img || fallback;

  // Enlaces de contacto
  const linkLlamar = `tel:${negocio.telefono || ''}`;
  const linkWhatsApp = `https://wa.me/${negocio.telefono || ''}`;
  
  // Enlace de Google Maps
  const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${negocio.nombre}, ${negocio.ubicacion || 'Parral'}`)}`;

  const manejarClickTarjeta = () => {
    if (negocio.menuActivo) {
      onClick();
    }
  };

  return (
    <div 
      onClick={manejarClickTarjeta}
      className={`bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden border shadow-2xl group transition-all duration-500 flex flex-col h-full relative ${
        negocio.prioridad > 0 
        ? 'border-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.15)]' 
        : 'border-white/5 hover:border-[#8B5CF6]/40'
      } ${negocio.menuActivo ? 'cursor-pointer' : 'cursor-default'}`}
    >
      
      {/* SECCIÓN IMAGEN */}
      <div className="relative h-60 overflow-hidden shrink-0">
        <img 
          src={imagenPortada} 
          className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-110"
          onError={(e) => e.target.src = fallback}
          alt={negocio.nombre}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-90" />
    
        {/* ETIQUETA PREMIUM ABAJO A LA DERECHA */}
        {negocio.prioridad > 0 && (
          <div className="absolute bottom-4 right-4 bg-[#8B5CF6] text-white text-[8px] font-black px-4 py-2 rounded-xl tracking-[0.2em] z-30 shadow-2xl border border-white/10 uppercase italic">
            Premium
          </div>
        )}

        {/* Badge de Promo */}
        {negocio.promo && (
          <div className="absolute top-6 left-6 bg-[#8B5CF6] px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse z-20">
            🔥 Promo Activa
          </div>
        )}

        {/* Botón Favorito */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            onToggleFav(negocio.id);
          }} 
          className={`absolute top-6 right-6 w-12 h-12 rounded-full border backdrop-blur-md flex items-center justify-center transition-all z-20 shadow-xl ${
            esFavorito ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' : 'bg-black/40 border-white/10 text-white/50 hover:border-white/30'
          }`}
        >
          <span className="text-lg">{esFavorito ? '⭐' : '☆'}</span>
        </button>
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="p-8 flex flex-col flex-1">
        
        {/* MULTI-CATEGORÍAS DINÁMICAS */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
           <div className={`h-[2px] w-4 ${negocio.prioridad > 0 ? 'bg-white' : 'bg-[#8B5CF6]'}`}></div>
           {Array.isArray(negocio.categoria) ? (
             negocio.categoria.map((cat, i) => (
               <span 
                 key={i} 
                 className={`${negocio.prioridad > 0 ? 'text-white border-white/20' : 'text-[#8B5CF6] border-[#8B5CF6]/20'} text-[9px] font-black uppercase tracking-[0.2em] border px-2 py-0.5 rounded-md bg-white/5`}
               >
                 {cat}
               </span>
             ))
           ) : (
             <span className={`${negocio.prioridad > 0 ? 'text-white' : 'text-[#8B5CF6]'} text-[10px] font-black uppercase tracking-[0.3em]`}>
               {negocio.categoria}
             </span>
           )}
        </div>
        
        <h3 className="text-3xl font-black italic uppercase text-white mb-4 leading-none tracking-tighter">
          {negocio.nombre}
        </h3>

        {negocio.descripcion && (
          <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6">
            {negocio.descripcion}
          </p>
        )}

        {/* BOTÓN DE UBICACIÓN */}
        <a 
          href={linkMaps}
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={(e) => e.stopPropagation()} 
          className="flex items-center gap-3.5 bg-[#2A2A2A]/40 hover:bg-[#8B5CF6]/10 p-3.5 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all mb-6 group/loc"
        >
          <div className="w-9 h-9 bg-[#121212] rounded-xl border border-white/10 flex items-center justify-center shrink-0 group-hover/loc:bg-[#8B5CF6] transition-colors shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#8B5CF6] group-hover/loc:text-white transition-colors">
              <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.847 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tight truncate group-hover/loc:text-white transition-colors">
              {negocio.ubicacion || "Ubicación en el mapa"}
            </p>
          </div>
        </a>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex gap-2.5 mt-auto">
          {negocio.menuActivo && (
            <button 
              onClick={(e) => { e.stopPropagation(); onClick(); }} 
              className="flex-[2] py-4 bg-white/5 hover:bg-[#8B5CF6] border border-white/10 hover:border-[#8B5CF6] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-white shadow-lg active:scale-95"
            >
              Ver Menú
            </button>
          )}

          <a 
            href={linkLlamar}
            onClick={(e) => e.stopPropagation()}
            className="w-14 h-14 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l.515 2.061a1.91 1.91 0 0 1-.54 1.811l-1.17 1.17a18.845 18.845 0 0 0 7.437 7.437l1.17-1.17a1.91 1.91 0 0 1 1.811-.54l2.061.515c.834.209 1.42.959 1.42 1.819V19.5a3 3 0 0 1-3 3h-2.25a16.5 16.5 0 0 1-16.5-16.5V4.5Z" clipRule="evenodd" />
            </svg>
          </a>

          <a 
            href={linkWhatsApp} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()}
            className="w-14 h-14 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/20 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.4 1.388 5.431 1.389 5.4 0 9.791-4.391 9.793-9.793.001-2.618-1.018-5.078-2.871-6.931-1.854-1.853-4.314-2.87-6.932-2.87-5.402 0-9.792 4.39-9.795 9.792-.001 2.103.547 4.154 1.588 5.95l-.127.466-.632 2.303 2.357-.618.441-.129-.453.251z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
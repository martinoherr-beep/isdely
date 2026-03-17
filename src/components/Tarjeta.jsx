import React, { useState } from 'react';
import ModalMenu from './ModalMenu';

export default function Tarjeta({ negocio, esFavorito, onToggleFav }) {
  const [modalOpen, setModalOpen] = useState(false);
  const fallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

  const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${negocio.nombre}, ${negocio.ubicacion}`)}`;
  const linkWhatsApp = `https://wa.me/${negocio.telefono}`;
  const linkLlamar = `tel:${negocio.telefono}`;

  return (
    <>
      <div className="bg-[#1A1A1A] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl group transition-all duration-300 hover:border-[#8B5CF6]/30">
        
        {/* IMAGEN CON DEGRADADO */}
        <div className="relative h-60 overflow-hidden">
          <img 
            src={negocio.img || fallback} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" 
            onError={(e)=>e.target.src=fallback}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-90 z-10" />

          {/* ESTRELLA */}
          <button 
            onClick={()=>onToggleFav(negocio.id)} 
            className={`absolute top-4 right-4 w-10 h-10 aspect-square rounded-full border backdrop-blur-md flex items-center justify-center transition-all z-20 ${
              esFavorito ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' : 'bg-black/40 border-white/10 text-white/50'
            }`}
          >
            <span className="leading-none text-sm">{esFavorito ? '⭐' : '☆'}</span>
          </button>

          {negocio.promo && (
            <div className="absolute top-4 left-4 bg-[#8B5CF6] px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse z-20">
              Promo Activa
            </div>
          )}
        </div>

        {/* CUERPO DE LA TARJETA */}
        <div className="p-6">
          <span className="text-[#8B5CF6] text-[9px] font-black uppercase tracking-[0.2em]">
            {negocio.categoria}
          </span>
          
          <h3 className="text-2xl font-black italic uppercase text-white mt-1 mb-4 leading-tight">
            {negocio.nombre}
          </h3>

          {/* 1. UBICACIÓN (Sola para que no se pierda el texto) */}
          <a href={linkMaps} target="_blank" rel="noopener noreferrer" 
             className="flex items-center gap-2 text-gray-400 hover:text-[#8B5CF6] transition-colors w-full mb-6 group/loc">
            <div className="bg-[#8B5CF6]/10 p-1.5 rounded-lg border border-[#8B5CF6]/20 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#8B5CF6]">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.847 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight truncate">
              {negocio.ubicacion}
            </span>
          </a>

          {/* 2. FILA DE ACCIONES (Menú + Contacto rápido) */}
          <div className="flex gap-2">
            {/* BOTÓN PRINCIPAL */}
            <button 
              onClick={()=>setModalOpen(true)} 
              className="flex-1 py-4 bg-white/5 hover:bg-[#8B5CF6] border border-white/10 hover:border-[#8B5CF6] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
              Ver Menú
            </button>

            {/* BOTÓN WHATSAPP RAPIDO */}
            <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" 
               className="w-14 h-14 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/20 rounded-xl flex items-center justify-center transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.284l-.582 2.125 2.185-.573c.945.514 1.956.919 3.141.919 3.181 0 5.765-2.587 5.765-5.768 0-3.181-2.585-5.763-5.766-5.763zm3.845 8.165c-.149.42-.859.768-1.203.821-.296.046-.66.071-1.074-.061-.253-.082-.572-.196-.976-.371-1.721-.747-2.834-2.483-2.92-2.597-.086-.114-.693-.923-.693-1.763 0-.839.442-1.253.599-1.42.158-.168.345-.21.46-.21.115 0 .23 0 .33.007.106.005.249-.04.389.297.145.351.495 1.204.538 1.291.043.087.072.188.014.303-.058.114-.087.188-.173.289-.086.1-.182.223-.26.297-.098.094-.199.197-.085.393.114.196.506.835 1.085 1.35.748.665 1.378.872 1.574.969.196.096.313.08.43.052.118-.028.484-.188.552-.37.067-.181.067-.339.047-.37-.02-.032-.072-.051-.153-.092-.08-.041-.484-.239-.559-.266-.075-.027-.129-.041-.184.041-.054.081-.21.266-.257.32-.047.054-.094.061-.175.02-.08-.041-.34-.125-.648-.399-.239-.214-.401-.478-.448-.561-.047-.083-.005-.128.037-.168.037-.037.081-.095.122-.142.04-.047.054-.081.081-.135.027-.054.014-.101-.007-.142-.021-.04-.184-.442-.252-.607-.067-.16-.14-.139-.191-.141h-.163c-.167 0-.439.063-.67.31-.23.247-.88.859-.88 2.094s.9 2.435 1.024 2.6c.125.165 1.77 2.703 4.288 3.79 2.115.912 2.544.73 3.003.687.459-.044 1.481-.605 1.685-1.189z"/>
              </svg>
            </a>

            {/* BOTÓN LLAMAR RAPIDO */}
            <a href={linkLlamar} 
               className="w-14 h-14 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6] text-[#8B5CF6] hover:text-white border border-[#8B5CF6]/20 rounded-xl flex items-center justify-center transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l.515 2.061a1.91 1.91 0 0 1-.54 1.811l-1.17 1.17a18.845 18.845 0 0 0 7.437 7.437l1.17-1.17a1.91 1.91 0 0 1 1.811-.54l2.061.515c.834.209 1.42.959 1.42 1.819V19.5a3 3 0 0 1-3 3h-2.25a16.5 16.5 0 0 1-16.5-16.5V4.5Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <ModalMenu negocio={negocio} isOpen={modalOpen} onClose={()=>setModalOpen(false)} />
    </>
  );
}
import React, { useState } from 'react';

const MenuModal = ({ negocio, onClose }) => {
  const [nombreCliente, setNombreCliente] = useState(() => localStorage.getItem('isdely_user_name') || "");
  const [metodoEntrega, setMetodoEntrega] = useState("DOMICILIO");
  const [carrito, setCarrito] = useState({});

  if (!negocio) return null;

  const productosRaw = negocio.productos || (negocio.menu && negocio.menu[0]?.items) || [];

  const agregarAlCarrito = (p) => {
    setCarrito(prev => ({
      ...prev,
      [p.nombre]: { ...p, cantidad: (prev[p.nombre]?.cantidad || 0) + 1 }
    }));
  };

  const quitarDelCarrito = (nombre) => {
    setCarrito(prev => {
      const nuevo = { ...prev };
      if (nuevo[nombre].cantidad > 1) {
        nuevo[nombre] = { ...nuevo[nombre], cantidad: nuevo[nombre].cantidad - 1 };
      } else {
        delete nuevo[nombre];
      }
      return nuevo;
    });
  };

  const itemsCarrito = Object.values(carrito);
  const totalPagar = itemsCarrito.reduce((acc, p) => acc + (Number(p.precio) * p.cantidad), 0);
  const totalItems = itemsCarrito.reduce((acc, p) => acc + p.cantidad, 0);

  const enviarPedido = () => {
    if (totalItems === 0) return alert("¡Agrega algo al carrito!");
    const lista = itemsCarrito.map(p => `*${p.cantidad}x* ${p.nombre} ($${p.precio * p.cantidad})`).join('\n');
    const mensaje = `¡Hola ${negocio.nombre}!\nSoy *${nombreCliente}*\nPedido para *${metodoEntrega}*:\n\n${lista}\n\n*Total: $${totalPagar}*`;
    window.open(`https://wa.me/${negocio.telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Contenedor más angosto (max-w-md) y compacto */}
      <div className="relative bg-[#0F0F0F] w-full max-w-md h-[85vh] md:h-auto md:max-h-[80vh] rounded-t-[2.5rem] md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border border-white/5">
        
        {/* HEADER MÁS BAJO */}
        <div className="relative h-28 shrink-0">
          <img src={negocio.imagen || negocio.img} className="w-full h-full object-cover opacity-30" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-6 text-white/40 text-xl">✕</button>
          <div className="absolute bottom-3 left-6">
            <h2 className="text-xl font-black italic uppercase text-white tracking-tighter leading-none">{negocio.nombre}</h2>
          </div>
        </div>

        {/* INPUTS MÁS COMPACTOS */}
        <div className="px-6 py-3 space-y-2 bg-white/[0.01]">
          <input 
            type="text" 
            value={nombreCliente} 
            onChange={(e) => {
              setNombreCliente(e.target.value);
              localStorage.setItem('isdely_user_name', e.target.value);
            }}
            placeholder="¿Tu nombre?"
            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl p-3 text-[11px] text-white outline-none focus:border-[#8B5CF6]/50"
          />
          <div className="flex bg-[#1A1A1A] rounded-xl p-1 border border-white/5">
            {['DOMICILIO', 'RECOGER'].map(m => (
              <button 
                key={m} 
                onClick={() => setMetodoEntrega(m)}
                className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${metodoEntrega === m ? 'bg-[#8B5CF6] text-white' : 'text-gray-600'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE PRODUCTOS - TARJETAS MÁS PEQUEÑAS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {productosRaw.map((p, i) => {
            const cantidad = carrito[p.nombre]?.cantidad || 0;
            return (
              <div key={i} className="flex items-center gap-3 bg-[#161616] p-3 rounded-2xl border border-white/5">
                <img src={p.imagen || p.img || "https://via.placeholder.com/80"} className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-lg" alt="" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-black text-white/90 uppercase truncate">{p.nombre}</h4>
                  <p className="text-[#8B5CF6] font-black text-lg leading-none mt-1">${p.precio}</p>
                </div>

                <div className="shrink-0">
                  {cantidad > 0 ? (
                    <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/5">
                      <button onClick={() => quitarDelCarrito(p.nombre)} className="w-7 h-7 flex items-center justify-center text-[#8B5CF6] font-black text-sm">-</button>
                      <span className="w-6 text-center text-[10px] font-black text-white">{cantidad}</span>
                      <button onClick={() => agregarAlCarrito(p)} className="w-7 h-7 flex items-center justify-center bg-[#8B5CF6] text-white rounded-full font-black text-sm">+</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => agregarAlCarrito(p)}
                      className="w-10 h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    >
                      <span className="text-xl font-black">+</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER MÁS PEQUEÑO */}
        <div className="p-6 bg-[#0F0F0F] border-t border-white/5">
          <div className="flex justify-between items-end mb-4 px-2">
            <div>
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Total</p>
              <p className="text-4xl font-black text-white italic tracking-tighter leading-none">${totalPagar}</p>
            </div>
            <div className="bg-[#8B5CF6]/10 px-3 py-1 rounded-full border border-[#8B5CF6]/20">
              <span className="text-[9px] font-black text-[#8B5CF6] uppercase">{totalItems} ITEMS</span>
            </div>
          </div>
          <button 
            onClick={enviarPedido}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white shadow-xl active:scale-95 transition-all"
          >
            Confirmar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
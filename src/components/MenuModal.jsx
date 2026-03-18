import React, { useState } from 'react';

const MenuModal = ({ negocio, onClose }) => {
  const [nombreCliente, setNombreCliente] = useState("Martin");
  const [metodoEntrega, setMetodoEntrega] = useState("DOMICILIO");
  const [carrito, setCarrito] = useState({});

  if (!negocio) return null;

  // Extraer productos de forma segura
  const productosFinales = negocio.productos || [];

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
        nuevo[nombre].cantidad -= 1;
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
    if (totalItems === 0) return alert("Selecciona productos");
    const lista = itemsCarrito.map(p => `${p.cantidad}x ${p.nombre} ($${p.precio * p.cantidad})`).join('\n');
    const mensaje = `Hola ${negocio.nombre}!\nSoy ${nombreCliente}\nPedido para ${metodoEntrega}:\n\n${lista}\n\nTotal: $${totalPagar}`;
    window.open(`https://wa.me/${negocio.telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#121212] w-full max-w-3xl h-[92vh] md:h-auto md:max-h-[85vh] rounded-t-[3rem] md:rounded-[3rem] border border-white/10 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="relative h-40 shrink-0">
          <img src={negocio.imagen || negocio.img} className="w-full h-full object-cover opacity-30" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-6 right-8 text-white text-2xl font-light">✕</button>
          <div className="absolute bottom-6 left-10">
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">{negocio.nombre}</h2>
            <div className="h-1 w-10 bg-[#8B5CF6] mt-1" />
          </div>
        </div>

        {/* DATOS CLIENTE */}
        <div className="px-8 py-6 grid grid-cols-2 gap-4 bg-white/[0.02] border-y border-white/5">
          <input 
            type="text" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-[#8B5CF6]"
            placeholder="Tu nombre"
          />
          <div className="flex bg-[#1A1A1A] rounded-2xl p-1 border border-white/10">
            {['DOMICILIO', 'RECOGER'].map(m => (
              <button key={m} onClick={() => setMetodoEntrega(m)} className={`flex-1 text-[9px] font-black py-3 rounded-xl transition-all ${metodoEntrega === m ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{m}</button>
            ))}
          </div>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
          {productosFinales.length > 0 ? productosFinales.map((item, i) => {
            const cant = carrito[item.nombre]?.cantidad || 0;
            return (
              <div key={i} className="flex items-center gap-4 bg-[#1A1A1A]/50 p-4 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all">
                <img src={item.imagen || item.img || "https://via.placeholder.com/150"} className="w-16 h-16 rounded-2xl object-cover border border-white/5" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white uppercase truncate">{item.nombre}</h4>
                  <p className="text-[#8B5CF6] font-black text-xl">${item.precio}</p>
                </div>

                {/* SELECTOR */}
                <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  {cant > 0 ? (
                    <>
                      <button onClick={() => quitarDelCarrito(item.nombre)} className="w-9 h-9 flex items-center justify-center text-[#8B5CF6] font-black hover:bg-white/5 rounded-xl transition-all">-</button>
                      <span className="w-8 text-center text-xs font-black text-white">{cant}</span>
                      <button onClick={() => agregarAlCarrito(item)} className="w-9 h-9 flex items-center justify-center bg-[#8B5CF6] text-white rounded-xl shadow-lg shadow-purple-500/20 font-black">+</button>
                    </>
                  ) : (
                    <button onClick={() => agregarAlCarrito(item)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-[#8B5CF6] text-white rounded-xl transition-all font-black text-lg">+</button>
                  )}
                </div>
              </div>
            );
          }) : (
            <p className="text-center text-gray-500 text-xs py-10 uppercase font-black tracking-widest">El menú está vacío</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-[#121212] border-t border-white/5">
          <div className="flex justify-between items-center mb-6 px-2">
            <div>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total</p>
              <p className="text-4xl font-black text-white italic tracking-tighter">${totalPagar}</p>
            </div>
            <div className="bg-[#8B5CF6] px-5 py-2 rounded-full shadow-lg shadow-purple-500/20">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{totalItems} ITEMS</span>
            </div>
          </div>
          <button onClick={enviarPedido} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] text-white shadow-2xl transition-all active:scale-95">Confirmar Pedido</button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
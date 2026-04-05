import React, { useState, useMemo, useCallback } from 'react';

// Sub-componente optimizado para cada ítem del menú
// Sub-componente optimizado con descripción completa
const MiembroMenu = React.memo(({ item, cantidad, onAdd, onRemove }) => {
  return (
    <div className="group relative flex items-start gap-3 bg-[#161616] p-4 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all duration-300">
      <img 
        src={item.imagen || "https://via.placeholder.com/80"} 
        className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-lg" 
        alt={item.nombre} 
      />
      
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-1">
          {item.nombre}
        </h4>
        
        {/* --- DESCRIPCIÓN COMPLETA (Sin cortes) --- */}
        {item.descripcionProducto && (
          <p className="text-[9px] text-gray-500 leading-normal mb-2 italic uppercase font-bold break-words">
            {item.descripcionProducto}
          </p>
        )}
        {/* -------------------------------------- */}

        <p className="text-[#8B5CF6] font-black text-lg leading-none">${item.precio}</p>
      </div>

      <div className="shrink-0 pt-1">
        {cantidad > 0 ? (
          <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/5 shadow-inner">
            <button onClick={() => onRemove(item.nombre)} className="w-7 h-7 flex items-center justify-center text-[#8B5CF6] font-black text-sm">-</button>
            <span className="w-6 text-center text-[10px] font-black text-white">{cantidad}</span>
            <button onClick={() => onAdd(item)} className="w-7 h-7 flex items-center justify-center bg-[#8B5CF6] text-white rounded-full font-black text-sm">+</button>
          </div>
        ) : (
          <button 
            onClick={() => onAdd(item)}
            className="w-10 h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <span className="text-xl font-black">+</span>
          </button>
        )}
      </div>
    </div>
  );
});

const MenuModal = ({ negocio, onClose }) => {
  const [nombreCliente, setNombreCliente] = useState(() => localStorage.getItem('isdely_user_name') || "");
  const [metodoEntrega, setMetodoEntrega] = useState("DOMICILIO");
  const [carrito, setCarrito] = useState({});
  const [verCarrito, setVerCarrito] = useState(false); // <--- NUEVO ESTADO

  if (!negocio) return null;

  const productosAgrupados = useMemo(() => {
    const productos = negocio.productos || [];
    return productos.reduce((acc, p) => {
      const cat = p.categoriaInterna || "GENERAL";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    }, {});
  }, [negocio.productos]);

  const agregarAlCarrito = useCallback((p) => {
    setCarrito(prev => ({
      ...prev,
      [p.nombre]: { ...p, cantidad: (prev[p.nombre]?.cantidad || 0) + 1 }
    }));
  }, []);

  const quitarDelCarrito = useCallback((nombre) => {
    setCarrito(prev => {
      if (!prev[nombre]) return prev;
      const nuevo = { ...prev };
      if (nuevo[nombre].cantidad > 1) {
        nuevo[nombre] = { ...nuevo[nombre], cantidad: nuevo[nombre].cantidad - 1 };
      } else {
        delete nuevo[nombre];
      }
      return nuevo;
    });
  }, []);

  const itemsCarrito = useMemo(() => Object.values(carrito), [carrito]);
  const totalPagar = useMemo(() => itemsCarrito.reduce((acc, p) => acc + (Number(p.precio) * p.cantidad), 0), [itemsCarrito]);
  const totalItems = useMemo(() => itemsCarrito.reduce((acc, p) => acc + p.cantidad, 0), [itemsCarrito]);

  const enviarPedido = () => {
    if (!nombreCliente.trim()) return alert("Por favor, ingresa tu nombre");
    if (totalItems === 0) return alert("Tu carrito está vacío");

    const detalleProductos = itemsCarrito
      .map(p => `• *${p.cantidad}x* ${p.nombre.toUpperCase()} (_$${p.precio * p.cantidad}_)`)
      .join('\n');

    const mensaje = [
      `*📦 NUEVO PEDIDO - ${negocio.nombre.toUpperCase()}*`,
      `━━━━━━━━━━━━━━`,
      `*CLIENTE:* ${nombreCliente.trim().toUpperCase()}`,
      `*MÉTODO:* ${metodoEntrega}`,
      ``,
      `*DETALLE:*`,
      detalleProductos,
      ``,
      `*TOTAL A COBRAR: $${totalPagar}*`,
      `━━━━━━━━━━━━━━`,
      `_Pedido enviado vía Isdely Digital_`
    ].join('\n');

    const url = `https://wa.me/${negocio.telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#0F0F0F] w-full md:max-w-2xl h-full md:h-[90vh] md:rounded-[3rem] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x border-t md:border border-white/5">
        
        {/* HEADER */}
        <div className="relative h-40 shrink-0">
          <img src={negocio.imagen || negocio.img} className="w-full h-full object-cover opacity-40" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-black/40" />
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/50 backdrop-blur-xl rounded-full text-white text-xl transition-all">✕</button>
          <div className="absolute bottom-5 left-8">
            <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.4em] mb-1">Menú Digital</p>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">{negocio.nombre}</h2>
          </div>
        </div>

        {/* INPUTS CLIENTE */}
        <div className="px-8 py-4 space-y-3 bg-[#121212]/50 border-b border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              type="text" value={nombreCliente} 
              onChange={(e) => {
                setNombreCliente(e.target.value);
                localStorage.setItem('isdely_user_name', e.target.value);
              }}
              placeholder="Escribe tu nombre..."
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-[#8B5CF6] transition-colors"
            />
            <div className="flex bg-[#1A1A1A] rounded-2xl p-1.5 border border-white/10">
              {['DOMICILIO', 'RECOGER'].map(m => (
                <button key={m} onClick={() => setMetodoEntrega(m)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${metodoEntrega === m ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENEDOR DE PRODUCTOS / VISTA DE CARRITO */}
        <div className="relative flex-1 overflow-hidden">
          
          {/* LISTA DE PRODUCTOS NORMAL */}
          <div className="h-full overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar scroll-smooth">
            {Object.entries(productosAgrupados).map(([categoria, items]) => (
              <div key={categoria} className="space-y-4">
                <h3 className="text-[11px] font-black text-[#8B5CF6] tracking-[0.4em] uppercase pl-2 flex items-center gap-4">
                  {categoria}
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#8B5CF6]/30 to-transparent" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((p, i) => (
                    <MiembroMenu 
                      key={i}
                      item={p}
                      cantidad={carrito[p.nombre]?.cantidad || 0}
                      onAdd={agregarAlCarrito}
                      onRemove={quitarDelCarrito}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* OVERLAY DEL CARRITO (Se desliza desde abajo) */}
          {verCarrito && (
            <div className="absolute inset-0 z-50 bg-[#0F0F0F] animate-in slide-in-from-bottom duration-300 flex flex-col p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Tu Selección</h3>
                <button onClick={() => setVerCarrito(false)} className="text-[#8B5CF6] font-black text-[10px] uppercase">Cerrar ✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                {itemsCarrito.length > 0 ? (
                  itemsCarrito.map((p, i) => (
                    <MiembroMenu 
                      key={i}
                      item={p}
                      cantidad={carrito[p.nombre]?.cantidad || 0}
                      onAdd={agregarAlCarrito}
                      onRemove={quitarDelCarrito}
                    />
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <p className="text-[10px] font-black uppercase italic">Tu carrito está vacío</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-[#0F0F0F] border-t border-white/5 pb-10 md:pb-8">
          <div className="flex justify-between items-center mb-6 px-2">
            <div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Total del pedido</p>
              <p className="text-5xl font-black text-white italic tracking-tighter leading-none">${totalPagar}</p>
            </div>
            
            {/* BOTÓN DE VER CARRITO DINÁMICO */}
            <button 
              onClick={() => setVerCarrito(!verCarrito)}
              className={`flex flex-col items-end gap-1 transition-all active:scale-95 ${totalItems > 0 ? 'opacity-100' : 'opacity-30'}`}
            >
              <div className="bg-[#8B5CF6]/10 px-4 py-2 rounded-full border border-[#8B5CF6]/20">
                <span className="text-[10px] font-black text-[#8B5CF6] uppercase">
                   {verCarrito ? 'VOLVER AL MENÚ' : `${totalItems} PRODUCTOS 🛒`}
                </span>
              </div>
            </button>
          </div>
          
          <button 
            onClick={enviarPedido}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)] active:scale-95 transition-all"
          >
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
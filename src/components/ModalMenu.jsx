import React, { useState, useEffect } from 'react';

export default function ModalMenu({ negocio, isOpen, onClose }) {
  const [carrito, setCarrito] = useState({});
  const [metodoEntrega, setMetodoEntrega] = useState('DOMICILIO');
  
  // Estado para el nombre con persistencia en localStorage
  const [nombreUsuario, setNombreUsuario] = useState(() => {
    return localStorage.getItem("isdely_user_name") || '';
  });

  // Guardar el nombre cada vez que cambie
  useEffect(() => {
    localStorage.setItem("isdely_user_name", nombreUsuario);
  }, [nombreUsuario]);

  if (!isOpen) return null;

  const agregarUno = (id) => {
    setCarrito(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const quitarUno = (id) => {
    setCarrito(prev => {
      const nuevaCant = (prev[id] || 0) - 1;
      if (nuevaCant <= 0) {
        const { [id]: _, ...resto } = prev;
        return resto;
      }
      return { ...prev, [id]: nuevaCant };
    });
  };

  const totalItems = Object.values(carrito).reduce((a, b) => a + b, 0);
  const precioTotal = negocio.productos.reduce((acc, prod) => {
    const cantidad = carrito[prod.id] || 0;
    return acc + (prod.precio * cantidad);
  }, 0);

  const enviarPedido = () => {
    if (totalItems === 0 || !nombreUsuario.trim()) return;

    let mensaje = `*NUEVO PEDIDO - ISDELY*\n`;
    mensaje += `--------------------------\n`;
    mensaje += `👤 *CLIENTE:* ${nombreUsuario.toUpperCase()}\n`;
    mensaje += `📍 *TIPO:* ${metodoEntrega === 'DOMICILIO' ? 'DOMICILIO' : 'PASO POR ÉL'}\n`;
    mensaje += `--------------------------\n`;
    
    negocio.productos.forEach(prod => {
      const cant = carrito[prod.id];
      if (cant > 0) {
        mensaje += `• ${cant}x ${prod.nombre} ($${prod.precio * cant})\n`;
      }
    });

    mensaje += `--------------------------\n`;
    mensaje += `*TOTAL ESTIMADO: $${precioTotal}*\n`;
    mensaje += `\n_Pedido enviado desde Isdely App_`;

    const url = `https://wa.me/${negocio.telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4">
      <div className="bg-[#1A1A1A] w-full max-w-lg rounded-t-[3rem] md:rounded-[3rem] border-t border-white/10 overflow-hidden flex flex-col max-h-[95vh] shadow-2xl">
        
        {/* Cabecera */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#1A1A1A]">
          <div>
            <h2 className="text-2xl font-black italic uppercase text-white leading-none">{negocio.nombre}</h2>
            <p className="text-[#8B5CF6] text-[9px] font-black uppercase tracking-[0.2em] mt-2">Personaliza tu orden</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors">✕</button>
        </div>

        {/* Productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {negocio.productos.map((producto) => (
            <div key={producto.id} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center gap-4">
              <img src={producto.img} alt={producto.nombre} className="w-16 h-16 rounded-2xl object-cover bg-black border border-white/5" />
              <div className="flex-1">
                <h4 className="text-white font-bold text-[11px] uppercase italic mb-1 leading-none">{producto.nombre}</h4>
                <p className="text-[#8B5CF6] font-black text-xs">${producto.precio}</p>
              </div>
              <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                <button onClick={() => quitarUno(producto.id)} className="w-8 h-8 rounded-xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10">-</button>
                <span className="text-white font-black text-xs min-w-[20px] text-center">{carrito[producto.id] || 0}</span>
                <button onClick={() => agregarUno(producto.id)} className="w-8 h-8 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer del Pedido */}
        <div className="p-8 bg-black/40 border-t border-white/10 space-y-5">
          
          {/* Nombre con guardado automático */}
          <div className="space-y-2">
            <label className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em] ml-1">¿A nombre de quién?</label>
            <input 
              type="text" 
              placeholder="Escribe tu nombre aquí..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all font-bold"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
          </div>

          {/* Selector de Entrega */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setMetodoEntrega('DOMICILIO')}
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${metodoEntrega === 'DOMICILIO' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}
            >
              🛵 Domicilio
            </button>
            <button 
              onClick={() => setMetodoEntrega('RECOGER')}
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${metodoEntrega === 'RECOGER' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}
            >
              🥡 Recoger
            </button>
          </div>

          {/* Total y Botón */}
          <div className="flex justify-between items-end pt-2">
            <div className="flex flex-col">
              <span className="text-gray-600 text-[9px] font-black uppercase mb-1">Total del pedido</span>
              <span className="text-white text-3xl font-black italic tracking-tighter leading-none">${precioTotal}</span>
            </div>
          </div>

          <button 
            onClick={enviarPedido}
            disabled={totalItems === 0 || !nombreUsuario.trim()}
            className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
              totalItems > 0 && nombreUsuario.trim()
              ? 'bg-[#8B5CF6] text-white shadow-xl shadow-[#8B5CF6]/20 active:scale-95' 
              : 'bg-white/5 text-white/10 cursor-not-allowed'
            }`}
          >
            {totalItems === 0 
              ? 'Agrega productos' 
              : !nombreUsuario.trim() 
                ? 'Falta tu nombre' 
                : '✅ Confirmar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

export default function ModalMenu({ negocio, isOpen, onClose }) {
  const [nombre, setNombre] = useState(localStorage.getItem('user_name') || '');
  const [metodo, setMetodo] = useState('DOMICILIO');
  const [carrito, setCarrito] = useState([]);

  // Imagen por defecto
  const fallbackMenuImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop";

  useEffect(() => {
    localStorage.setItem('user_name', nombre);
  }, [nombre]);

  if (!isOpen) return null;

  const toggleProducto = (prod) => {
    const existe = carrito.find(p => p.id === prod.id);
    if (existe) {
      setCarrito(carrito.filter(p => p.id !== prod.id));
    } else {
      setCarrito([...carrito, prod]);
    }
  };

  const total = carrito.reduce((sum, p) => sum + p.precio, 0);

  const enviarPedido = () => {
    if (!nombre) return alert("Por favor, ingresa tu nombre");
    if (carrito.length === 0) return alert("El carrito está vacío");

    const listaProductos = carrito.map(p => `• ${p.nombre} ($${p.precio})`).join('\n');
    const mensaje = encodeURIComponent(
      `*NUEVO PEDIDO - ISDELY*\n\n` +
      `*Cliente:* ${nombre}\n` +
      `*Entrega:* ${metodo}\n` +
      `*Local:* ${negocio.nombre}\n\n` +
      `*PRODUCTOS:*\n${listaProductos}\n\n` +
      `*TOTAL:* $${total}\n\n` +
      `_Enviado desde el Directorio Isdely_`
    );
    window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-4">
      <div className="bg-[#1A1A1A] w-full max-w-3xl max-h-[95vh] overflow-hidden rounded-t-[3rem] md:rounded-[3rem] border border-white/10 flex flex-col shadow-2xl">
        
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#1A1A1A] z-10 sticky top-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black italic uppercase text-white leading-none tracking-tight">{negocio.nombre}</h2>
            <p className="text-[#8B5CF6] text-[10px] md:text-xs font-bold tracking-widest uppercase mt-1">Menú Interactivo</p>
          </div>
          <button onClick={onClose} className="bg-white/10 w-10 h-10 rounded-full text-white text-xl hover:bg-white/20 transition-colors">✕</button>
        </div>

        {/* CONTENIDO SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
          
          {/* DATOS DEL CLIENTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/5">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block ml-1 tracking-widest">Tu Nombre</label>
              <input 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="¿A nombre de quién?"
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white text-sm focus:border-[#8B5CF6] outline-none transition-all placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block ml-1 tracking-widest">Método de Entrega</label>
              <div className="flex gap-2">
                {['DOMICILIO', 'RECOGER'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMetodo(m)}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black transition-all border ${
                      metodo === m 
                      ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30' 
                      : 'bg-black/40 border-white/10 text-gray-500'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LISTA DE PRODUCTOS POR CATEGORÍA */}
          {negocio.menu?.map((seccion, idx) => (
            <div key={idx}>
              <h3 className="text-[#8B5CF6] text-xs font-black mb-6 tracking-[0.2em] uppercase border-l-4 border-[#8B5CF6] pl-4">
                {seccion.categoria}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {seccion.items.map((prod) => {
                  const seleccionado = carrito.find(p => p.id === prod.id);
                  return (
                    <button 
                      key={prod.id}
                      onClick={() => toggleProducto(prod)}
                      className={`flex items-center p-3 rounded-2xl border transition-all text-left group gap-4 relative overflow-hidden ${
                        seleccionado 
                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#252525]">
                        <img 
                          src={prod.img || fallbackMenuImage} 
                          alt={prod.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = fallbackMenuImage; }}
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1 h-full">
                        <h4 className={`text-xs md:text-sm font-bold uppercase italic tracking-tight mb-1 line-clamp-2 ${seleccionado ? 'text-[#8B5CF6]' : 'text-white'}`}>
                          {prod.nombre}
                        </h4>
                        <div className="flex justify-between items-end mt-auto">
                          <span className={`font-black text-sm md:text-base ${seleccionado ? 'text-white' : 'text-gray-300'}`}>
                            ${prod.precio}
                          </span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                            seleccionado 
                            ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' 
                            : 'border-white/20 text-transparent'
                          }`}>
                            ✓
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-6 md:p-8 border-t border-white/5 bg-[#1A1A1A] sticky bottom-0 z-10">
          <div className="flex justify-between items-end mb-6 px-1">
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total del Pedido</p>
              <p className="text-3xl md:text-4xl font-black italic text-white leading-none">${total}</p>
            </div>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              {carrito.length} Items
            </p>
          </div>
          
          <button 
            onClick={enviarPedido}
            className="w-full py-5 bg-[#8B5CF6] text-white rounded-[1.5rem] font-black uppercase text-xs md:text-sm tracking-[0.2em] hover:bg-[#7C3AED] transition-all shadow-xl shadow-[#8B5CF6]/30 active:scale-[0.98]"
          >
            Confirmar Pedido vía WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
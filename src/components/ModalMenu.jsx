import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // IMPORTANTE

export default function ModalMenu({ negocio, isOpen, onClose }) {
  const [nombre, setNombre] = useState(localStorage.getItem('user_name') || '');
  const [metodo, setMetodo] = useState('DOMICILIO');
  const [carrito, setCarrito] = useState([]);

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
    if (!nombre) return alert("Por favor, ingresa tu nombre para el pedido.");
    if (carrito.length === 0) return alert("Tu carrito está vacío.");

    // Formateamos la lista de productos con un check para que se vea pro
    const lista = carrito.map(p => `✅ *${p.nombre}* ($${p.precio})`).join('\n');

    // CONSTRUCCIÓN DEL MENSAJE (Aquí ya incluimos el método)
    const mensaje = encodeURIComponent(
`*NUEVO PEDIDO DESDE ISDELY.* 🚀

*CLIENTE:* ${nombre}
*LOCAL:* ${negocio.nombre}
*ENTREGA:* ${metodo} 🛵

*PRODUCTOS:*
------------------------------
${lista}
------------------------------
💰 *TOTAL: $${total}*

_Favor de confirmar recepción._`
    );

    window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, '_blank');
  };

  // ESTA ES LA MAGIA: El Portal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      
      {/* FONDO OSCURO TOTAL */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* MODAL CONTAINER */}
      <div className="relative bg-[#121212] w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#121212]">
          <div>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tighter leading-none">
              {negocio.nombre}
            </h2>
            <p className="text-[#8B5CF6] text-[10px] font-black uppercase tracking-[0.3em] mt-2">Menú Interactivo</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 text-white hover:bg-white/10 flex items-center justify-center border border-white/10 transition-transform hover:rotate-90">✕</button>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 no-scrollbar">
          
          {/* FORMULARIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] p-6 rounded-[2rem] border border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Tu Nombre</label>
              <input 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="¿A quién entregamos?"
                className="w-full bg-black/60 border border-white/10 p-4 rounded-2xl text-white text-sm focus:border-[#8B5CF6] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Entrega</label>
              <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10">
                {['DOMICILIO', 'RECOGER'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMetodo(m)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${metodo === m ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-500'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LISTADO DE PRODUCTOS */}
          {negocio.menu?.map((seccion, idx) => (
            <div key={idx} className="space-y-6">
              <h3 className="text-white text-xs font-black tracking-[0.3em] uppercase border-l-4 border-[#8B5CF6] pl-4">{seccion.categoria}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {seccion.items.map((prod) => {
                  const seleccionado = carrito.find(p => p.id === prod.id);
                  return (
                    <button 
                      key={prod.id}
                      onClick={() => toggleProducto(prod)}
                      className={`flex items-center p-4 rounded-[1.8rem] border transition-all text-left group gap-5 ${seleccionado ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]' : 'bg-white/[0.03] border-white/5'}`}
                    >
                      <img 
                        src={prod.img || fallbackMenuImage} 
                        className="w-20 h-20 rounded-2xl object-cover bg-black" 
                        onError={(e) => e.target.src = fallbackMenuImage} 
                      />
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold uppercase italic mb-1 ${seleccionado ? 'text-[#8B5CF6]' : 'text-white'}`}>{prod.nombre}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-base font-black text-gray-300">${prod.precio}</span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${seleccionado ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' : 'border-white/10 text-transparent'}`}>✓</div>
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
        <div className="p-6 md:p-8 border-t border-white/5 bg-[#121212]">
          <div className="flex justify-between items-center mb-6 px-2">
            <div>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-1">Total</p>
              <p className="text-4xl font-black italic text-white">${total}</p>
            </div>
            <span className="text-[#8B5CF6] text-[10px] font-black uppercase bg-[#8B5CF6]/10 px-4 py-2 rounded-full border border-[#8B5CF6]/20">{carrito.length} Items</span>
          </div>
          <button 
            onClick={enviarPedido}
            className="w-full py-5 bg-[#8B5CF6] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#8B5CF6]/20 active:scale-[0.98]"
          >
            Confirmar Pedido vía WhatsApp
          </button>
        </div>
      </div>
    </div>,
    document.body // Esto lo manda al final del HTML, fuera de la cuadrícula
  );
}
import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function ModalMenu({ negocio, isOpen, onClose }) {
  const [pedido, setPedido] = useState([]);
  const [mostrarGracias, setMostrarGracias] = useState(false);

  if (!isOpen && !mostrarGracias) return null;

  const agregarAlPedido = (producto) => {
    setPedido([...pedido, producto]);
  };

  const enviarWhatsApp = () => {
    const listaProductos = pedido.map(p => `- ${p.nombre} ($${p.precio})`).join('\n');
    const total = pedido.reduce((sum, p) => sum + p.precio, 0);
    const mensaje = encodeURIComponent(
      `¡Hola ${negocio.nombre}! 👋\nMe gustaría hacer el siguiente pedido desde *Isdely*:\n\n${listaProductos}\n\n━━━━━━━━━━━━━━\n💰 *Total: $${total}*`
    );
    
    window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, '_blank');
    
    // Disparar confeti de éxito
    confetti({
      particleCount: 150,
      velocity: 30,
      spread: 360,
      colors: ['#8B5CF6', '#25D366', '#ffffff']
    });

    // Mostrar mensaje de agradecimiento y limpiar
    setMostrarGracias(true);
    setPedido([]);
    setTimeout(() => {
      setMostrarGracias(false);
      onClose();
    }, 4000); 
  };

  // --- VISTA DE AGRADECIMIENTO ---
  if (mostrarGracias) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in zoom-in duration-300">
        <div className="text-center bg-[#1E1E1E] p-10 rounded-[3rem] border border-[#8B5CF6]/30 shadow-2xl shadow-[#8B5CF6]/20 max-w-sm">
          <div className="text-6xl mb-6 italic">🚀</div>
          <h2 className="text-3xl font-black text-white mb-2 italic">¡Pedido Enviado!</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
            Tu pedido para <span className="text-[#8B5CF6] font-bold">{negocio.nombre}</span> ha sido generado. Revisa tu WhatsApp para finalizar la comunicación.
          </p>
          <div className="text-[#8B5CF6] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
            Gracias por usar Isdely
          </div>
        </div>
      </div>
    );
  }

  // --- EL RESTO DEL MODAL (Lista de productos) SIGUE IGUAL ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
      <div className="bg-[#1E1E1E] w-full max-w-lg rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#8B5CF6]/10 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-white italic">{negocio.nombre}</h2>
            <p className="text-[#8B5CF6] text-[10px] uppercase font-black tracking-widest mt-1">Menú Interactivo</p>
          </div>
          <button onClick={onClose} className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4 flex-grow">
          {negocio.productos?.map(prod => (
            <div key={prod.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-3xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all">
              <img src={prod.img} className="w-20 h-20 rounded-2xl object-cover" alt={prod.nombre} />
              <div className="flex-1">
                <p className="font-bold text-white text-lg">{prod.nombre}</p>
                <p className="text-[#8B5CF6] font-black text-md">${prod.precio}</p>
              </div>
              <button 
                onClick={() => agregarAlPedido(prod)}
                className="bg-[#8B5CF6] h-12 w-12 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              >
                <span className="text-white text-2xl font-bold">+</span>
              </button>
            </div>
          ))}
        </div>

        <div className="p-8 bg-[#252525] border-t border-white/10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400">Items: <span className="text-white font-black">{pedido.length}</span></span>
            <span className="text-xl font-black text-white">Total: <span className="text-[#8B5CF6]">${pedido.reduce((s, p) => s + p.precio, 0)}</span></span>
          </div>
          
          <button 
            disabled={pedido.length === 0}
            onClick={enviarWhatsApp}
            className="w-full py-5 bg-[#25D366] text-black font-black rounded-2xl hover:bg-[#1fb355] disabled:opacity-20 transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#25D366]/10"
          >
            Confirmar pedido vía WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
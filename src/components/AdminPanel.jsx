import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [locales, setLocales] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoNegocio, setNuevoNegocio] = useState({
    nombre: '', categoria: 'RESTAURANTE', promo: '', imagen: '', telefono: '', ubicacion: '', productos: [] 
  });
  
  // Añadimos categoriaInterna al estado temporal del producto
  const [tempProducto, setTempProducto] = useState({ nombre: '', precio: '', imagen: '', categoriaInterna: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsub = onSnapshot(collection(db, "locales"), (snap) => {
      setLocales(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const seleccionarParaEditar = (loc) => {
    setEditandoId(loc.id);
    setNuevoNegocio({ ...loc });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const agregarProductoLista = () => {
    if (!tempProducto.nombre || !tempProducto.precio) return alert("Nombre y precio obligatorios");
    
    // Si no pone categoría, le asignamos 'GENERAL' por defecto
    const categoriaFinal = tempProducto.categoriaInterna.trim() || 'GENERAL';

    setNuevoNegocio({
      ...nuevoNegocio,
      productos: [...(nuevoNegocio.productos || []), { ...tempProducto, categoriaInterna: categoriaFinal.toUpperCase() }]
    });
    
    // Limpiamos los campos para el siguiente producto
    setTempProducto({ nombre: '', precio: '', imagen: '', categoriaInterna: '' });
  };

  const eliminarLocal = async (id) => {
    if(window.confirm("¿Seguro que quieres eliminar este negocio?")) {
      await deleteDoc(doc(db, "locales", id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await updateDoc(doc(db, "locales", editandoId), nuevoNegocio);
        alert("¡Cambios guardados con éxito!");
      } else {
        await addDoc(collection(db, "locales"), nuevoNegocio);
        alert("¡Nuevo local publicado!");
      }
      setEditandoId(null);
      setNuevoNegocio({ nombre: '', categoria: 'RESTAURANTE', promo: '', imagen: '', telefono: '', ubicacion: '', productos: [] });
    } catch (error) {
      alert("Error al procesar");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 mb-24 animate-in fade-in duration-500">
      
      {/* FORMULARIO DE CARGA/EDICIÓN */}
      <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black italic uppercase text-center mb-10 tracking-tighter">
          {editandoId ? 'EDITANDO' : 'PANEL'} <span className="text-[#8B5CF6]">ISDELY</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* FILA 1: NOMBRE Y CATEGORÍA DEL LOCAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Nombre del Local</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white transition-all" value={nuevoNegocio.nombre} onChange={(e) => setNuevoNegocio({...nuevoNegocio, nombre: e.target.value})} placeholder="Ej: Tacos Isdely" required />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Categoría del Local</label>
              <select className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-gray-400 appearance-none transition-all" value={nuevoNegocio.categoria} onChange={(e) => setNuevoNegocio({...nuevoNegocio, categoria: e.target.value})}>
                <option value="RESTAURANTE">RESTAURANTE</option>
                <option value="PARRILLA">PARRILLA</option>
                <option value="MARISCO">MARISCO</option>
                <option value="BAR">BAR</option>
                <option value="POSTRES">POSTRES</option>
              </select>
            </div>
          </div>

          {/* FILA 2: TELÉFONO Y UBICACIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Teléfono (WhatsApp)</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white transition-all" value={nuevoNegocio.telefono} onChange={(e) => setNuevoNegocio({...nuevoNegocio, telefono: e.target.value})} placeholder="627..." required />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Dirección Física</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white transition-all" value={nuevoNegocio.ubicacion} onChange={(e) => setNuevoNegocio({...nuevoNegocio, ubicacion: e.target.value})} placeholder="Av. Independencia..." />
            </div>
          </div>

          {/* FILA 3: PROMO Y PORTADA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Promo Especial</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white transition-all" value={nuevoNegocio.promo} onChange={(e) => setNuevoNegocio({...nuevoNegocio, promo: e.target.value})} placeholder="Ej: 2x1 Martes" />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">URL Portada</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white transition-all" value={nuevoNegocio.imagen} onChange={(e) => setNuevoNegocio({...nuevoNegocio, imagen: e.target.value})} placeholder="https://..." />
            </div>
          </div>

          {/* SECCIÓN ARMADO DE MENÚ: CON CATEGORÍA DE PRODUCTO */}
          <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5 shadow-inner">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-[#8B5CF6]">Armado del Menú</h3>
            
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 block ml-1">Sección (Ej: Bebidas)</label>
                  <input type="text" placeholder="HAMBURGUESAS" className="w-full bg-[#121212] border border-white/5 p-3 rounded-xl text-xs text-white focus:border-[#8B5CF6] outline-none" value={tempProducto.categoriaInterna} onChange={(e) => setTempProducto({...tempProducto, categoriaInterna: e.target.value})} />
                </div>
                <div>
                  <label className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 block ml-1">Nombre Platillo</label>
                  <input type="text" placeholder="Ej: Taco" className="w-full bg-[#121212] border border-white/5 p-3 rounded-xl text-xs text-white focus:border-[#8B5CF6] outline-none" value={tempProducto.nombre} onChange={(e) => setTempProducto({...tempProducto, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 block ml-1">Precio</label>
                  <input type="number" placeholder="0" className="w-full bg-[#121212] border border-white/5 p-3 rounded-xl text-xs text-white focus:border-[#8B5CF6] outline-none" value={tempProducto.precio} onChange={(e) => setTempProducto({...tempProducto, precio: e.target.value})} />
                </div>
                <div>
                  <label className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 block ml-1">URL Foto</label>
                  <input type="text" placeholder="https://..." className="w-full bg-[#121212] border border-white/5 p-3 rounded-xl text-xs text-white focus:border-[#8B5CF6] outline-none" value={tempProducto.imagen} onChange={(e) => setTempProducto({...tempProducto, imagen: e.target.value})} />
                </div>
              </div>

              <button 
                type="button" 
                onClick={agregarProductoLista} 
                className="w-full bg-[#8B5CF6]/10 hover:bg-[#8B5CF6] text-[#8B5CF6] hover:text-white border border-[#8B5CF6]/20 py-4 rounded-xl font-black text-[10px] uppercase transition-all active:scale-[0.98]"
              >
                + Agregar al Menú
              </button>
            </div>

            {/* LISTA PREVIA DE PRODUCTOS */}
            <div className="mt-8 space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {nuevoNegocio.productos?.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 group">
                  <div className="flex items-center gap-3">
                    <span className="text-[7px] bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-1 rounded-md font-black">{p.categoriaInterna || 'GENERAL'}</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-tight">{p.nombre} - <span className="text-[#8B5CF6]">${p.precio}</span></span>
                  </div>
                  <button type="button" onClick={() => setNuevoNegocio({...nuevoNegocio, productos: nuevoNegocio.productos.filter((_, idx) => idx !== i)})} className="text-red-500 px-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] text-white shadow-2xl transition-all active:scale-[0.98]">
            {editandoId ? 'GUARDAR CAMBIOS' : 'PUBLICAR LOCAL Y MENÚ'}
          </button>
          
          {editandoId && (
            <button type="button" onClick={() => {setEditandoId(null); setNuevoNegocio({nombre:'', categoria:'RESTAURANTE', promo:'', imagen:'', telefono:'', ubicacion:'', productos:[]})}} className="w-full text-gray-500 text-[9px] font-black uppercase tracking-widest mt-4">Cancelar Edición</button>
          )}
        </form>
      </div>

      {/* GESTIÓN DE NEGOCIOS */}
      <div className="bg-[#1A1A1A]/60 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8 text-center">Gestión de Negocios</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locales.map(loc => (
            <div key={loc.id} className="bg-[#121212] p-5 rounded-2xl flex justify-between items-center border border-white/5 group hover:border-[#8B5CF6]/30 transition-all">
              <div>
                <p className="text-white font-black text-xs uppercase italic tracking-tighter">{loc.nombre}</p>
                <p className="text-[#8B5CF6] text-[8px] font-bold uppercase tracking-widest">{loc.categoria}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => seleccionarParaEditar(loc)} className="bg-white/5 hover:bg-[#8B5CF6] text-[8px] font-black px-4 py-2.5 rounded-lg transition-all text-white">EDITAR</button>
                <button onClick={() => eliminarLocal(loc.id)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[8px] font-black px-4 py-2.5 rounded-lg transition-all">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
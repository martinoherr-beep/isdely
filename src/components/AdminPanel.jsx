import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [locales, setLocales] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoNegocio, setNuevoNegocio] = useState({
    nombre: '', categoria: 'RESTAURANTE', promo: '', imagen: '', telefono: '', ubicacion: '', productos: [] 
  });
  const [tempProducto, setTempProducto] = useState({ nombre: '', precio: '', imagen: '' });

  // Cargar locales para la lista de edición
  useEffect(() => {
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
    setNuevoNegocio({
      ...nuevoNegocio,
      productos: [...(nuevoNegocio.productos || []), { ...tempProducto }]
    });
    setTempProducto({ nombre: '', precio: '', imagen: '' });
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
    <div className="max-w-4xl mx-auto space-y-12 mb-24">
      
      {/* SECCIÓN 1: FORMULARIO DE CARGA/EDICIÓN */}
      <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black italic uppercase text-center mb-10 tracking-tighter">
          {editandoId ? 'EDITANDO' : 'PANEL'} <span className="text-[#8B5CF6]">ISDELY</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* FILA 1: NOMBRE Y CATEGORÍA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Nombre</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white" value={nuevoNegocio.nombre} onChange={(e) => setNuevoNegocio({...nuevoNegocio, nombre: e.target.value})} placeholder="Ej: Tacos Isdely" required />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Categoría</label>
              <select className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-gray-400 appearance-none" value={nuevoNegocio.categoria} onChange={(e) => setNuevoNegocio({...nuevoNegocio, categoria: e.target.value})}>
                <option value="RESTAURANTE">RESTAURANTE</option>
                <option value="PARRILLA">PARRILLA</option>
                <option value="MARISCO">MARISCO</option>
                <option value="BAR">BAR</option>
              </select>
            </div>
          </div>

          {/* FILA 2: TELÉFONO Y UBICACIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Teléfono</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white" value={nuevoNegocio.telefono} onChange={(e) => setNuevoNegocio({...nuevoNegocio, telefono: e.target.value})} placeholder="627..." required />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Dirección</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white" value={nuevoNegocio.ubicacion} onChange={(e) => setNuevoNegocio({...nuevoNegocio, ubicacion: e.target.value})} placeholder="Av. Independencia..." />
            </div>
          </div>

          {/* FILA 3: PROMO Y PORTADA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">Promo Especial</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white" value={nuevoNegocio.promo} onChange={(e) => setNuevoNegocio({...nuevoNegocio, promo: e.target.value})} placeholder="Ej: 2x1 Martes" />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 mb-2 block">URL Portada</label>
              <input type="text" className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl focus:border-[#8B5CF6] outline-none text-sm text-white" value={nuevoNegocio.imagen} onChange={(e) => setNuevoNegocio({...nuevoNegocio, imagen: e.target.value})} placeholder="https://..." />
            </div>
          </div>

          {/* SECCIÓN PRODUCTOS CON IMAGEN */}
          <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-[#8B5CF6]">Menú / Productos</h3>
            <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6 items-end">
              <div className="flex-[3] w-full md:w-auto">
                <label className="text-[7px] font-black uppercase text-gray-600 ml-1 mb-1 block">Producto</label>
                <input type="text" placeholder="Ej: Tortas" className="w-full bg-[#121212] border border-white/5 p-3 rounded-xl text-xs text-white" value={tempProducto.nombre} onChange={(e) => setTempProducto({...tempProducto, nombre: e.target.value})} />
              </div>
              <div className="w-24">
                <label className="text-[7px] font-black uppercase text-gray-600 ml-1 mb-1 block">Precio</label>
                <input type="number" placeholder="45" className="w-full bg-[#121212] border border-white/5 p-3 rounded-xl text-xs text-white" value={tempProducto.precio} onChange={(e) => setTempProducto({...tempProducto, precio: e.target.value})} />
              </div>
              <div className="flex-[2] w-full md:w-auto">
                <label className="text-[7px] font-black uppercase text-gray-600 ml-1 mb-1 block">URL Foto</label>
                <input type="text" placeholder="https://..." className="w-full bg-[#121212] border border-white/5 p-3 rounded-xl text-xs text-white" value={tempProducto.imagen} onChange={(e) => setTempProducto({...tempProducto, imagen: e.target.value})} />
              </div>
              <button type="button" onClick={agregarProductoLista} className="bg-[#8B5CF6] text-white px-8 h-[42px] rounded-xl font-black text-[12px] uppercase transition-all shrink-0 active:scale-95">+</button>
            </div>

            {/* LISTA DE PRODUCTOS AGREGADOS */}
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {nuevoNegocio.productos?.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 group">
                  <div className="flex items-center gap-3">
                    {p.imagen && <img src={p.imagen} className="w-8 h-8 rounded-lg object-cover" />}
                    <span className="text-[10px] font-bold text-white uppercase">{p.nombre} - <span className="text-[#8B5CF6]">${p.precio}</span></span>
                  </div>
                  <button type="button" onClick={() => setNuevoNegocio({...nuevoNegocio, productos: nuevoNegocio.productos.filter((_, idx) => idx !== i)})} className="text-red-500 text-xs font-bold opacity-30 group-hover:opacity-100 px-2 transition-opacity">✕</button>
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

      {/* SECCIÓN 2: LISTA DE GESTIÓN (Abajo del todo) */}
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
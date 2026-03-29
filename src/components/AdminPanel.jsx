import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [locales, setLocales] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  
  const [nuevoNegocio, setNuevoNegocio] = useState({ 
    nombre: '', 
    categoria: 'RESTAURANTE', 
    promo: '', 
    imagen: '', 
    telefono: '', 
    ubicacion: '', 
    descripcion: '', 
    menuActivo: false,
    productos: [] 
  });

  const [tempProducto, setTempProducto] = useState({ 
    nombre: '', 
    precio: '', 
    imagen: '', 
    categoriaInterna: '',
    descripcionProducto: '' 
  });

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
    const catFinal = (tempProducto.categoriaInterna || 'GENERAL').trim().toUpperCase();
    setNuevoNegocio({ 
      ...nuevoNegocio, 
      productos: [...(nuevoNegocio.productos || []), { ...tempProducto, categoriaInterna: catFinal }] 
    });
    setTempProducto({ nombre: '', precio: '', imagen: '', categoriaInterna: '', descripcionProducto: '' });
  };

  // --- FUNCIÓN PARA ELIMINAR ARTÍCULO DEL MENÚ ---
  const eliminarProductoLista = (indexParaEliminar) => {
    const nuevosProductos = nuevoNegocio.productos.filter((_, index) => index !== indexParaEliminar);
    setNuevoNegocio({
      ...nuevoNegocio,
      productos: nuevosProductos
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await updateDoc(doc(db, "locales", editandoId), nuevoNegocio);
    } else {
      await addDoc(collection(db, "locales"), nuevoNegocio);
    }
    setEditandoId(null);
    setNuevoNegocio({ 
      nombre: '', categoria: 'RESTAURANTE', promo: '', imagen: '', 
      telefono: '', ubicacion: '', descripcion: '', menuActivo: false, productos: [] 
    });
    alert("Operación exitosa");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 mb-24 animate-in fade-in">
      <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black italic uppercase text-center mb-10 tracking-tighter">
          {editandoId ? 'EDITANDO' : 'PANEL'} <span className="text-[#8B5CF6]">ISDELY</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" 
              className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6]" 
              value={nuevoNegocio.nombre} 
              onChange={(e) => setNuevoNegocio({...nuevoNegocio, nombre: e.target.value})} 
              placeholder="Nombre del Local" 
              required 
            />
            <select 
              className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-gray-400 outline-none focus:border-[#8B5CF6]" 
              value={nuevoNegocio.categoria} 
              onChange={(e) => setNuevoNegocio({...nuevoNegocio, categoria: e.target.value})}
            >
                <option value="RESTAURANTE">RESTAURANTE</option>
                <option value="PARRILLA">PARRILLA</option>
                <option value="MARISCO">MARISCO</option>
                <option value="BAR">BAR</option>
                <option value="POSTRES">POSTRES</option>
            </select>
          </div>

          <textarea 
            className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6] text-sm resize-none" 
            rows="3"
            value={nuevoNegocio.descripcion} 
            onChange={(e) => setNuevoNegocio({...nuevoNegocio, descripcion: e.target.value})} 
            placeholder="Descripción del negocio (Historia, especialidad, etc.)" 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6]" value={nuevoNegocio.promo} onChange={(e) => setNuevoNegocio({...nuevoNegocio, promo: e.target.value})} placeholder="Promo (Ej: 2x1 en Alitas)" />
            <input type="text" className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6]" value={nuevoNegocio.imagen} onChange={(e) => setNuevoNegocio({...nuevoNegocio, imagen: e.target.value})} placeholder="URL Imagen Portada" />
            <input type="text" className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6]" value={nuevoNegocio.telefono} onChange={(e) => setNuevoNegocio({...nuevoNegocio, telefono: e.target.value})} placeholder="WhatsApp (Ej: 526271234567)" />
            <input type="text" className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6]" value={nuevoNegocio.ubicacion} onChange={(e) => setNuevoNegocio({...nuevoNegocio, ubicacion: e.target.value})} placeholder="Ubicación (Ej: Av. Independencia #10)" />
          </div>

          <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-[10px] font-black uppercase text-[#8B5CF6] mb-6 tracking-widest">Armado del Menú</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input type="text" placeholder="SECCIÓN (BEBIDAS)" className="bg-[#121212] p-3 rounded-xl text-xs text-white" value={tempProducto.categoriaInterna} onChange={(e) => setTempProducto({...tempProducto, categoriaInterna: e.target.value})} />
                <input type="text" placeholder="PRODUCTO" className="bg-[#121212] p-3 rounded-xl text-xs text-white" value={tempProducto.nombre} onChange={(e) => setTempProducto({...tempProducto, nombre: e.target.value})} />
                <input type="number" placeholder="PRECIO" className="bg-[#121212] p-3 rounded-xl text-xs text-white" value={tempProducto.precio} onChange={(e) => setTempProducto({...tempProducto, precio: e.target.value})} />
                <input type="text" placeholder="URL FOTO" className="bg-[#121212] p-3 rounded-xl text-xs text-white" value={tempProducto.imagen} onChange={(e) => setTempProducto({...tempProducto, imagen: e.target.value})} />
                
                <div className="col-span-1 md:col-span-4 mt-2">
                  <textarea 
                    placeholder="DESCRIPCIÓN DEL PRODUCTO..." 
                    className="w-full bg-[#121212] p-3 rounded-xl text-[10px] text-white outline-none border border-white/5 focus:border-[#8B5CF6]/50 resize-none"
                    rows="2"
                    value={tempProducto.descripcionProducto} 
                    onChange={(e) => setTempProducto({...tempProducto, descripcionProducto: e.target.value})} 
                  />
                </div>
            </div>
            <button type="button" onClick={agregarProductoLista} className="w-full bg-[#8B5CF6]/10 text-[#8B5CF6] py-4 rounded-xl font-black text-[10px] uppercase hover:bg-[#8B5CF6] hover:text-white transition-all">+ Agregar al Menú</button>
            
            {/* VISTA PREVIA CON BOTÓN ELIMINAR */}
            <div className="mt-4 flex flex-wrap gap-2">
                {nuevoNegocio.productos?.map((p, i) => (
                    <div key={i} className="group relative bg-white/5 pl-3 pr-10 py-1.5 rounded-lg border border-white/5 uppercase font-bold text-gray-400 text-[9px] flex items-center">
                        <span>{p.nombre} (${p.precio})</span>
                        <button 
                          type="button"
                          onClick={() => eliminarProductoLista(i)}
                          className="absolute right-1 w-6 h-6 flex items-center justify-center bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all"
                        >
                          ✕
                        </button>
                    </div>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#8B5CF6]/5 p-6 rounded-3xl border border-[#8B5CF6]/20 mb-6">
            <div>
              <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Estado del Menú</h4>
              <p className="text-[9px] text-gray-500 uppercase font-bold">¿Activar carta de productos y pedidos?</p>
            </div>
            <button 
              type="button"
              onClick={() => setNuevoNegocio({...nuevoNegocio, menuActivo: !nuevoNegocio.menuActivo})}
              className={`px-6 py-3 rounded-2xl font-black text-[9px] tracking-widest transition-all ${
                nuevoNegocio.menuActivo 
                ? 'bg-[#8B5CF6] text-white shadow-lg' 
                : 'bg-[#121212] text-gray-600 border border-white/5'
              }`}
            >
              {nuevoNegocio.menuActivo ? 'PLAN TOTAL ACTIVO' : 'SOLO TARJETA (GRATIS)'}
            </button>
          </div>

          <button type="submit" className="w-full bg-[#8B5CF6] py-6 rounded-3xl font-black text-white shadow-2xl tracking-widest text-[11px]">
            {editandoId ? 'GUARDAR CAMBIOS' : 'PUBLICAR LOCAL'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {locales.map(loc => (
          <div key={loc.id} className="bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <img src={loc.imagen || loc.img} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
              <div>
                <h4 className="font-black text-white uppercase text-sm tracking-tighter">{loc.nombre}</h4>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{loc.categoria}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => seleccionarParaEditar(loc)} className="p-3 bg-white/5 rounded-xl hover:bg-[#8B5CF6] transition-colors">
                ✏️
              </button>
              <button onClick={async () => { if(window.confirm("¿Eliminar local?")) await deleteDoc(doc(db, "locales", loc.id)) }} className="p-3 bg-white/5 rounded-xl hover:bg-red-500 transition-colors">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
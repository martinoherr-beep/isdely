import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [locales, setLocales] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  
  // Estado para el texto que se está escribiendo en el input de categorías
  const [busquedaCat, setBusquedaCat] = useState('');

  const [nuevoNegocio, setNuevoNegocio] = useState({ 
    nombre: '', 
    categoria: [], // Ahora siempre lo manejaremos como Array internamente
    promo: '', 
    imagen: '', 
    telefono: '', 
    ubicacion: '', 
    descripcion: '', 
    menuActivo: false,
    prioridad: 0,
    productos: [] 
  });

  const [tempProducto, setTempProducto] = useState({ 
    nombre: '', precio: '', imagen: '', categoriaInterna: '', descripcionProducto: '' 
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsub = onSnapshot(collection(db, "locales"), (snap) => {
      setLocales(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // --- LÓGICA DE CATEGORÍAS ---
  const todasLasCategoriasExistentes = [...new Set(locales.flatMap(l => 
    Array.isArray(l.categoria) ? l.categoria : [l.categoria]
  ))].filter(Boolean);

  const agregarCategoria = (cat) => {
    const limpia = cat.trim().toUpperCase();
    if (limpia && !nuevoNegocio.categoria.includes(limpia)) {
      setNuevoNegocio({
        ...nuevoNegocio,
        categoria: [...nuevoNegocio.categoria, limpia]
      });
    }
    setBusquedaCat('');
  };

  const quitarCategoria = (catParaQuitar) => {
    setNuevoNegocio({
      ...nuevoNegocio,
      categoria: nuevoNegocio.categoria.filter(c => c !== catParaQuitar)
    });
  };

  const seleccionarParaEditar = (loc) => {
    setEditandoId(loc.id);
    setNuevoNegocio({ 
      ...loc, 
      categoria: Array.isArray(loc.categoria) ? loc.categoria : [loc.categoria],
      prioridad: loc.prioridad || 0 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nuevoNegocio.categoria.length === 0) return alert("Agrega al menos una categoría");

    try {
      if (editandoId) {
        await updateDoc(doc(db, "locales", editandoId), nuevoNegocio);
      } else {
        await addDoc(collection(db, "locales"), nuevoNegocio);
      }
      setEditandoId(null);
      setNuevoNegocio({ 
        nombre: '', categoria: [], promo: '', imagen: '', 
        telefono: '', ubicacion: '', descripcion: '', menuActivo: false, 
        prioridad: 0, productos: [] 
      });
      alert("¡Operación exitosa!");
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const eliminarProductoLista = (index) => {
    const nuevos = nuevoNegocio.productos.filter((_, i) => i !== index);
    setNuevoNegocio({ ...nuevoNegocio, productos: nuevos });
  };

  const agregarProductoLista = () => {
    if (!tempProducto.nombre || !tempProducto.precio) return alert("Nombre y precio obligatorios");
    setNuevoNegocio({ 
      ...nuevoNegocio, 
      productos: [...(nuevoNegocio.productos || []), { ...tempProducto, categoriaInterna: (tempProducto.categoriaInterna || 'GENERAL').toUpperCase() }] 
    });
    setTempProducto({ nombre: '', precio: '', imagen: '', categoriaInterna: '', descripcionProducto: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 mb-24 p-4">
      <div className="bg-[#1A1A1A] p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black italic uppercase text-center mb-10 tracking-tighter">
          {editandoId ? 'EDITANDO' : 'PANEL'} <span className="text-[#8B5CF6]">ISDELY</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2 italic">Nombre del Local</label>
              <input 
                type="text" 
                className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6]" 
                value={nuevoNegocio.nombre} 
                onChange={(e) => setNuevoNegocio({...nuevoNegocio, nombre: e.target.value})} 
                placeholder="Ej: La Boneleria" required 
              />
            </div>

            {/* SISTEMA DE CATEGORÍAS POR SELECCIÓN O ESCRITURA */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#8B5CF6] uppercase ml-2 italic">Categorías (Selecciona o escribe)</label>
              
              {/* Chips de categorías seleccionadas */}
              <div className="flex flex-wrap gap-2 mb-2">
                {nuevoNegocio.categoria.map(cat => (
                  <span key={cat} className="bg-[#8B5CF6] text-white text-[9px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 uppercase tracking-widest shadow-lg animate-in zoom-in">
                    {cat}
                    <button type="button" onClick={() => quitarCategoria(cat)} className="hover:text-black">✕</button>
                  </span>
                ))}
              </div>

              <input 
                type="text" 
                className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6] uppercase" 
                value={busquedaCat}
                placeholder="Escribe y presiona Enter..."
                onChange={(e) => setBusquedaCat(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    agregarCategoria(busquedaCat);
                  }
                }}
              />

              {/* Sugerencias de categorías existentes */}
              <div className="flex flex-wrap gap-2 mt-2">
                {todasLasCategoriasExistentes
                  .filter(c => !nuevoNegocio.categoria.includes(c))
                  .map(cat => (
                    <button 
                      key={cat} 
                      type="button"
                      onClick={() => agregarCategoria(cat)}
                      className="text-[8px] font-black border border-white/10 px-2 py-1 rounded-md text-gray-500 hover:border-[#8B5CF6] hover:text-[#8B5CF6] uppercase transition-all"
                    >
                      + {cat}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 p-5 rounded-3xl flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="text-[#8B5CF6] font-black text-xs uppercase tracking-tighter">Jerarquía de Visualización</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase italic">Números altos (ej. 10) fijan el negocio arriba.</p>
            </div>
            <input 
              type="number" 
              className="w-28 bg-[#121212] border-2 border-[#8B5CF6] p-4 rounded-2xl text-[#8B5CF6] font-black text-center text-xl outline-none" 
              value={nuevoNegocio.prioridad} 
              onChange={(e) => setNuevoNegocio({...nuevoNegocio, prioridad: Number(e.target.value)})} 
            />
          </div>

          <textarea 
            className="w-full bg-[#121212] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#8B5CF6] text-sm resize-none" 
            rows="2"
            value={nuevoNegocio.descripcion} 
            onChange={(e) => setNuevoNegocio({...nuevoNegocio, descripcion: e.target.value})} 
            placeholder="Descripción corta..." 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" className="bg-[#121212] border border-white/10 p-4 rounded-xl text-xs" value={nuevoNegocio.promo} onChange={(e) => setNuevoNegocio({...nuevoNegocio, promo: e.target.value})} placeholder="Promo" />
            <input type="text" className="bg-[#121212] border border-white/10 p-4 rounded-xl text-xs" value={nuevoNegocio.imagen} onChange={(e) => setNuevoNegocio({...nuevoNegocio, imagen: e.target.value})} placeholder="URL Imagen" />
            <input type="text" className="bg-[#121212] border border-white/10 p-4 rounded-xl text-xs" value={nuevoNegocio.telefono} onChange={(e) => setNuevoNegocio({...nuevoNegocio, telefono: e.target.value})} placeholder="WhatsApp" />
            <input type="text" className="bg-[#121212] border border-white/10 p-4 rounded-xl text-xs" value={nuevoNegocio.ubicacion} onChange={(e) => setNuevoNegocio({...nuevoNegocio, ubicacion: e.target.value})} placeholder="Ubicación" />
          </div>

          <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5">
            <h3 className="text-[10px] font-black uppercase text-[#8B5CF6] mb-4 tracking-widest">Menú</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input type="text" placeholder="SECCIÓN" className="bg-[#121212] p-3 rounded-xl text-[10px]" value={tempProducto.categoriaInterna} onChange={(e) => setTempProducto({...tempProducto, categoriaInterna: e.target.value})} />
                <input type="text" placeholder="PRODUCTO" className="bg-[#121212] p-3 rounded-xl text-[10px]" value={tempProducto.nombre} onChange={(e) => setTempProducto({...tempProducto, nombre: e.target.value})} />
                <input type="number" placeholder="PRECIO" className="bg-[#121212] p-3 rounded-xl text-[10px]" value={tempProducto.precio} onChange={(e) => setTempProducto({...tempProducto, precio: e.target.value})} />
                <input type="text" placeholder="FOTO" className="bg-[#121212] p-3 rounded-xl text-[10px]" value={tempProducto.imagen} onChange={(e) => setTempProducto({...tempProducto, imagen: e.target.value})} />
            </div>
            <button type="button" onClick={agregarProductoLista} className="w-full bg-[#8B5CF6]/10 text-[#8B5CF6] py-3 rounded-xl font-black text-[9px] uppercase">+ Añadir al menú</button>
            <div className="mt-4 flex flex-wrap gap-2">
                {nuevoNegocio.productos?.map((p, i) => (
                    <div key={i} className="bg-white/5 pl-3 pr-8 py-1 rounded-lg border border-white/5 text-[9px] relative flex items-center">
                        {p.nombre} (${p.precio})
                        <button type="button" onClick={() => eliminarProductoLista(i)} className="absolute right-1 text-red-500 font-black">✕</button>
                    </div>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#8B5CF6]/5 p-6 rounded-3xl border border-[#8B5CF6]/20">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">¿Activar Menú Digital?</span>
            <button 
              type="button"
              onClick={() => setNuevoNegocio({...nuevoNegocio, menuActivo: !nuevoNegocio.menuActivo})}
              className={`px-6 py-3 rounded-2xl font-black text-[9px] transition-all ${nuevoNegocio.menuActivo ? 'bg-[#8B5CF6] text-white' : 'bg-[#121212] text-gray-600 border border-white/5'}`}
            >
              {nuevoNegocio.menuActivo ? 'ACTIVO' : 'INACTIVO'}
            </button>
          </div>

          <button type="submit" className="w-full bg-[#8B5CF6] py-6 rounded-3xl font-black text-white shadow-2xl tracking-widest text-[11px] uppercase">
            {editandoId ? 'Guardar Cambios' : 'Publicar Negocio'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {locales.map(loc => (
          <div key={loc.id} className="bg-[#1A1A1A] p-5 rounded-3xl border border-white/5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <img src={loc.imagen || loc.img} className="w-10 h-10 rounded-xl object-cover" alt="" />
              <div>
                <h4 className="font-black text-white uppercase text-xs">{loc.nombre}</h4>
                <div className="flex gap-1 mt-1">
                  {(Array.isArray(loc.categoria) ? loc.categoria : [loc.categoria]).map(c => (
                    <span key={c} className="text-[7px] bg-[#8B5CF6]/10 text-[#8B5CF6] px-1 rounded uppercase font-bold">{c}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => seleccionarParaEditar(loc)} className="p-2 bg-white/5 rounded-lg hover:bg-[#8B5CF6] transition-colors">✏️</button>
              <button onClick={async () => { if(window.confirm("¿Borrar?")) await deleteDoc(doc(db, "locales", loc.id)) }} className="p-2 bg-white/5 rounded-lg hover:bg-red-500 transition-colors">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
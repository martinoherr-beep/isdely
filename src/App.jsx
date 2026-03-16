import React, { useState, useEffect } from 'react';
import { locales as datosIniciales } from './data';
import Tarjeta from './components/Tarjeta';
import Splash from './components/Splash';
import confetti from 'canvas-confetti';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('TODOS');
  const [filtroFavs, setFiltroFavs] = useState(false);

  // Estado de Favoritos
  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem("favs");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en LocalStorage
  useEffect(() => {
    localStorage.setItem("favs", JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFav = (id) => {
    const esNuevoFav = !favoritos.includes(id);
    if (esNuevoFav) {
      setFavoritos([...favoritos, id]);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#ffffff', '#FFD700']
      });
    } else {
      setFavoritos(favoritos.filter(favId => favId !== id));
    }
  };

  // Lógica de Filtrado
  const localesFiltrados = datosIniciales.filter(local => {
    const coincideBusqueda = local.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === 'TODOS' || local.categoria.toUpperCase() === categoriaActiva;
    const coincideFav = !filtroFavs || favoritos.includes(local.id);
    return coincideBusqueda && coincideCategoria && coincideFav;
  });

  if (showSplash) return <Splash onFinish={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#8B5CF6]/30">
      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/* HEADER & BUSCADOR */}
        <header className="flex flex-col items-center mb-16">
          <h1 className="text-6xl font-black italic mb-12 tracking-tighter">
            Isdely<span className="text-[#8B5CF6]">.</span>
          </h1>
          
          <div className="w-full max-w-2xl flex gap-3">
            <input 
              type="text" 
              placeholder="¿Qué quieres comer hoy?"
              className="flex-1 bg-[#1E1E1E] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-600"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {/* BOTÓN FAVORITOS CON ETIQUETA Y CONTADOR */}
            <button 
              onClick={() => setFiltroFavs(!filtroFavs)}
              className={`px-5 rounded-2xl border transition-all flex items-center gap-3 h-[54px] ${
                filtroFavs 
                ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                : 'bg-[#1E1E1E] border-white/5 text-white hover:border-white/20'
              }`}
            >
              <span className="text-xl leading-none">{filtroFavs ? '⭐' : '☆'}</span>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-60">Favs</span>
                <span className="text-sm font-black">{favoritos.length}</span>
              </div>
            </button>
          </div>

          {/* BOTONES CATEGORÍAS */}
          <div className="flex gap-3 mt-10 overflow-x-auto pb-4 no-scrollbar max-w-full">
            {['TODOS', 'RESTAURANTE', 'PARRILLA', 'MARISCO', 'BAR'].map(cat => (
              <button
                key={cat}
                onClick={() => {setCategoriaActiva(cat); setFiltroFavs(false);}}
                className={`px-7 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all border shrink-0 ${
                  categoriaActiva === cat && !filtroFavs
                  ? 'bg-white text-black border-white shadow-lg' 
                  : 'bg-[#1E1E1E] text-gray-500 border-white/5 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* REJILLA DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localesFiltrados.map(local => (
            <Tarjeta 
              key={local.id} 
              negocio={local} 
              esFavorito={favoritos.includes(local.id)}
              onToggleFav={() => toggleFav(local.id)}
            />
          ))}
          {localesFiltrados.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-600 italic">
              No se encontraron locales en esta selección.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-32 py-10 border-t border-white/5 text-center flex flex-col items-center gap-4">
          <div className="text-2xl font-black italic tracking-tighter opacity-20">
            Isdely<span className="text-[#8B5CF6]">.</span>
          </div>
          <p className="text-gray-500 text-[9px] uppercase font-bold tracking-[0.4em]">
            Hecho con ❤️ para la comunidad
          </p>
          <p className="text-gray-700 text-[9px] mt-4 font-mono">
            © 2026 Isdely App • Parral, Chihuahua
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
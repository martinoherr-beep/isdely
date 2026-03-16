import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti'; // <--- Importamos el confeti
import { locales } from './data';
import Tarjeta from './components/Tarjeta';

function App() {
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [mostrarSoloFavs, setMostrarSoloFavs] = useState(false);
  // Esta línea genera la lista de categorías basándose en tu data.js
const categorias = ["Todos", ...new Set(locales.map(l => l.categoria))];
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('isdely_favs');
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('isdely_favs', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (id) => {
    const esNuevoFav = !favoritos.includes(id);
    
    if (esNuevoFav) {
      // Disparar confeti morado y blanco
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#ffffff', '#a78bfa']
      });
    }

    setFavoritos(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // --- El resto del código (Loading y Return) se mantiene igual ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center">
        <h1 className="text-7xl font-black italic text-white animate-pulse">
          Isdely<span className="text-[#8B5CF6]">.</span>
        </h1>
        <p className="text-[#8B5CF6] mt-4 text-xs font-black uppercase tracking-[0.3em]">Cargando tu ciudad</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-12">
      <header className="max-w-xl mx-auto mb-12">
        <h1 className="text-5xl font-black text-center mb-8 italic">
          Isdely<span className="text-[#8B5CF6]">.</span>
        </h1>
        
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="¿A dónde quieres ir?" 
            className="w-full bg-[#1E1E1E] border border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] outline-none text-white"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button 
            onClick={() => setMostrarSoloFavs(!mostrarSoloFavs)}
            className={`px-5 rounded-2xl transition-all border flex flex-col items-center justify-center min-w-[100px] ${
              mostrarSoloFavs ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'bg-[#1E1E1E] border-white/10 text-gray-400'
            }`}
          >
            <span className="text-lg">{mostrarSoloFavs ? '⭐' : '☆'}</span>
            <span className="text-[10px] font-black uppercase">Favs: {favoritos.length}</span>
          </button>
        </div>
      </header>

  {/* Navegación de Categorías Deslizable */}
<nav className="flex justify-start md:justify-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
  <div className="flex gap-2 px-2">
    {categorias.map(cat => (
      <button 
        key={cat} 
        onClick={() => { setFiltro(cat); setMostrarSoloFavs(false); }}
        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-xl ${
          filtro === cat && !mostrarSoloFavs 
          ? 'bg-white text-black scale-105' 
          : 'bg-[#1E1E1E] text-gray-500 hover:text-white border border-white/5'
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
</nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {locales
          .filter(l => (mostrarSoloFavs ? favoritos.includes(l.id) : true))
          .filter(l => filtro === "Todos" || l.categoria === filtro)
          .filter(l => l.nombre.toLowerCase().includes(busqueda.toLowerCase()))
          .map(negocio => (
            <Tarjeta 
              key={negocio.id} 
              negocio={negocio} 
              esFavorito={favoritos.includes(negocio.id)}
              onToggleFav={() => toggleFavorito(negocio.id)}
            />
          ))}
      </main>
    <footer className="mt-20 py-10 border-t border-white/5 text-center flex flex-col items-center gap-4">
  <div className="text-2xl font-black italic tracking-tighter opacity-50">
    Isdely<span className="text-[#8B5CF6]">.</span>
  </div>
  
  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.4em]">
    Hecho con ❤️ para la comunidad
  </p>
  
  <div className="flex gap-6 mt-4">
    {/* Puedes poner tus links reales aquí */}
    <a href="#" className="text-gray-600 hover:text-[#8B5CF6] transition-colors text-xs uppercase font-black tracking-widest">Instagram</a>
    <a href="#" className="text-gray-600 hover:text-[#8B5CF6] transition-colors text-xs uppercase font-black tracking-widest">Contacto</a>
  </div>
  
  <p className="text-gray-700 text-[9px] mt-8 font-mono italic">
    © 2026 Isdely App. Todos los derechos reservados.
  </p>
</footer>
    </div>
  );
}

export default App;
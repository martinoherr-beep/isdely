import React, { useState } from 'react';
import confetti from 'canvas-confetti'; 
import { locales } from './data';
import Tarjeta from './components/Tarjeta';

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('TODO');
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
      
      // EXPLOSIÓN REFORZADA
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        zIndex: 9999, // <--- ESTO ES CLAVE para que salga al frente
        colors: ['#8B5CF6', '#ffffff', '#FBBF24'],
        ticks: 300, // Hace que el confeti dure un poco más en pantalla
        gravity: 1,
        scalar: 1.2, // Hace los papelitos un poco más grandes
      });
    }
  };

  // ... (El resto del código de filtrado y el return se mantienen igual)
  const localesFiltrados = locales.filter(loc => {
    const coincideBusca = loc.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtro === 'TODO' || loc.categoria === filtro;
    const coincideFav = verFavoritos ? favoritos.includes(loc.id) : true;
    return coincideBusca && coincideFiltro && coincideFav;
  });

  const categorias = ['TODO', 'RESTAURANTE', 'PARRILLA', 'MARISCO', 'BAR'];

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 pb-24 font-sans">
      <header className="max-w-6xl mx-auto mb-10 flex flex-col items-center">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-8 leading-none">
          ISDELY<span className="text-[#8B5CF6]">.</span>
        </h1>
        
        <div className="w-full max-w-3xl flex gap-3 mb-8 items-stretch">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={busqueda}
              placeholder="¿Qué se te antoja hoy?" 
              className="w-full h-full bg-[#1E1E1E] border border-white/5 p-4 pr-12 rounded-2xl focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-600 shadow-xl text-sm"
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button 
                onClick={() => setBusqueda('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            )}
          </div>
          
          <button 
            onClick={() => setVerFavoritos(!verFavoritos)}
            className={`px-6 rounded-2xl border transition-all flex items-center gap-2.5 font-black h-full shadow-lg ${
              verFavoritos 
              ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' 
              : 'bg-[#1E1E1E] border-white/5 text-gray-400'
            }`}
          >
            <span className="text-lg">⭐</span>
            <span className="text-base tracking-tight">{favoritos.length}</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setFiltro(cat);
                setVerFavoritos(false);
              }}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border ${
                filtro === cat 
                ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white' 
                : 'bg-[#1A1A1A] border-white/5 text-gray-500 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localesFiltrados.map(loc => (
            <Tarjeta 
              key={loc.id} 
              negocio={loc} 
              esFavorito={favoritos.includes(loc.id)} 
              onToggleFav={toggleFavorito} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
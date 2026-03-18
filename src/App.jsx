import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti'; 
import { db } from './firebase'; 
import { collection, onSnapshot } from 'firebase/firestore'; 

// Componentes
import Tarjeta from './components/Tarjeta';
import Splash from './components/Splash';
import AdminPanel from './components/AdminPanel';
import MenuModal from './components/MenuModal';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('TODO');
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  
  // ESTADOS DE DATOS Y VISTAS
  const [locales, setLocales] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);

  // CONEXIÓN EN TIEMPO REAL CON FIREBASE
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "locales"), (snapshot) => {
      const listaData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLocales(listaData);
    });
    return () => unsub();
  }, []);

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
        colors: ['#8B5CF6', '#ffffff', '#FBBF24'],
        scalar: 1.2
      });
    }
  };

  const localesFiltrados = locales.filter(loc => {
    const nombre = loc.nombre || "";
    const coincideBusca = nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtro === 'TODO' || loc.categoria === filtro;
    const coincideFav = verFavoritos ? favoritos.includes(loc.id) : true;
    return coincideBusca && coincideFiltro && coincideFav;
  });

  const categorias = ['TODO', 'RESTAURANTE', 'PARRILLA', 'MARISCO', 'BAR'];

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 pb-12 font-sans flex flex-col">
      
      {/* 1. MODO ADMINISTRADOR */}
      {modoAdmin ? (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <button 
            onClick={() => setModoAdmin(false)}
            className="mb-8 text-[#8B5CF6] font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
          >
            ← Volver al Directorio
          </button>
          <AdminPanel />
        </div>
      ) : (
        /* 2. MODO USUARIO */
        <>
          {/* TU BANNER DE PROMO ORIGINAL - VERSIÓN ANTISCROLL RE-INTEGRADA */}
          {locales.some(l => l.promo) && (
            <div 
              className="-mx-6 -mt-6 mb-10 bg-[#8B5CF6]/30 backdrop-blur-xl py-3 border-b border-white/10 z-50 sticky top-0 overflow-hidden"
              style={{ width: 'calc(100% + 3rem)' }} 
            >
              <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 30s linear infinite' }}>
                <style>{`
                  @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                  }
                `}</style>

                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center flex-nowrap">
                    {locales.filter(l => l.promo).map(l => (
                      <span key={l.id} className="mx-12 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm">🔥</span> 
                        {l.nombre}: <span className="italic opacity-90">{l.promo}</span>
                        <span className="mx-8 opacity-30">|</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HEADER CENTRAL */}
          <header className="max-w-6xl mx-auto mb-10 flex flex-col items-center w-full animate-in fade-in duration-1000">
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
                  <button onClick={() => setBusqueda('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
                )}
              </div>
              
              <button 
                onClick={() => setVerFavoritos(!verFavoritos)}
                className={`px-5 rounded-2xl border transition-all flex flex-col items-center justify-center min-w-[75px] shadow-lg ${verFavoritos ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' : 'bg-[#1E1E1E] border-white/5 text-gray-400'}`}
              >
                <span className="text-[7px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-70">Fav</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">⭐</span>
                  <span className="text-sm font-black">{favoritos.length}</span>
                </div>
              </button>
            </div>

            {/* CATEGORÍAS */}
            <div className="w-full max-w-2xl overflow-x-auto pb-2 no-scrollbar">
              <div className="flex justify-start md:justify-center gap-2.5 min-w-max px-4">
                {categorias.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFiltro(cat); setVerFavoritos(false); }}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border whitespace-nowrap ${filtro === cat ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white shadow-md' : 'bg-[#1A1A1A] border-white/5 text-gray-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* GRID DE LOCALES */}
          <main className="max-w-6xl mx-auto flex-1 w-full">
            {localesFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {localesFiltrados.map((loc, index) => (
                  <div key={loc.id} className="animate-cascade" style={{ animationDelay: `${index * 150}ms` }}>
                    <Tarjeta 
                      negocio={loc} 
                      esFavorito={favoritos.includes(loc.id)} 
                      onToggleFav={toggleFavorito} 
                      onClick={() => setNegocioSeleccionado(loc)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <h3 className="text-gray-600 font-bold uppercase italic tracking-widest text-sm">No se encontraron locales</h3>
              </div>
            )}
          </main>
        </>
      )}

      {/* MODAL INDEPENDIENTE */}
      {negocioSeleccionado && (
        <MenuModal 
          negocio={negocioSeleccionado} 
          onClose={() => setNegocioSeleccionado(null)} 
        />
      )}

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto w-full mt-20 pt-10 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Hecho con ❤️ by Creators</p>
        <button 
          onClick={() => setModoAdmin(!modoAdmin)} 
          className="mt-4 bg-[#8B5CF6] text-white text-[10px] font-black px-6 py-2 rounded-full hover:scale-110 transition-all"
        >
          {modoAdmin ? 'CERRAR PANEL' : 'ABRIR PANEL DE ADMIN'}
        </button>
      </footer>
    </div>
  );
}

export default App;
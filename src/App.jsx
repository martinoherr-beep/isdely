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

  // ESTADO PARA EL LOGIN VISUAL
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [pinIngresado, setPinIngresado] = useState('');
  const PIN_MAESTRO = "Cr34tors26*"; // <--- AQUÍ CAMBIA TU PIN SI GUSTAS

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

  const manejarLogin = (e) => {
    e.preventDefault();
    if (pinIngresado === PIN_MAESTRO) {
      setModoAdmin(true);
      setMostrarLogin(false);
      setPinIngresado('');
    } else {
      alert("PIN Incorrecto");
      setPinIngresado('');
    }
  };

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

  const categoriasExtraidas = [...new Set(locales.map(l => l.categoria))].filter(Boolean);
  const listaCategorias = ['TODO', ...categoriasExtraidas];

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 pb-12 font-sans flex flex-col">
      
      {/* 1. MODO ADMINISTRADOR (PANEL REAL) */}
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
      ) : mostrarLogin ? (
        /* 2. PANTALLA DE LOGIN VISUAL */
        <div className="fixed inset-0 z-[200] bg-[#121212] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
           <div className="w-full max-w-xs bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl text-center">
              <h2 className="text-xl font-black italic text-white mb-6 uppercase tracking-tighter">Acceso <span className="text-[#8B5CF6]">Privado</span></h2>
              <form onSubmit={manejarLogin} className="space-y-4">
                <input 
                  type="password" 
                  value={pinIngresado}
                  onChange={(e) => setPinIngresado(e.target.value)}
                  placeholder="Introduce el PIN"
                  className="w-full bg-[#121212] border border-white/10 p-4 rounded-2xl text-center text-lg font-black tracking-[0.5em] text-[#8B5CF6] outline-none focus:border-[#8B5CF6]"
                  autoFocus
                />
                <button type="submit" className="w-full bg-[#8B5CF6] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Entrar</button>
                <button type="button" onClick={() => setMostrarLogin(false)} className="text-[8px] uppercase font-black text-gray-600 tracking-widest mt-4">Cancelar</button>
              </form>
           </div>
        </div>
      ) : (
        /* 3. MODO USUARIO */
        <>
          {/* BANNER PROMO */}
          {locales.some(l => l.promo) && (
            <div className="-mx-6 -mt-6 mb-10 bg-[#8B5CF6]/30 backdrop-blur-xl py-3 border-b border-white/10 z-50 sticky top-0 overflow-hidden">
              <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 30s linear infinite' }}>
                <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }`}</style>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center flex-nowrap">
                    {locales.filter(l => l.promo).map(l => (
                      <span key={l.id} className="mx-12 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm">🔥</span> {l.nombre}: <span className="italic opacity-90">{l.promo}</span>
                        <span className="mx-8 opacity-30">|</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <header className="max-w-6xl mx-auto mb-10 flex flex-col items-center w-full animate-in fade-in duration-1000">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-8 leading-none">ISDELY<span className="text-[#8B5CF6]">.</span></h1>
            {/* Buscador y Categorías... (Omitido por brevedad, se mantiene igual en tu código) */}
          </header>

          <main className="max-w-6xl mx-auto flex-1 w-full">
            {/* Grid de tarjetas... (Se mantiene igual) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {localesFiltrados.map((loc, index) => (
                  <div key={loc.id} className="animate-cascade" style={{ animationDelay: `${index * 150}ms` }}>
                    <Tarjeta negocio={loc} esFavorito={favoritos.includes(loc.id)} onToggleFav={toggleFavorito} onClick={() => setNegocioSeleccionado(loc)} />
                  </div>
                ))}
            </div>
          </main>
        </>
      )}

      {negocioSeleccionado && <MenuModal negocio={negocioSeleccionado} onClose={() => setNegocioSeleccionado(null)} />}

      <footer className="max-w-6xl mx-auto w-full mt-20 pt-10 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Hecho con ❤️ by Creators</p>
        <p className="text-[8px] font-black tracking-[0.4em] text-gray-500 mb-1">Derechos Reservados 2026</p>

        {/* BOTÓN PROTEGIDO POR URL QUE DISPARA EL LOGIN VISUAL */}
        {window.location.search.includes('admin=isdely2026') && (
          <div className="mt-6">
            <button 
              onClick={() => setMostrarLogin(true)} 
              className="bg-[#8B5CF6] text-white text-[10px] font-black px-8 py-3 rounded-full hover:scale-110 transition-all shadow-lg shadow-purple-500/20"
            >
              ABRIR PANEL DE ADMIN
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
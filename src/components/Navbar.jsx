export default function Navbar({ setFiltro, filtroActual }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="text-2xl font-black italic tracking-tighter text-white cursor-pointer"
          onClick={() => setFiltro('explorar')}
        >
          ISDELY<span className="text-[#8B5CF6]">.</span>
        </div>
        
        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
          <button 
            onClick={() => setFiltro('explorar')}
            className={`transition-colors ${filtroActual === 'explorar' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Explorar
          </button>
          
          <button 
            onClick={() => setFiltro('favoritos')}
            className={`transition-colors ${filtroActual === 'favoritos' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Favoritos
          </button>
        </div>
      </div>
    </nav>
  );
}
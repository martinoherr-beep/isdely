import { useEffect, useState } from 'react';

// EL SECRETO ESTÁ EN ESTA LÍNEA: "export default"
export default function Splash({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Esperamos a que la animación de desvanecimiento termine antes de avisar a App.jsx
      setTimeout(onFinish, 500); 
    }, 2000); 
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#121212] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center">
        {/* Un efecto de escala para que el logo se vea vivo */}
        <div className="animate-bounce mb-4">
           <span className="text-5xl">🚀</span>
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter mb-8 leading-none">
  Isdely
  <span 
    className="text-[#8B5CF6] cursor-default"
    onClick={(e) => {
      window.clickCount = (window.clickCount || 0) + 1;
      if (window.clickCount === 5) { // Requiere 5 clics rápidos
        setMostrarLogin(true);
        window.clickCount = 0;
      }
      setTimeout(() => { window.clickCount = 0; }, 2000); // Si no hace los 5 clics en 2 seg, se resetea
    }}
  >
    .
  </span>
</h1>
        <p className="text-[#8B5CF6] text-[10px] font-bold uppercase tracking-[0.5em] mt-4 animate-pulse">
          Cerca de ti
        </p>
      </div>
    </div>
  );
}
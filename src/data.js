export const locales = [
  {
    id: 1,
    nombre: "CARACAL BISTRO",
    categoria: "RESTAURANTE",
    telefono: "526271234567",
    descripcion: "Experiencia culinaria de autor. Cortes selectos y mixología en un ambiente sofisticado.",
    promo: "10% descuento toda la semana",
    ubicacion: "Av. Independencia, Centro",
    imagen: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop",
    menu: [
      {
        categoria: "PAQUETES PAREJA",
        items: [
          { 
            id: 101, 
            nombre: "Cena Romántica (2 Cortes + Vino)", 
            precio: 1250,
            img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500&auto=format&fit=crop"
          },
          { 
            id: 102, 
            nombre: "Degustación Bistro (4 tiempos)", 
            precio: 890,
            img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&auto=format&fit=crop"
          }
        ]
      },
      {
        categoria: "CORTES PREMIUM",
        items: [
          { 
            id: 103, 
            nombre: "Rib Eye High Choice (400g)", 
            precio: 520,
            img: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop"
          },
          { 
            id: 104, 
            nombre: "New York a las Brasas", 
            precio: 450,
            img: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=500&auto=format&fit=crop"
          }
        ]
      },
      {
        categoria: "MIXOLOGÍA",
        items: [
          { 
            id: 105, 
            nombre: "Mezcalita de Maracuyá", 
            precio: 145,
            img: "https://images.unsplash.com/photo-1582269300627-2c1b2c5890b0?w=500&auto=format&fit=crop"
          },
          { 
            id: 106, 
            nombre: "Carajillo Shakeado", 
            precio: 130,
            img: "https://images.unsplash.com/photo-1596951111624-94c6f3b0e5bf?w=500&auto=format&fit=crop"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: "LA CABAÑA",
    categoria: "PARRILLA",
    telefono: "526271112233",
    descripcion: "El punto de encuentro para los amantes de la carne. Sabor ahumado y tradición parralense.",
    ubicacion: "Vía Sicilia, Las Mansiones",
    imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
    menu: [
      {
        categoria: "PARA COMPARTIR",
        items: [
          { 
            id: 201, 
            nombre: "Parrillada Familiar (4 personas)", 
            precio: 980,
            img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop"
          },
          { 
            id: 202, 
            nombre: "Combo Amigos (2 Alambres + Cubetazo)", 
            precio: 550,
            img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop"
          }
        ]
      },
      {
        categoria: "LO TRADICIONAL",
        items: [
          { 
            id: 203, 
            nombre: "Tacos de Sirloin (Orden de 3)", 
            precio: 165,
            img: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500&auto=format&fit=crop"
          },
          { 
            id: 204, 
            nombre: "Papa Asada Especial con RibEye", 
            precio: 185,
            img: "https://images.unsplash.com/photo-1518977676601-b53f02bad675?w=500&auto=format&fit=crop"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    nombre: "EL TIMÓN",
    categoria: "MARISCO",
    telefono: "526274445566",
    descripcion: "Los mariscos más frescos de la ciudad. Sabor sinaloense con el toque único de Parral.",
    ubicacion: "Blvd. Ortiz Mena",
    imagen: "https://images.unsplash.com/photo-1551248429-4243da442006?q=80&w=1000&auto=format&fit=crop",
    menu: [
      {
        categoria: "CHAROLAS FRÍAS",
        items: [
          { 
            id: 301, 
            nombre: "Torre Imperial de Mariscos", 
            precio: 320,
            img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&auto=format&fit=crop"
          },
          { 
            id: 302, 
            nombre: "Aguachile Verde de Camarón", 
            precio: 240,
            img: "https://images.unsplash.com/photo-1534604973900-c41ab4c287bb?w=500&auto=format&fit=crop"
          }
        ]
      },
      {
        categoria: "PLATILLOS CALIENTES",
        items: [
          { 
            id: 303, 
            nombre: "Filete Relleno de Pulpo", 
            precio: 280,
            img: "https://images.unsplash.com/photo-1563379091339-03b17af4a4f9?w=500&auto=format&fit=crop"
          },
          { 
            id: 304, 
            nombre: "Camarones al Coco", 
            precio: 265,
            img: "https://images.unsplash.com/photo-1623961936162-43d92f58e1c6?w=500&auto=format&fit=crop"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    nombre: "LA EXTRAVIADA",
    categoria: "BAR",
    telefono: "526278889900",
    descripcion: "Cerveza artesanal, drinks exclusivos y el mejor ambiente nocturno frente a la plaza.",
    ubicacion: "Centro Histórico",
    imagen: "https://images.unsplash.com/photo-1538488881038-e252a119ace7?q=80&w=1000&auto=format&fit=crop",
    menu: [
      {
        categoria: "PROMOS DE BAR",
        items: [
          { 
            id: 401, 
            nombre: "Tarro 1L (Nacional)", 
            precio: 95,
            img: "https://images.unsplash.com/photo-1550348202-38ce9f70ec21?w=500&auto=format&fit=crop"
          },
          { 
            id: 402, 
            nombre: "Promo Jueves: 2x1 en Margaritas", 
            precio: 160,
            img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop"
          }
        ]
      },
      {
        categoria: "SNACKS",
        items: [
          { 
            id: 403, 
            nombre: "Alitas Buffalo (10 pzas)", 
            precio: 185,
            img: "https://images.unsplash.com/photo-1567622445874-bf9be6aa9d7d?w=500&auto=format&fit=crop"
          },
          { 
            id: 404, 
            nombre: "Nachos Extraviados con Arrachera", 
            precio: 210,
            img: "https://images.unsplash.com/photo-1510629900280-a50bbff8536f?w=500&auto=format&fit=crop"
          }
        ]
      }
    ]
  },
  {
    id: 5,
    nombre: "J.C. CAFÉ",
    categoria: "RESTAURANTE",
    telefono: "526277776655",
    descripcion: "Desayunos tradicionales y repostería artesanal. El rincón favorito para platicar.",
    ubicacion: "Calle Mercaderes, Centro",
    imagen: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
    menu: [
      {
        categoria: "DESAYUNOS",
        items: [
          { 
            id: 501, 
            nombre: "Huevos Montados Parral", 
            precio: 145,
            img: "https://images.unsplash.com/photo-1621236313793-ec947231454c?w=500&auto=format&fit=crop"
          },
          { 
            id: 502, 
            nombre: "Chilaquiles con Pollo", 
            precio: 160,
            img: "https://images.unsplash.com/photo-1629813291880-9280d5d21e8e?w=500&auto=format&fit=crop"
          }
        ]
      },
      {
        categoria: "REPOSTERÍA",
        items: [
          { 
            id: 503, 
            nombre: "Rebanada de Pastel Alemán", 
            precio: 85,
            img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop"
          },
          { 
            id: 504, 
            nombre: "Pan Dulce Artesanal", 
            precio: 25,
            img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop"
          }
        ]
      }
    ]
  },
  {
    id: 6,
    nombre: "LA ESTACIÓN",
    categoria: "PARRILLA",
    telefono: "526273332211",
    descripcion: "Tradición en asados. Un viaje al sabor de antaño con los mejores cortes de la ciudad.",
    ubicacion: "Prolongación Independencia",
    imagen: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=1000&auto=format&fit=crop",
    menu: [
      {
        categoria: "COMBOS",
        items: [
          { 
            id: 601, 
            nombre: "Paquete El Maquinista (Para 2)", 
            precio: 450,
            img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop"
          },
          { 
            id: 602, 
            nombre: "Combo Infantil (Nuggets + Jugo)", 
            precio: 120,
            img: "https://images.unsplash.com/photo-1563121118-a6d123b3b4f3?w=500&auto=format&fit=crop"
          }
        ]
      },
      {
        categoria: "AL CARBÓN",
        items: [
          { 
            id: 603, 
            nombre: "Costillas BBQ (500g)", 
            precio: 340,
            img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&auto=format&fit=crop"
          },
          { 
            id: 604, 
            nombre: "Burrito Gigante de Arrachera", 
            precio: 135,
            img: "https://images.unsplash.com/photo-1623961936162-43d92f58e1c6?w=500&auto=format&fit=crop"
          }
        ]
      }
    ]
  }
];
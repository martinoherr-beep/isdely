export const locales = [
  {
    id: 1,
    nombre: "Taco Factory",
    categoria: "PARRILLA",
    telefono: "526278897648", 
    ubicacion: "Av. Independencia #45, Centro",
    img: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=800&auto=format&fit=crop",
    promo: "¡ORDEN DE TRIPA A PRECIO DE ADOBADA LOS MARTES!",
    menu: [
      {
        categoria: "TACOS INDIVIDUALES",
        items: [
          { id: 101, nombre: "Taco de Bistec", precio: 35, img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400" },
          { id: 102, nombre: "Taco de Tripa", precio: 45, img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400" },
          { id: 103, nombre: "Taco de Adobada", precio: 35, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" }
        ]
      },
      {
        categoria: "ESPECIALIDADES",
        items: [
          { id: 104, nombre: "Vampiro Mixto", precio: 85, img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400" },
          { id: 105, nombre: "Quesadilla Gigante", precio: 110, img: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400" }
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: "Pancake Paradise",
    categoria: "RESTAURANTE",
    telefono: "526279876543",
    ubicacion: "Vialidad del Río #12, San Antonio",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?q=80&w=800&auto=format&fit=crop",
    promo: "NIÑOS DESAYUNAN GRATIS SÁBADOS Y DOMINGOS",
    menu: [
      {
        categoria: "PANCAKES PREMIUM",
        items: [
          { id: 201, nombre: "Paradise Classic", precio: 125, img: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400" },
          { id: 202, nombre: "Nutella Explosion", precio: 145, img: "https://images.unsplash.com/photo-1554520735-0ad66a951bb8?w=400" }
        ]
      }
    ]
  }
];
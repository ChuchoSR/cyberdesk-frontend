import { useState, useEffect } from "react";
import Gaveta from "./components/Gaveta";

// 1. EL MAPA (Tus categorías con los endpoints EXACTOS de tu backend)
const categorias = [
  { id: "cpu", label: "CPU", section: "internos", icon: "🧠", endpoint: "/procesadores", stock: 30 },
  { id: "motherboard", label: "Motherboard", section: "internos", icon: "⚙️", endpoint: "/placas_madre" },
  { id: "ram", label: "RAM", section: "internos", icon: "⚡", endpoint: "/memoria_ram" },
  { id: "storage", label: "Almacenamiento", section: "internos", icon: "💾", endpoint: "/almacenamiento" },
  { id: "gpu", label: "GPU", section: "perifericos", icon: "🎮", endpoint: "/tarjetas_video" },
  { id: "psu", label: "PSU", section: "perifericos", icon: "🔌", endpoint: "/fuentes_poder" },
  { id: "case", label: "Case", section: "perifericos", icon: "📦", endpoint: "/gabinetes" },
  { id: "cooling", label: "Refrigeración", section: "perifericos", icon: "❄️", endpoint: "/refrigeracion" },
  //{ id: "monitor", label: "Monitor", section: "perifericos", icon: "🖥️", endpoint: "/monitores", stock: 15 },
];

export default function HardwareInventory() {
  // 2. EL CEREBRO (La Memoria de React)
  const [categoriaActiva, setCategoriaActiva] = useState("motherboard");
  const [productos, setProductos] = useState([]); // <- Guardará la info del backend
  const [cargando, setCargando] = useState(false); // <- Para mostrar un mensaje de "Cargando..." mientras esperamos la respuesta del backend
  const [busqueda, setBusqueda] = useState(""); // <- Para el filtro de búsqueda


  // 3. EL CLASIFICADOR (Variables derivadas de la memoria)
  const cajonesInternos = categorias.filter(c => c.section === "internos");
  const estantesPerifericos = categorias.filter(c => c.section === "perifericos");
  const infoCajonAbierto = categorias.find(c => c.id === categoriaActiva);
  

  // 4. EL MENSAJERO (El Hook useEffect que va al backend)
  useEffect(() => {
    // Si el cajón existe y tiene un endpoint configurado, hacemos la llamada
    if (infoCajonAbierto && infoCajonAbierto.endpoint) {
      
      setCargando(true); // Empezamos a cargar
      
      /* const url = 'http://localhost:3000' + infoCajonAbierto.endpoint; */
      console.log("Mi variable secreta es:", import.meta.env.VITE_URL);
      const url = import.meta.env.VITE_URL + infoCajonAbierto.endpoint;
      
      fetch(url)
        .then(respuesta => {
          if (!respuesta.ok) {
            throw new Error(`Ruta no encontrada en el backend: ${url}`);
          }
          return respuesta.json();
        })
        .then(datos =>{ 
          setProductos(datos)
          setCargando(false); //apagamos la carga porque ya tenemos los datos
          })
          
        .catch(error => {
          console.error('Error al conectar:', error);
          setProductos([{ error: "No se pudieron cargar los datos o la ruta no existe aún en el backend." }]);
          setCargando(false); //apagamos la carga aunque haya error para mostrar el mensaje
        });
    }
  }, [categoriaActiva, infoCajonAbierto]);

  // 5. EL DISEÑO (HTML + Tailwind)
  return (
    <main className="h-screen w-full bg-neutral-950 text-white p-2">
      <div className="h-full grid grid-cols-[280px_1fr_200px] gap-4">
        
        {/* COLUMNA IZQUIERDA: La Cajonera */}
        <aside className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-500 font-bold mb-4 text-sm">INTERNOS</p>
          
          <div className="flex flex-col gap-2">
            {cajonesInternos.map(item => (
              <button
                key={item.id}
                onClick={() => setCategoriaActiva(item.id)}
                className={`p-3 rounded-lg text-left font-bold transition-colors
                  ${categoriaActiva === item.id 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }
                `}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* COLUMNA CENTRAL: El Visor */}
        <section className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 flex flex-col">
          <h2 className="text-4xl font-bold text-white mb-2">
            {infoCajonAbierto.label} {infoCajonAbierto.stock ? `(Stock: ${infoCajonAbierto.stock})` : ''} {infoCajonAbierto.icon}
          </h2>
          
          <input 
            type="text" 
            value={busqueda} // <- El valor de la barra de búsqueda
            onChange={(e) => setBusqueda(e.target.value)} // <- Guardamos lo que el usuario escribe en la barra de búsqueda
            className="bg-neutral-900 border border-neutral-700 text-white p-2 rounded w-full" />

            {/* <Gaveta/> */}

            <p className="text-orange-400 font-mono mb-4">
              Ruta consultada: localhost:3000{infoCajonAbierto.endpoint}
            </p>
          {cargando ? (
            <div className="text-orange-500 font-bold text-xl animate-pulse text-center mt-10">
              ⚙️ Conectando a la matriz del inventario...
            </div>
            ) : (
              <div className="flex-1 overflow-auto mt-4">
              {/* LA CUADRÍCULA DE TARJETAS */}
              <div className="grid grid-cols-2 gap-4">

                {productos.filter(item => {
                  if (busqueda === "") return true;

                  // Convertimos todo a minúsculas para hacer una búsqueda

                  const textoBuscado = busqueda.toLowerCase();
                  const modelo =item.modelo.toLowerCase();

                  return modelo.includes(textoBuscado);
                })

                .map(item => {
                  // 1. ZONA DE LÓGICA
                  
                  
                  
                  const opcionesBusqueda = {
                    cpu: item.consumo_watts + "W",
                    ram: item.capacidad_memoria + "GB - " + item.frecuencia + "MHz",
                    gpu: item.memoria_vram,
                    motherboard: item.formato_fisico,
                    storage: item.capacidad_memoria >= 1000 ? (item.capacidad_memoria / 1000) + " TB" : item.capacidad_memoria + " GB",
                    psu: item.certificacion + " " + item.potencia_watts + "W",
                    case: item.tipo_iluminacion + " " + item.formato,
                    cooling: item.sockets_compatible
                  }

                  let textoDetalle = opcionesBusqueda[categoriaActiva] || "Genérico"; 
                  
                  /* let textoDetalle = "Genérico";
                  
                  if (categoriaActiva === "cpu") {
                    textoDetalle = item.consumo_watts + "W";
                  } else if (categoriaActiva === "ram") {
                    // ¡Magia! Imprimimos los dos datos que te importan de la RAM
                    textoDetalle = item.capacidad_memoria + "GB - " + item.frecuencia + "MHz";
                  } else if (categoriaActiva === "gpu") {
                    textoDetalle = item.memoria_vram; 
                  } else if (categoriaActiva === "motherboard") {
                    textoDetalle = item.formato_fisico;
                  } else if (categoriaActiva === "storage") {
                    textoDetalle = item.capacidad_memoria  ;
                    if (item.capacidad_memoria >= 1000) {
                      textoDetalle = (item.capacidad_memoria / 1000) + " TB";
                    } else {
                      textoDetalle = item.capacidad_memoria + " GB";
                    }
                  } else if (categoriaActiva === "psu") {
                    textoDetalle = item.certificacion; 
                  } else if (categoriaActiva === "case") {
                    textoDetalle = item.tipo_iluminacion;
                  } else if (categoriaActiva === "cooling") {
                    textoDetalle = item.sockets_compatible;
                  } */
                
                  // 2. ZONA DE VISUALIZACIÓN
                  return (
                    <div key={item.id} className="bg-neutral-900 border border-neutral-700 p-4 rounded-xl hover:border-orange-500/50 transition-colors">
                      
                      <p className="text-orange-400 text-xs font-bold uppercase tracking-wider">
                        {item.marca}
                      </p>
                      
                      <h3 className="text-white font-bold text-lg leading-tight mb-3">
                        {item.modelo}
                      </h3>
                      
                      <h4 className="text-neutral-500 text-xs">
                        Número de serie: {item.id}
                      </h4>

                      <div className="mt-4 flex flex-wrap gap-2">
                        
                        {/* Píldora 1 */}
                        <div className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
                          <span className="text-[10px] text-neutral-500 uppercase font-bold mr-1">TIPO:</span>
                          <span className="text-xs text-neutral-300 font-medium">
                            {item.socket || item.formato_fisico || item.tipo || item.generacion || item.tipo_memoria || item.formato || "Genérico"}
                          </span>
                        </div>
                      
                        {/* Píldora 2 (¡Limpia y perfecta!) */}
                        <div className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
                          <span className="text-[10px] text-neutral-500 uppercase font-bold mr-1">Detalle:</span>
                          <span className="text-xs text-neutral-300 font-medium">
                            {textoDetalle}
                          </span>
                        </div>

                      </div>
                    </div>
                  ); // Aquí cerramos el return
                })} {/* Y AQUÍ cerramos la llave y el paréntesis del map correctamente */}
              
              </div>
          </div>
          )}
        </section>

        {/* COLUMNA DERECHA: La Estantería */}
        <aside className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-500 font-bold mb-4 text-sm">PERIFÉRICOS</p>
          
          <div className="flex flex-col gap-2">
            {estantesPerifericos.map(item => (
              <button
                key={item.id}
                onClick={() => setCategoriaActiva(item.id)}
                className={`p-3 rounded-lg text-left text-sm transition-colors
                  ${categoriaActiva === item.id 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }
                `}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </aside>

      </div>
    </main>
  );
}
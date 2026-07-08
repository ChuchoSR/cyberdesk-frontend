import React, { useState, useEffect } from "react";

const categorias = [
  { id: "cpu", label: "CPU", endpoint: "/procesadores" },
  { id: "motherboard", label: "Motherboard", endpoint: "/placas_madre" },
  { id: "ram", label: "RAM", endpoint: "/memoria_ram" },
  { id: "storage", label: "Almacenamiento", endpoint: "/almacenamiento" },
  { id: "gpu", label: "GPU", endpoint: "/tarjetas_video" },
  { id: "psu", label: "PSU", endpoint: "/fuentes_poder" },
  { id: "case", label: "Case", endpoint: "/gabinetes" },
  { id: "cooling", label: "Refrigeración", endpoint: "/refrigeracion" }
];

export default function MainSection({ categoriaVisible, buildActual, setBuildActual }) {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const infoCategoria = categorias.find(categoria => categoria.id === categoriaVisible);

        if (infoCategoria && infoCategoria.endpoint) {
            const url = import.meta.env.VITE_URL + infoCategoria.endpoint;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    setProductos(data);
                })
                .catch(error => {
                    console.error("Error al obtener los productos:", error);
                });
        }
    }, [categoriaVisible]);

    console.log("MI ENSAMBLE ACTUAL ES:", buildActual);
    return (
        <div className="mainSection">
            <h1 className="text-2xl font-bold mb-4 capitalize">Estás viendo: {categoriaVisible}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {productos.map(item => {
                    // 1. ZONA DE LÓGICA: Aquí metemos TU diccionario (el que hiciste ayer)
                    
                    const opcionesBusqueda = {
                        cpu: item.consumo_watts + "W",
                        ram: item.capacidad_memoria + "GB - " + item.frecuencia + "MHz",
                        gpu: item.memoria_vram,
                        motherboard: item.formato_fisico,
                        storage: item.capacidad_memoria >= 1000 ? (item.capacidad_memoria / 1000) + " TB" : item.capacidad_memoria + " GB",
                        psu: item.certificacion + " " + item.potencia_watts + "W",
                        case: item.tipo_iluminacion + " - " + item.formato,
                        cooling: item.sockets_compatible
                    };

                    // Extraemos el texto exacto usando la prop que nos pasó el Padre
                    let textoDetalle = opcionesBusqueda[categoriaVisible] || "Genérico";

                    // 2. ZONA DE VISUALIZACIÓN: Retornamos la tarjeta de Tailwind
                    return (
                        <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3 hover:border-blue-500 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{item.marca}</span>
                                    <h3 className="text-lg font-bold text-white leading-tight mt-1">{item.modelo}</h3>
                                </div>
                                <span className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded-md">ID: {item.id}</span>
                            </div>
                            <div className="mt-auto pt-4 border-t border-neutral-800">
                                
                                {/* AQUÍ INYECTAMOS TU VARIABLE MAGICA */}
                                <span className="text-sm text-neutral-400">{textoDetalle}</span>
                                <button 
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-colors"
                        onClick={() => {
                            setBuildActual({
                                ...buildActual,
                                [categoriaVisible]: item
                            });
                        }
                    }
                    >
                        Seleccionar
                    </button>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
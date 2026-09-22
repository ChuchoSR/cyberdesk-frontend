import React, { useState, useEffect } from "react";
import { filtrarCompatibilidad } from "../utils/aduanas.js";

const categorias = [
    { id: "motherboard", label: "Motherboard", endpoint: "/placas_madre" },
    { id: "cpu", label: "CPU", endpoint: "/procesadores" },
    { id: "storage", label: "Almacenamiento", endpoint: "/almacenamiento" },
    { id: "gpu", label: "GPU", endpoint: "/tarjetas_video" },
    { id: "psu", label: "PSU", endpoint: "/fuentes_poder" },
    { id: "case", label: "Case", endpoint: "/gabinetes" },
    { id: "cooling", label: "Refrigeración", endpoint: "/refrigeracion" },
    { id: "ram", label: "RAM", endpoint: "/memoria_ram" }
];

const diccionarioImagenes = {
    cpu: "/assets/cpu/cpu-default.png",
    motherboard: "/assets/mb/mb-default.png",
    ram: "/assets/ram/ram-default.png",
    storage: "/assets/storage/storage-default.png",
    gpu: "/assets/gpu/gpu-default.png",
    psu: "/assets/psu/psu-default.png",
    case: "/assets/case/case-default.png",
    cooling: "/assets/cooling/cooling-default.png"
};

export default function MainSection({ categoriaVisible, buildActual, setBuildActual }) {
    
    // La bóveda es un objeto {}
    const [boveda, setBoveda] = useState({}); 

    // useEffect con la lógica del Turbo
    useEffect(() => {
        // ¿Ya tenemos los datos?
        if (boveda[categoriaVisible]) {
            return; // Frenamos aquí
        }

        const infoCategoria = categorias.find(categoria => categoria.id === categoriaVisible);

        if (infoCategoria && infoCategoria.endpoint) {
            const url = import.meta.env.VITE_URL + infoCategoria.endpoint;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Guardamos sin borrar lo anterior
                    setBoveda(bovedaAnterior => ({
                        ...bovedaAnterior,
                        [categoriaVisible]: data
                    }));
                })
                .catch(error => console.error("Error de red:", error));
        }
    }, [categoriaVisible]); 

    let productosCrudos = boveda[categoriaVisible] || [];
    let productosAMostrar = filtrarCompatibilidad(categoriaVisible, buildActual, productosCrudos);

    function manejarSeleccion(item) {
        if (categoriaVisible === 'motherboard') {
            setBuildActual({
                ...buildActual,
                motherboard: item,
                cpu: null,
                ram: null
            });
        } else {
            setBuildActual({
                ...buildActual,
                [categoriaVisible]: item
            });
        }
    }

    // Evaluamos el estado inicial blindado contra mayúsculas
    const esInicio = categoriaVisible.toLowerCase() === "inicio"; 

    return (
        <div className="w-full h-full relative rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-neutral-950">
            
            {/* 1. EL FONDO PERSISTENTE (Nunca se destruye) */}
            <img 
                src="/assets/images/escritorio.png" 
                alt="Escritorio Setup" 
                className="absolute inset-0 w-full h-full object-cover object-center z-0" 
            />

            <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_100px_110px_#0a0a0a]"></div>

            {/* 2. LA CORTINA DE HUMO (Animación de opacidad) */}
            <div 
                className={`absolute inset-0 z-0 pointer-events-none transition-all duration-300 ease-in-out ${
                    esInicio ? "bg-neutral-950/10 backdrop-blur-none" : "bg-neutral-950/60 backdrop-filter: blur"
                }`}
            ></div>

            {/* 3. EL CONTENIDO (Lo que va por encima del escritorio) */}
            <div className="relative z-10 w-full h-full flex flex-col">
                
                {esInicio ? (
                    
                    /* --- VISTA A: TEXTOS DE BIENVENIDA --- */
                    <div className="h-full flex flex-col items-center justify-center -mt-10">
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                            Construye tu Santuario
                        </h2>
                        <p className="text-neutral-300 text-lg mb-8 font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            La precisión de la ingeniería se une a la calidez del diseño.
                        </p>
                        <div className="flex items-center gap-3 bg-neutral-900/70 border border-neutral-600/50 px-6 py-3 rounded-full text-neutral-200 backdrop-blur-md shadow-2xl">
                            <span className="opacity-70">🖱️</span>
                            <span className="font-semibold tracking-wide text-sm">Haz clic en un cajón para comenzar</span>
                        </div>
                    </div>

                ) : (
                    
                    /* --- VISTA B: CATÁLOGO DE TARJETAS --- */
                    <div className="p-4 h-full overflow-y-auto mainSection flex flex-col gap-3">
                        <h1 className="text-2xl font-bold mb-4 capitalize text-white drop-shadow-md">
                            Estás viendo: {categoriaVisible}
                        </h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10 animate-fade-in"
                            key={categoriaVisible}
                        >
                            
                            {productosAMostrar.map(item => {
                                
                                const opcionesBusqueda = {
                                    cpu: item.socket + " - Consumo: " + item.consumo_watts + "W - Gráficos integrados: " + item.grafico_integrados + " - BIOS: " + item.version_bios_req,                       
                                    ram: item.capacidad_memoria + "GB - " + item.frecuencia + " MHz - " + item.generacion + " - Voltaje: " + item.voltaje + "V - Latencia: " + item.latencia_cl + "cl - Perfil: " + item.perfil_optimizacion,
                                    gpu: item.memoria_vram,
                                    motherboard: item.formato_fisico + " - " + item.socket + " - " + item.generacion_ram + " - Frecuencia máx: " + item.frecuencia_max_ram + " MHz - BIOS: " + item.bios_stock + " - Flashback: " + item.bios_flashback,
                                    storage: item.capacidad_memoria >= 1000 ? (item.capacidad_memoria / 1000) + " TB" : item.capacidad_memoria + " GB" + " - " + item.formato_fisico + " - " + item.tecnologia,
                                    psu: item.certificacion + " " + item.potencia_watts + "W",
                                    case: item.tipo_iluminacion + " - " + item.formato,
                                    cooling: item.sockets_compatible
                                };

                                let textoDetalle = opcionesBusqueda[categoriaVisible] || "Genérico";

                                return (
                                    <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col opacity-90 justify-between hover:border-cyan-500 transition-colors h-full">
                                        
                                        {/* BLOQUE SUPERIOR: Imagen + Textos */}
                                        <div className="flex flex-row gap-4 mb-4">
                                            
                                            {/* Lado Izquierdo: IMAGEN (35%) */}
                                            <div className="w-[35%] bg-neutral-950/50 rounded-lg p-2 flex items-center justify-center border border-neutral-800/50">
                                                <img 
                                                    src={diccionarioImagenes[categoriaVisible]} 
                                                    alt={`Imagen genérica de ${categoriaVisible}`} 
                                                    className="w-full h-24 object-contain opacity-70 hover:opacity-100 transition-opacity drop-shadow-md"
                                                />
                                            </div>

                                            {/* Lado Derecho: INFO (65%) */}
                                            <div className="w-[65%] flex flex-col justify-center">
                                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.marca}</span>
                                                <h3 className="text-sm md:text-base font-bold text-white leading-tight mt-1 mb-2">{item.modelo}</h3>
                                                <span className="text-xs text-neutral-400 leading-snug">{textoDetalle}</span>
                                                <span className="mt-2 text-[9px] text-neutral-600">ID: {item.id}</span>
                                            </div>
                                            
                                        </div>

                                        {/* BLOQUE INFERIOR: Botón */}
                                        <button 
                                            className="w-full mt-auto py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all duration-300 bg-transparent border border-cyan-700 text-cyan-400 hover:bg-cyan-900/40 hover:border-cyan-400"
                                            onClick={() => manejarSeleccion(item)}
                                        >
                                            Seleccionar
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
import React, { useState, useEffect } from "react";

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
    cpu: "/src/assets/cpu/cpu-default.png",
    motherboard: "/src/assets/mb/mb-default.png",
    ram: "/src/assets/ram/ram-default.png",
    storage: "/src/assets/storage/storage-default.png",
    gpu: "/src/assets/gpu/gpu-default.png",
    psu: "/src/assets/psu/psu-default.png",
    case: "/src/assets/case/case-default.png",
    cooling: "/src/assets/cooling/cooling-default.png"
};
export default function MainSection({ categoriaVisible, buildActual, setBuildActual }) {
    
    // La bóveda es un objeto {}
    const [boveda, setBoveda] = useState({}); 

    // useEffect con la lógica del Turbo
    useEffect(() => {
        // ¿Ya tenemos los datos?
        if (boveda[categoriaVisible]) {
            console.log("Cargando instantáneamente", categoriaVisible);
            return; // Frenamos aquí
        }

        const infoCategoria = categorias.find(categoria => categoria.id === categoriaVisible);

        if (infoCategoria && infoCategoria.endpoint) {
            console.log("Consulta a Postgres por primera vez:", categoriaVisible);
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

    // 3. CORREGIDO: Una sola variable extrae los datos de la bóveda
    let productosAMostrar = boveda[categoriaVisible] || [];

    console.log("MI ENSAMBLE ACTUAL ES:", buildActual);

    // ==========================================
    // ADUANA DE PLACAS BASE (Múltiples coladores)
    // ==========================================
    if (categoriaVisible === "motherboard") {            
            // Colador 1: CPU (Socket)
            if (buildActual.cpu) {
                const { socket, consumo_watts } = buildActual.cpu;
                productosAMostrar = productosAMostrar.filter(mb => mb.socket === socket && mb.limite_watts_cpu >= consumo);
            }
            // Colador 2: RAM (Generación RAM)
            if (buildActual.ram) {
                const { generacion, frecuencia, perfil_optimizacion} = buildActual.ram;
                productosAMostrar = productosAMostrar.filter (mb => mb.generacion_ram === generacion && mb.frecuencia_max_ram >= frecuencia && mb.perfil_optimizacion === perfil_optimizacion);
            }
            // Colador 3: Case (Formato Físico) - VERSIÓN DICCIONARIO
            if (buildActual.case) {
                const { formato } = buildActual.case;

                // Diccionario de gabinetes
                const compatibilidadGabinete = {
                    "Mid-Tower": ["ATX", "Micro-ATX", "Mini-ITX"],
                    "Micro-ATX": ["Micro-ATX", "Mini-ITX"],
                    "Full-Tower": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"]
                };
                const formatosPermitidos = compatibilidadGabinete[formato] || [];
                // 3. EL NUEVO COLADOR
                productosAMostrar = productosAMostrar.filter(mb => formatosPermitidos.includes(mb.formato_fisico));
            }
        }

        // ==========================================
        // ADUANA DE CPU
        // ==========================================
        if (categoriaVisible === "cpu") {
            if (buildActual.motherboard) {
                const { socket, limite_watts_cpu } = buildActual.motherboard;
                productosAMostrar = productosAMostrar.filter(cpu => cpu.socket === socket && cpu.consumo_watts <= limite_watts_cpu);
            }
        }

        // ==========================================
        // ADUANA DE RAM
        // ==========================================
        if (categoriaVisible === "ram") {
            if (buildActual.motherboard) {
                const {generacion_ram, frecuencia_max_ram} = buildActual.motherboard;
                productosAMostrar = productosAMostrar.filter(ram => ram.generacion === generacion_ram && ram.frecuencia <= frecuencia_max_ram);
            }
        }

        // ==========================================
        // ADUANA DE COOlER
        // ==========================================
        if (categoriaVisible === 'cooling') {
            if (buildActual.cpu) {
                const {socket} = buildActual.cpu;
                productosAMostrar = productosAMostrar.filter(cooler => cooler.sockets_compatible?.includes(socket))
            }
        }

        // ==========================================
        // ADUANA DE PSU
        // ==========================================
        if (categoriaVisible === 'psu') {
            let piezasElegidas = Object.values(buildActual);
            let consumoTotal = piezasElegidas.reduce((total, pieza) => {
                return (total + (pieza?.consumo_watts || 0) );
            }, 0)
            let consumoRecomendado = consumoTotal + (0.1 * consumoTotal);
            productosAMostrar = productosAMostrar.filter(psu => psu.potencia_watts >= consumoRecomendado);
        }

        // ==========================================
        // ADUANA DE CASE
        // ==========================================
        if (categoriaVisible === 'case') {
            if (buildActual.motherboard) {
            const formatoPlaca = buildActual.motherboard.formato_fisico;
        
        // El mismo diccionario de compatibilidad
            const compatibilidadGabinete = {
            "Full-Tower": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], 
            "Mid-Tower": ["ATX", "Micro-ATX", "Mini-ITX"],           
            "Micro-ATX": ["Micro-ATX", "Mini-ITX"],                  
            "Mini-ITX": ["Mini-ITX"]
        };

            productosAMostrar = productosAMostrar.filter(gabinete => {
            const formatosQueSoportaEsteGabinete = compatibilidadGabinete[gabinete.formato] || [];
            return formatosQueSoportaEsteGabinete.includes(formatoPlaca);
        });
    }
        }


        function manejarSeleccion (item) {
            if (categoriaVisible === 'motherboard') {
                                setBuildActual({
                                    ...buildActual,
                                    motherboard: item,
                                    cpu: null,
                                    ram: null
                                })
                            } else {
                                setBuildActual({
                                    ...buildActual,
                                    [categoriaVisible]: item
                                });
                            }
        }

    return (
        <div className=
            "bg-black rounded-xl p-4 flex flex-col gap-3 border-2 border-neutral-800 transition-all hover:-translate-y-2 duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/40 mainSection">
            <h1 className="text-2xl font-bold mb-4 capitalize">Estás viendo: {categoriaVisible}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {productosAMostrar.map(item => {
                    // Conficionamos un objeto con las opciones de búsqueda para cada categoría
                    
                    const opcionesBusqueda = {
                        cpu: item.socket + " - " + "Consumo : " + item.consumo_watts + "W" + " - " + "Gráficos integrados : " + item.grafico_integrados + " - " + "Versión de BIOS : " + item.version_bios_req,                       
                        ram: item.capacidad_memoria + "GB - " + item.frecuencia + " MHz " + " - " + item.generacion + " - " +"Voltaje : " + item.voltaje + "V" + " - " + "Latencia : " + item.latencia_cl + "cl" +" - " + "Perfil de optimización : " + item.perfil_optimizacion,
                        gpu: item.memoria_vram,
                        motherboard: item.formato_fisico + " - " + item.socket + " - " + item.generacion_ram + " - " + "Frecuencia máxima" + " : " + item.frecuencia_max_ram + " MHz" + " - " + "Versión de Bios" + " : "+ item.bios_stock + " - " + "Bios flashback : " + item.bios_flashback,
                        storage: item.capacidad_memoria >= 1000 ? (item.capacidad_memoria / 1000) + " TB" : item.capacidad_memoria + " GB" + " - " + item.formato_fisico + " - " + item.tecnologia,
                        psu: item.certificacion + " " + item.potencia_watts + "W",
                        case: item.tipo_iluminacion + " - " + item.formato,
                        cooling: item.sockets_compatible
                    };

                    // Extraemos el texto exacto usando la prop que nos pasó el Padre
                    let textoDetalle = opcionesBusqueda[categoriaVisible] || "Genérico";

                    // 2. ZONA DE VISUALIZACIÓN: Retornamos la tarjeta de Tailwind
                    return (
                        <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500 transition-colors h-full">
        
                            {/* BLOQUE SUPERIOR: Imagen + Textos */}
                            <div className="flex flex-row gap-4 mb-4">
                                
                                {/* Lado Izquierdo: IMAGEN (65%) */}
                                <div className="w-[35%] bg-neutral-950/50 rounded-lg p-2 flex items-center justify-center border border-neutral-800/50">
                                    <img 
                                        src={diccionarioImagenes[categoriaVisible]} 
                                        alt={`Imagen genérica de ${categoriaVisible}`} 
                                        className="w-full h-24 object-contain opacity-70 hover:opacity-100 transition-opacity drop-shadow-md"
                                    />
                                </div>

                                {/* Lado Derecho: INFO (35%) */}
                                <div className="w-[65%] flex flex-col justify-center">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.marca}</span>
                                    <h3 className="text-sm md:text-base font-bold text-white leading-tight mt-1 mb-2">{item.modelo}</h3>
                                    <span className="text-xs text-neutral-400 leading-snug">{textoDetalle}</span>
                                    {/* ID Oculto o Pequeño si lo necesitas */}
                                    <span className="mt-2 text-[9px] text-neutral-600">ID: {item.id}</span>
                                </div>
                                
                            </div>

                            {/* BLOQUE INFERIOR: Botón (100% ancho) */}
                            <button 
                                className="w-full mt-auto py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all duration-300 bg-transparent border border-cyan-700 text-cyan-400 hover:bg-cyan-900/40 hover:border-cyan-400"
                                onClick={() => {
                                    setBuildActual({
                                        ...buildActual,
                                        [categoriaVisible]: item
                                    });
                                }}
                            >
                                Seleccionar
                            </button>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}




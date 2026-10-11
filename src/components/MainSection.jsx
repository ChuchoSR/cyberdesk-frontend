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
    
    // 1. ESTADO DEL TURBO
    const [boveda, setBoveda] = useState({}); 

    useEffect(() => {
        if (boveda[categoriaVisible]) return; 

        const infoCategoria = categorias.find(categoria => categoria.id === categoriaVisible);
        if (infoCategoria && infoCategoria.endpoint) {
            const url = import.meta.env.VITE_URL + infoCategoria.endpoint;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    setBoveda(bovedaAnterior => ({
                        ...bovedaAnterior,
                        [categoriaVisible]: data
                    }));
                })
                .catch(error => console.error("Error de red:", error));
        }
    }, [categoriaVisible]); 

    // 2. ADUANAS DE COMPATIBILIDAD
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

    // 3. RUTAS INTERNAS (Quién se muestra en pantalla)
    const categoriaMinuscula = categoriaVisible.toLowerCase();
    const esInicio = categoriaMinuscula === "inicio"; 
    const esReporte = categoriaMinuscula === "reporte";
    const esCatalogo = !esInicio && !esReporte;

    // 4. LÓGICA DEL REPORTE DE RENDIMIENTO (Solo se calcula si estamos en reporte)
    const categoriasVitales = [
        { id: 'cpu', nombre: 'Procesador' },
        { id: 'motherboard', nombre: 'Placa Base' },
        { id: 'ram', nombre: 'Memoria RAM' },
        { id: 'psu', nombre: 'Fuente de Poder' },
        { id: 'gpu', nombre: 'Tarjeta de Video' }
    ];
    const faltantes = categoriasVitales.filter(cat => !buildActual[cat.id]);
    const setupIncompleto = faltantes.length > 0;

    const piezasElegidas = Object.values(buildActual);
    const consumoTotal = piezasElegidas.reduce((total, pieza) => total + (pieza?.consumo_watts || 0), 0);
    const potenciaFuente = buildActual.psu?.potencia_watts || 0;
    const alertaEnergia = potenciaFuente > 0 && potenciaFuente < (consumoTotal * 1.1);

    const tieneVRM = buildActual.cpu && buildActual.motherboard;
    let porcentajeEstresVRM = 0;
    let peligroTermico = false;
    if (tieneVRM) {
        const cpuWatts = buildActual.cpu.consumo_watts || 0;
        const limitePlaca = buildActual.motherboard.limite_watts_cpu || 999; 
        porcentajeEstresVRM = Math.round((cpuWatts / limitePlaca) * 100);
        peligroTermico = porcentajeEstresVRM > 85;
    }

    const tieneRAMyPlaca = buildActual.ram && buildActual.motherboard;
    let desperdicioRAM = false;
    let limiteRAMPlaca = 0;
    let velocidadRAM = 0;
    if (tieneRAMyPlaca) {
        velocidadRAM = buildActual.ram.frecuencia || 0;
        limiteRAMPlaca = buildActual.motherboard.frecuencia_max_ram || 9999;
        desperdicioRAM = velocidadRAM > limiteRAMPlaca;
    }

    const tieneVentilacion = buildActual.cooling && buildActual.case;
    let escudoTermicoActivo = false;
    if (tieneVentilacion) {
        const tipoRefrigeracion = buildActual.cooling.tipo || '';
        const tamanoRadiador = buildActual.cooling.tamano_radiador || 0;
        const ventiladoresGabinete = buildActual.case.ventiladores_incluidos || 0;
        escudoTermicoActivo = (tipoRefrigeracion.includes('Liquida') && tamanoRadiador >= 240) || (ventiladoresGabinete >= 3);
    }

    let puntajeFinal = 100;
    if (alertaEnergia) puntajeFinal -= 40;
    if (peligroTermico) puntajeFinal -= 25;
    if (desperdicioRAM) puntajeFinal -= 15;
    if (tieneVentilacion && !escudoTermicoActivo) puntajeFinal -= 10;
    puntajeFinal = Math.max(0, puntajeFinal);

    let colorTacometro = "border-cyan-500 shadow-cyan-500/50 text-cyan-400"; 
    if (puntajeFinal < 85) colorTacometro = "border-yellow-500 shadow-yellow-500/50 text-yellow-400"; 
    if (puntajeFinal < 60 || alertaEnergia || peligroTermico) colorTacometro = "border-red-500 shadow-red-500/50 text-red-500"; 


    // ==========================================
    // 5. EL LIENZO MAESTRO (EL ÚNICO RETURN)
    // ==========================================
    return (
        <div className="w-full h-full relative rounded-2xl overflow-hidden flex flex-col bg-neutral-950">
            
            {/* FONDO PERSISTENTE */}
            <img 
                src="/assets/images/escritorio.png" 
                alt="Escritorio Setup" 
                className="absolute inset-0 w-full h-full object-cover object-center z-0" 
            />
            <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_100px_110px_#0a0a0a]"></div>

            {/* CORTINA DE HUMO DINÁMICA */}
            <div 
                className={`absolute inset-0 z-0 pointer-events-none transition-all duration-300 ease-in-out ${
                    esInicio ? "bg-neutral-950/20 backdrop-blur-none" : "bg-neutral-950/80 backdrop-blur-sm"
                }`}
            ></div>

            {/* CONTENIDO SUPERPUESTO (Z-10) */}
            <div className="relative z-10 w-full h-full flex flex-col">
                
                {/* --- VISTA A: INICIO --- */}
                {esInicio && (
                    <div className="h-full flex flex-col items-center justify-center -mt-10 animate-fade-in">
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
                )}

                {/* --- VISTA B: REPORTE DE RENDIMIENTO --- */}
                {esReporte && (
                    <div className="w-full h-full p-6 overflow-y-auto animate-fade-in flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-white mb-8 border-b border-neutral-800 pb-4 w-full max-w-3xl text-center">
                            📊 Análisis de Rendimiento
                        </h2>

                        <div className="w-full max-w-3xl flex flex-col gap-10 items-center">
                            
                            {/* TACÓMETRO */}
                            <div className="flex flex-col items-center justify-center">
                                <div className={`relative w-56 h-56 rounded-full bg-neutral-900/60 border-8 ${colorTacometro} shadow-[0_0_30px_rgba(0,0,0,0)] flex items-center justify-center transition-all duration-700 backdrop-blur-md`}>
                                    <div className="absolute inset-2 rounded-full border border-neutral-800/50"></div>
                                    <div className="flex flex-col items-center z-10">
                                        {setupIncompleto ? (
                                            <span className="text-4xl font-extrabold text-neutral-500">--</span>
                                        ) : (
                                            <span className={`text-6xl font-black ${colorTacometro.split(' ').pop()}`}>{puntajeFinal}</span>
                                        )}
                                        <span className="text-neutral-400 text-sm tracking-widest uppercase mt-2 font-bold">
                                            {setupIncompleto ? "En Espera" : "Puntos"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* LISTA DE CHEQUEO (Tarjetas transparentes) */}
                            <div className="w-full flex flex-col gap-4 text-center">
                                {setupIncompleto && (
                                    <div className="p-4 rounded-xl border bg-yellow-900/30 border-yellow-500/50 backdrop-blur-sm">
                                        <span className="font-bold text-yellow-400 text-lg block mb-1">🚧 Análisis Parcial</span>
                                        <span className="text-neutral-300 text-sm block">El tacómetro se activará al agregar: <span className="font-bold text-white">{faltantes.map(f => f.nombre).join(", ")}</span>.</span>
                                    </div>
                                )}

                                {consumoTotal > 0 && (
                                    <div className={`p-4 rounded-xl border backdrop-blur-sm ${alertaEnergia ? "bg-red-900/40 border-red-500" : buildActual.psu ? "bg-green-900/20 border-green-500/50" : "bg-neutral-800/40 border-neutral-600"}`}>
                                        <span className="font-bold text-white text-md block mb-1">{alertaEnergia ? "⚡ Alerta Crítica de Energía" : buildActual.psu ? "⚡ Suministro Eléctrico Estable" : "⚡ Consumo Estimado"}</span>
                                        <span className="text-neutral-300 text-sm block">Consumo total: <strong>{consumoTotal}W</strong>. {buildActual.psu ? ` Tu fuente entrega ${potenciaFuente}W.` : " Sin fuente."}</span>
                                    </div>
                                )}

                                {tieneVRM && (
                                    <div className={`p-4 rounded-xl border backdrop-blur-sm ${peligroTermico ? "bg-red-900/40 border-red-500" : "bg-green-900/20 border-green-500/50"}`}>
                                        <span className="font-bold text-white text-md block mb-1">{peligroTermico ? "⚠️ Peligro Térmico en VRM" : "✅ Estrés Térmico Óptimo"}</span>
                                        <span className="text-neutral-300 text-sm block">El procesador consume el <strong>{porcentajeEstresVRM}%</strong> del límite de tu placa base.</span>
                                    </div>
                                )}

                                {tieneRAMyPlaca && (
                                    <div className={`p-4 rounded-xl border backdrop-blur-sm ${desperdicioRAM ? "bg-orange-900/40 border-orange-500" : "bg-green-900/20 border-green-500/50"}`}>
                                        <span className="font-bold text-white text-md block mb-1">{desperdicioRAM ? "📉 Cuello de Botella en RAM" : "✅ Frecuencia de Memoria Óptima"}</span>
                                        <span className="text-neutral-300 text-sm block">{desperdicioRAM ? `Limitada a ${limiteRAMPlaca}MHz por la Placa Base.` : `Corriendo a ${velocidadRAM}MHz sin restricciones.`}</span>
                                    </div>
                                )}

                                {tieneVentilacion && (
                                    <div className={`p-4 rounded-xl border backdrop-blur-sm ${escudoTermicoActivo ? "bg-cyan-900/20 border-cyan-500/50" : "bg-orange-900/40 border-orange-500"}`}>
                                        <span className="font-bold text-white text-md block mb-1">{escudoTermicoActivo ? "❄️ Escudo Térmico Activo" : "⚠️ Flujo de Aire Deficiente"}</span>
                                        <span className="text-neutral-300 text-sm block">{escudoTermicoActivo ? "Tu combinación de chasis y disipación es segura." : "Riesgo térmico. Mejora la ventilación o disipación."}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VISTA C: CATÁLOGO DE PIEZAS (Tus cards originales) --- */}
                {esCatalogo && (
                    <div className="p-4 h-full overflow-y-auto mainSection flex flex-col gap-3 animate-fade-in">
                        <h1 className="text-2xl font-bold mb-4 capitalize text-white drop-shadow-md">
                            Estás viendo: {categoriaVisible}
                        </h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                            {productosAMostrar.map(item => {
                                const opcionesBusqueda = {
                                    cpu: item.socket + " - Consumo : " + item.consumo_watts + "W - Gráficos integrados : " + item.grafico_integrados + " - BIOS : " + item.version_bios_req,                       
                                    ram: item.capacidad_memoria + "GB - " + item.frecuencia + " MHz - " + item.generacion + " - Voltaje : " + item.voltaje + "V - Latencia : " + item.latencia_cl + "cl - Perfil : " + item.perfil_optimizacion,
                                    gpu: item.memoria_vram + " - " + item.tipo_memoria + " - Consumo: " + item.consumo_watts + " W - Longitud: " + item.longitud + " mm - Conector: " + item.conectores_energia,
                                    motherboard: item.formato_fisico + " - " + item.socket + " - " + item.generacion_ram + " - Frec. máx : " + item.frecuencia_max_ram + " MHz - BIOS : " + item.bios_stock + " - Flashback : " + item.bios_flashback,
                                    storage: (item.capacidad_memoria >= 1000 ? (item.capacidad_memoria / 1000) + " TB" : item.capacidad_memoria + " GB") + " - " + item.formato_fisico + " - " + item.tecnologia,
                                    psu: item.certificacion + " " + item.potencia_watts + "W",
                                    case: item.formato + " - Iluminación: " + item.tipo_iluminacion + " - Ventiladores: " + item.ventiladores_incluidos + " - GPU Max: " + item.espacio_maximo_gpu_mm + " mm", 
                                    cooling: "Sockets: " + item.sockets_compatible + " - Tipo: " + item.tipo + " - Conexión: " + item.tipo_conexion
                                };

                                let textoDetalle = opcionesBusqueda[categoriaVisible] || "Genérico";

                                return (
                                    <div key={item.id} className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500 transition-colors h-full">
                                        
                                        <div className="flex flex-row gap-4 mb-4">
                                            <div className="w-[35%] bg-neutral-950/50 rounded-lg p-2 flex items-center justify-center border border-neutral-800/50">
                                                <img 
                                                    src={diccionarioImagenes[categoriaVisible]} 
                                                    alt={`Imagen genérica de ${categoriaVisible}`} 
                                                    className="w-full h-24 object-contain opacity-70 hover:opacity-100 transition-opacity drop-shadow-md"
                                                />
                                            </div>

                                            <div className="w-[65%] flex flex-col justify-center">
                                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.marca}</span>
                                                <h3 className="text-sm md:text-base font-bold text-white leading-tight mt-1 mb-2">{item.modelo}</h3>
                                                <span className="text-xs text-neutral-400 leading-snug">{textoDetalle}</span>
                                                <span className="mt-2 text-[9px] text-neutral-600">ID: {item.id}</span>
                                            </div>
                                        </div>

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
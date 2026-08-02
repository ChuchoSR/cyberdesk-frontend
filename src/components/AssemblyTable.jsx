
export default function AssemblyTable({ buildActual }) {
    return (
        <div className="bg-neutral-900 rounded-2xl border-2 border-cyan-400 sahdow-2xl shadow-cyan-500/50 relative w-full h-full">
            
            { !buildActual.case && (
                <div className="absolute z-50 bg-red-900/80 border border-red-500 text-yellow-400 text-xl font-bold p-6 rounded-xl backdrop-blur-sm shadow-2xl">
                    ⚠️ Lienzo vacío. ¡Elige un Gabinete para estructurar el ensamble!
                </div>
            )}

            { buildActual.case && (
                <img src={buildActual.case.imagen} className="absolute top-0 left-0 w-full h-full object-contain z-0" alt="Gabinete" />
            )}

            { buildActual.motherboard && (
                <img src={buildActual.motherboard.imagen} className="absolute top-0 left-0 w-full h-full object-contain z-10" alt="Placa Madre" />
            )}

            { buildActual.cpu && (
                <img src={buildActual.cpu.imagen} className="absolute top-0 left-0 w-full h-full object-contain z-20" alt="Procesador" />
            )}

            { buildActual.psu && (
                <img src={buildActual.psu.imagen} className="absolute top-0 left-0 w-full h-full object-contain z-10" alt="Fuente de Poder" />
            )}

            { buildActual.ram && (
                <img src={buildActual.ram.imagen} className="absolute top-0 left-0 w-full h-full object-contain z-10" alt="Memoria RAM" />
            )}

            { buildActual.almacenamiento && (
                <img src={buildActual.almacenamiento.imagen} className="absolute top-0 left-0 w-full h-full object-contain z-10" alt="Almacenamiento" />
            )}

            { buildActual.refrigeración && (
                <img src={buildActual.refrigeración.imagen} className="absolute top-0 left-0 w-full h-full object-contain z-10" alt="Refrigeración" />
            )}

            { buildActual.gpu && (
                <img src={buildActual.gpu.imagen} className="absolute top-0 left-0 w-full h-full object-contain z-10" alt="Tarjeta de Video" />
            )}
        </div>
    );
}

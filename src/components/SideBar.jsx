const menuBotones = [
    { id: "case", texto: "Case" },
    { id: "motherboard", texto: "Placa Base" },
    { id: "cpu", texto: "CPU" },
    { id: "ram", texto: "Memoria Ram" },
    { id: "storage", texto: "Almacenamiento" },
    { id: "gpu", texto: "Tarjeta de Video" },
    { id: "psu", texto: "Fuente de Poder" },
    { id: "cooling", texto: "Refrigeración" }
];

export default function SideBar({ categoriaActual, cambiarCategoria, buildActual, setBuildActual, verMesa, setVerMesa }) {

    const TODAS_LAS_CATEGORIAS = ["motherboard", "cpu", "ram", "storage", "gpu", "psu", "case", "cooling"];
    const cantidadPiezas = Object.keys(buildActual).length;
    const buildCompleto = cantidadPiezas === 8;

    return (
        <div className="w-64 h-full bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between p-4">
            
            <div>
                <h1 className="text-xl font-bold text-white mb-1">Cajones de componentes</h1>
                <h3 className="text-sm text-neutral-400 mb-6">Selecciona tu hardware</h3>
                {/* NUEVO: Contador dinámico del progreso */}
                <button
                    
                    disabled={ cantidadPiezas === 0 }
                    
                    onClick={() => setVerMesa(true)}
                    
                    className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${
                        cantidadPiezas === 0 
                        ? "bg-neutral-800 text-neutral-600 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    }`}
                    >
                    Progreso del Build: {cantidadPiezas} / 8
                </button>

                <div className="mb-6 flex flex-col gap-2">
                    {TODAS_LAS_CATEGORIAS.map(categoria => {
                        
                        // 1. Extraemos la pieza. Si no la has elegido aún, esto valdrá 'undefined'
                        const pieza = buildActual[categoria];

                        const estilosCajon = pieza ? "bg-black border-2 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] text-white" : "bg-neutral-800 border-2 border-dashed border-neutral-700 text-neutral-500 opacity-60";

                        return (
                            <div key={categoria} className={`p-0 rounded-lg flex flex-col transition-all duration-300 ${estilosCajon}`}>

                                {/* 3. Renderizado Condicional del Contenido */}
                                {pieza ? (
                                    <>
                                        <span className="text-green-400 font-bold uppercase text-[10px] tracking-widest">{categoria} ✅</span>
                                        <span className="text-sm font-semibold truncate mt-1">{pieza.marca} {pieza.modelo}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">{categoria} ❌</span>
                                        <span className="text-xs italic mt-1 text-neutral-600">Esperando selección...</span>
                                    </>
                                )}

                            </div>
                        );
                    })}
                </div>
                
                <nav className="flex flex-col gap-0">
                    {menuBotones.map(boton => (
                        <button
                            key={boton.id}
                            onClick={ () => cambiarCategoria(boton.id)}
                            className= 
                                {categoriaActual === boton.id ? 
                                    "text-left text-white bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors font-bold" 
                                    : 
                                    "text-left text-neutral-400 hover:bg-neutral-800 px-4 py-2 rounded-lg font-medium transition-colors"}
                        >
                            {categoriaActual === boton.id ? `${boton.texto} Seleccionado`  : boton.texto}
                        </button>
                    ))}
                    
                </nav>
            </div>

            <div>
                <button 
                disabled={!buildCompleto}
                className={"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors" + (buildCompleto ? "" : " opacity-50 cursor-not-allowed")}

                    onClick={async () => {
                        try {
                            // Ojo: Usamos el signo de interrogación (Optional Chaining, ej: buildActual.cpu?.id) 
                            // por si el usuario dejó alguna pieza en blanco, para que no explote React.
                            const paqueteParaBackend = {
                                nombres_creador: "Ingeniero CyberDesk", // Nombre fijo por ahora
                                cpu_id: buildActual.cpu?.id,
                                ram_id: buildActual.ram?.id,
                                almacenamiento_id: buildActual.storage?.id,
                                psu_id: buildActual.psu?.id,
                                gabinete_id: buildActual.case?.id,
                                refrigeracion_id: buildActual.cooling?.id,
                                mb_id: buildActual.motherboard?.id,
                                gpu_id: buildActual.gpu?.id
                            };
                            
                            const url = import.meta.env.VITE_URL + "/ensambles";
                            
                            const respuesta = await fetch(url, {
                                method: 'POST',

                                headers: {
                                    'Content-Type': 'application/json'
                                },

                                body: JSON.stringify(paqueteParaBackend)
                                // 3. Define el body (convirtiendo tu 'paqueteParaBackend' a texto JSON)
                            });

                            if (respuesta.ok) {
                                const data = await respuesta.json();
                                console.log("Ensamble guardado con ID:", data.id);
                                alert('¡Has completado tu Build y está guardado en la Base de Datos!');
                                setBuildActual({}); // Vaciamos el carrito
                            } else {
                                alert('El servidor rechazó el ensamble.');
                            }

                        } catch (error) {
                            console.error("Error de red:", error);
                            alert("Hubo un error al intentar comunicarse con el servidor.");
                        }
                    }}
                >
                    Finalizar Build
                </button>
                <button 
    onClick={() => setBuildActual({})}
    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-4"
>
    Limpiar Carrito
</button>
            </div>
            
        </div>
    );
}
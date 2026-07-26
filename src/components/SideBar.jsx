export default function SideBar({ categoriaActual, cambiarCategoria, buildActual, setBuildActual }) {

    const TODAS_LAS_CATEGORIAS = ["motherboard", "cpu", "ram", "storage", "gpu", "psu", "case", "cooling"];
    const cantidadPiezas = Object.keys(buildActual).length;
    const buildCompleto = cantidadPiezas === 8;

    return (
        <div className="w-64 h-full bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between p-4">
            
            <div>
                <h1 className="text-xl font-bold text-white mb-1">Cajones de componentes</h1>
                <h3 className="text-sm text-neutral-400 mb-6">Selecciona tu hardware</h3>
                {/* NUEVO: Contador dinámico del progreso */}
                <div className="bg-neutral-800 text-blue-400 text-xs font-bold px-3 py-2 rounded-lg mb-6 uppercase tracking-wider text-center border border-blue-900/30">
                    Progreso del Build: {Object.keys(buildActual).length} / 8
                </div>

                <div className="mb-6 flex flex-col gap-2">
                    {TODAS_LAS_CATEGORIAS.map(categoria => {
                        
                        // 1. Extraemos la pieza. Si no la has elegido aún, esto valdrá 'undefined'
                        const pieza = buildActual[categoria];

                        const estilosCajon = pieza ? "bg-black border-2 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] text-white" : "bg-neutral-800 border-2 border-dashed border-neutral-700 text-neutral-500 opacity-60";

                        return (
                            <div key={categoria} className={`p-3 rounded-lg flex flex-col transition-all duration-300 ${estilosCajon}`}>

                                {/* 3. Renderizado Condicional del Contenido */}
                                {pieza ? (
                                    <>
                                        <span className="text-green-400 font-bold uppercase text-[10px] tracking-widest">{categoria} ✅</span>
                                        <span className="text-sm font-semibold truncate mt-1">{pieza.marca} {pieza.modelo}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">{categoria} ❌</span>
                                        <span className="text-sm italic mt-1 text-neutral-600">Esperando selección...</span>
                                    </>
                                )}

                            </div>
                        );
                    })}
                </div>
                
                <nav className="flex flex-col gap-2">
                    <button className="text-left text-white bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => cambiarCategoria("case")}>
                        {categoriaActual === "case" ? "Case (Seleccionado)" : "Case"}
                    </button>
                    <button className="text-left text-neutral-400 hover:bg-neutral-800 px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => cambiarCategoria("motherboard")}>
                        {categoriaActual === "motherboard" ? "Placa Base (Seleccionado)" : "Placa Base"}
                    </button>
                    <button className="text-left text-white bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => cambiarCategoria("cpu")}>
                        {categoriaActual === "cpu" ? "CPU (Seleccionado)" : "CPU"}
                    </button>
                    <button className="text-left text-neutral-400 hover:bg-neutral-800 px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => cambiarCategoria("ram")}>
                        {categoriaActual === "ram" ? "Memoria Ram (Seleccionado)" : "Memoria Ram"}
                    </button>
                    <button className="text-left text-white bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => cambiarCategoria("storage")}>
                        {categoriaActual === "storage" ? "Almacenamiento (Seleccionado)" : "Almacenamiento"}
                    </button>
                    <button className="text-left text-neutral-400 hover:bg-neutral-800 px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => cambiarCategoria("gpu")}>
                        {categoriaActual === "gpu" ? "Tarjeta de Video(Seleccionado)" : "Tarjeta de Video"}
                    </button>
                    <button className="text-left text-white bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => cambiarCategoria("psu")}>
                        {categoriaActual === "psu" ? "Fuente de Poder (Seleccionado)" : "Fuente de Poder"}
                    </button>
                    <button className="text-left text-neutral-400 hover:bg-neutral-800 px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => cambiarCategoria("cooling")}>
                        {categoriaActual === "cooling" ? "Refrigeración (Seleccionado)" : "Refrigeración"}
                    </button>
                    
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
            </div>
            
        </div>
    );
}
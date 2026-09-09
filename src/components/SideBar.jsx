const menuBotones = [
    { id: "case", texto: "Case", icono: "/assets/icons/case.png" },
    { id: "motherboard", texto: "Placa Base", icono: "/assets/icons/mobo.png" },
    { id: "cpu", texto: "CPU", icono: "/assets/icons/cpu.png" },
    { id: "ram", texto: "Memoria Ram", icono: "/assets/icons/ram.png" },
    { id: "storage", texto: "Almacenamiento", icono: "/assets/icons/almacenamiento.png" },
    { id: "gpu", texto: "Tarjeta de Video", icono: "/assets/icons/gpu.png" },
    { id: "psu", texto: "Fuente de Poder", icono: "/assets/icons/psu.png" },
    { id: "cooling", texto: "Refrigeración", icono: "/assets/icons/cooler.png" }
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

                
                
                <nav className="flex flex-col gap-0">
                    {menuBotones.map(boton => (
                        <button
                            key={boton.id}
                            onClick={ () => cambiarCategoria(boton.id)}
                            className= 
                                {categoriaActual === boton.id ? 
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold tracking-wide transition-all duration-300 shadow-lg shadow-blue-600/20" 
                                    : 
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 font-medium transition-all duration-300"}
                        >
                            <img src={boton.icono} alt={`Icono de ${boton.texto}`} className="w-6 h-6 opacity-90" />
                            <span>{categoriaActual === boton.id ? `${boton.texto} Seleccionado` : boton.texto}</span>
                            {buildActual[boton.id] ? <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] ml-auto"></div>
                                                    :
                                                    <div className="w-2 h-2 rounded-full bg-neutral-700 shadow-[0_0_8px_rgba(239,68,68,0.8)] ml-auto"></div>}
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
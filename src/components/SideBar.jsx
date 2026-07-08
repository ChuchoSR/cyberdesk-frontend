export default function SideBar({ categoriaActual, cambiarCategoria, buildActual }) {

    const cantidadPiezas = Object.keys(buildActual).length;
    const buildCompleto = cantidadPiezas === 8;

    return (
        <div className="w-64 h-full bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between p-4">
            
            {/* Bloque Superior: Títulos y Menú */}
            <div>
                <h1 className="text-xl font-bold text-white mb-1">Cajones de componentes</h1>
                <h3 className="text-sm text-neutral-400 mb-6">Selecciona tu hardware</h3>
                {/* NUEVO: Contador dinámico del progreso */}
                <div className="bg-neutral-800 text-blue-400 text-xs font-bold px-3 py-2 rounded-lg mb-6 uppercase tracking-wider text-center border border-blue-900/30">
                    Progreso del Build: {Object.keys(buildActual).length} / 8
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

            {/* Bloque Inferior: Botón Final */}
            <div>
                <button 
                disabled={!buildCompleto}
                className={"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors" + (buildCompleto ? "" : " opacity-50 cursor-not-allowed")}
                >
                    Finalizar Build
                </button>
            </div>
            
        </div>
    );
}
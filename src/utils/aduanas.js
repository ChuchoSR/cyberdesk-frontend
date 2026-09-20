export function filtrarCompatibilidad(categoriaVisible, buildActual, productosBase) {
    
    let productosFiltrados = [...productosBase];

    // ==========================================
    // ADUANA DE PLACAS BASE
    // ==========================================
    if (categoriaVisible === "motherboard") {
        
        if (buildActual.cpu) {
            // RESTAURADO: Filtro de socket y consumo eléctrico
            const { socket, consumo_watts } = buildActual.cpu;
            productosFiltrados = productosFiltrados.filter(mb => 
                mb.socket === socket && (mb.limite_watts_cpu || 999) >= consumo_watts
            );
        }
        
        if (buildActual.ram) {
            // RESTAURADO: Filtro de generación, frecuencia y perfil
            const { generacion, frecuencia, perfil_optimizacion } = buildActual.ram;
            productosFiltrados = productosFiltrados.filter(mb => 
                mb.generacion_ram === generacion && 
                mb.frecuencia_max_ram >= frecuencia && 
                mb.perfil_optimizacion === perfil_optimizacion
            );
        }
        
        if (buildActual.case) {
            const { formato } = buildActual.case;
            const compatibilidadGabinete = {
                "ATX": ["ATX", "Micro-ATX", "Mini-ITX"], // RESTAURADO: La llave ATX
                "Mid-Tower": ["ATX", "Micro-ATX", "Mini-ITX"],
                "Micro-ATX": ["Micro-ATX", "Mini-ITX"],
                "Full-Tower": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"]
            };
            const formatosPermitidos = compatibilidadGabinete[formato] || [];
            productosFiltrados = productosFiltrados.filter(mb => formatosPermitidos.includes(mb.formato_fisico));
        }
    }

    // ==========================================
    // ADUANA DE CPU
    // ==========================================
    if (categoriaVisible === "cpu") {
        if (buildActual.motherboard) {
            // CORREGIDO: Typo en limite_watts_cpu
            const { socket, limite_watts_cpu } = buildActual.motherboard;
            productosFiltrados = productosFiltrados.filter(cpu => 
                cpu.socket === socket && cpu.consumo_watts <= (limite_watts_cpu || 999)
            ); 
        }
    }

    // ==========================================
    // ADUANA DE RAM
    // ==========================================
    if (categoriaVisible === "ram") {
        if (buildActual.motherboard) {
            const { generacion_ram, frecuencia_max_ram } = buildActual.motherboard;
            productosFiltrados = productosFiltrados.filter(ram => 
                ram.generacion === generacion_ram && ram.frecuencia <= frecuencia_max_ram
            );
        }
    }

    // ==========================================
    // ADUANA DE REFRIGERACIÓN
    // ==========================================
    if (categoriaVisible === 'cooling') {
        if (buildActual.cpu) {
            const { socket } = buildActual.cpu;
            // Usamos Optional Chaining (?.) por si la columna viene vacía
            productosFiltrados = productosFiltrados.filter(cooler => 
                cooler.sockets_compatible?.includes(socket)
            );
        }
    }

    // ==========================================
    // ADUANA DE GPU
    // ==========================================
    if (categoriaVisible === 'gpu') {
        if (buildActual.case) {
            const { espacio_maximo_gpu_mm } = buildActual.case;
            productosFiltrados = productosFiltrados.filter(gpu => 
                gpu.longitud <= (espacio_maximo_gpu_mm || 999)
            ); 
        }
    }

    // ==========================================
    // ADUANA DE PSU
    // ==========================================
    if (categoriaVisible === 'psu') {
        let piezasElegidas = Object.values(buildActual);
        let consumoTotal = piezasElegidas.reduce((total, pieza) => {
            return (total + (pieza?.consumo_watts || 0));
        }, 0);
        let consumoRecomendado = consumoTotal + (0.1 * consumoTotal);
        productosFiltrados = productosFiltrados.filter(psu => 
            psu.potencia_watts >= consumoRecomendado
        );
    }

    // ==========================================
    // ADUANA DE CASE
    // ==========================================
    if (categoriaVisible === 'case') {
        if (buildActual.motherboard) {
            const formatoPlaca = buildActual.motherboard.formato_fisico;
            const compatibilidadGabinete = {
                "Full-Tower": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], 
                "Mid-Tower": ["ATX", "Micro-ATX", "Mini-ITX"],          
                "Micro-ATX": ["Micro-ATX", "Mini-ITX"],                  
                "Mini-ITX": ["Mini-ITX"]
            };

            productosFiltrados = productosFiltrados.filter(gabinete => {
                const formatosQueSoportaEsteGabinete = compatibilidadGabinete[gabinete.formato] || [];
                return formatosQueSoportaEsteGabinete.includes(formatoPlaca);
            });
        }
    }

    return productosFiltrados;
}
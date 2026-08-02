import React, { useState } from "react";
import NavBar from "./components/NavBar.jsx";
import SideBar from "./components/SideBar.jsx";
import MainSection from "./components/MainSection.jsx";
import AssemblyTable from "./components/AssemblyTable.jsx";

export default function App() {
  // 1. EL CEREBRO: Declaramos la memoria de la aplicación
  const [categoriaActiva, setCategoriaActiva] = useState("chasis");

  const [buildActual, setBuildActual] = useState({})

  const [verMesa, setVerMesa] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      
      <div className="h-16 bg-black text-white">
        <NavBar />
      </div>

      <div className="flex-1 flex flex-row overflow-hidden">
        
        <div className="w-64 bg-gray-900 text-white">
          
          <SideBar categoriaActual={categoriaActiva} cambiarCategoria={setCategoriaActiva} buildActual={buildActual} setBuildActual={setBuildActual} verMesa={verMesa} setVerMesa={setVerMesa}/> 
        </div>

        <div className="flex-1 bg-black text-white overflow-auto p-8">
          {verMesa ? (
            <AssemblyTable buildActual={buildActual} />
          ) : (
            <MainSection categoriaVisible={categoriaActiva} buildActual={buildActual} setBuildActual={setBuildActual} />
          )}
        </div>
        
      </div>
      
    </div>
  )
}
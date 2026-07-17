import React, { useState } from "react";
import NavBar from "./components/NavBar.jsx";
import SideBar from "./components/SideBar.jsx";
import MainSection from "./components/MainSection.jsx"; 

export default function App() {
  // 1. EL CEREBRO: Declaramos la memoria de la aplicación
  const [categoriaActiva, setCategoriaActiva] = useState("chasis");

  const [buildActual, setBuildActual] = useState({})

  return (
    <div className="h-screen flex flex-col">
      
      <div className="h-16 bg-black text-white">
        <NavBar />
      </div>

      <div className="flex-1 flex flex-row overflow-hidden">
        
        <div className="w-64 bg-gray-900 text-white">
          
          <SideBar categoriaActual={categoriaActiva} cambiarCategoria={setCategoriaActiva} buildActual={buildActual} setBuildActual={setBuildActual}/> 
        </div>

        <div className="flex-1 bg-black text-white overflow-auto p-8">
          <MainSection categoriaVisible={categoriaActiva} buildActual={buildActual} setBuildActual={setBuildActual}/>
        </div>
        
      </div>
      
    </div>
  )
}
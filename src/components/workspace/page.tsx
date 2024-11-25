"use client";
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import Diagram from "@components/Diagrams";

// Carga dinámica de Diagram para desactivar SSR

const Workspace = () => {
  const [isAddWebchatOpen, setAddWebchatOpen] = useState(false);
  const [domain, setDomain] = useState("");

  const openAddWebchat = () => setAddWebchatOpen(true);
  const closeAddWebchat = () => setAddWebchatOpen(false);

  // Lógica inicial para guardar el dominio. Posteriormente, se integrará con Diagram.
  const handleSaveDomain = (newDomain: string) => {
    setDomain(newDomain);
    closeAddWebchat();
    // Aquí podrías agregar cualquier lógica de guardado o comunicación con Diagram en el futuro
    console.log("Dominio guardado:", newDomain);
  };

  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <Diagram />
      </ReactFlowProvider>
    </div>
  );
};

export default Workspace;

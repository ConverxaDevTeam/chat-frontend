"use client";
import { ReactFlowProvider } from "@xyflow/react";
import Diagram from "@components/Diagrams";

// Carga dinámica de Diagram para desactivar SSR

const Workspace = () => {

  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <Diagram />
      </ReactFlowProvider>
    </div>
  );
};

export default Workspace;

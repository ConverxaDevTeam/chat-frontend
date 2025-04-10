import React, { createContext, useState, useContext, ReactNode } from "react";
import { FunctionTemplate } from "@interfaces/template.interface";

interface GenerationState {
  template: FunctionTemplate | null;
  lastProcessedLine: number;
  createdIds: {
    applicationId?: string;
    categoryIds?: string[];
  };
}

interface TemplateAIContextType {
  generationState: GenerationState;
  setGenerationState: React.Dispatch<React.SetStateAction<GenerationState>>;
  resetGenerationState: () => void;
}

const initialState: GenerationState = {
  template: null,
  lastProcessedLine: 0,
  createdIds: {},
};

const TemplateAIContext = createContext<TemplateAIContextType | undefined>(
  undefined
);

export const TemplateAIProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [generationState, setGenerationState] =
    useState<GenerationState>(initialState);

  const resetGenerationState = () => {
    setGenerationState(initialState);
  };

  return (
    <TemplateAIContext.Provider
      value={{ generationState, setGenerationState, resetGenerationState }}
    >
      {children}
    </TemplateAIContext.Provider>
  );
};

export const useTemplateAI = (): TemplateAIContextType => {
  const context = useContext(TemplateAIContext);
  if (context === undefined) {
    throw new Error("useTemplateAI must be used within a TemplateAIProvider");
  }
  return context;
};

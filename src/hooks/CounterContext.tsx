import { createContext, useContext, useState, ReactNode } from "react";

type CounterContextType = {
  count: number;
  increment: () => void;
};

const CounterContext = createContext<CounterContextType | undefined>(undefined);

interface CounterProviderProps {
  children: ReactNode;
}

export const CounterProvider = ({ children }: CounterProviderProps) => {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount(prev => prev + 1);

  return (
    <CounterContext.Provider value={{ count, increment }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = (): CounterContextType => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};

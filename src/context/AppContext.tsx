import React, { createContext, useContext, useState } from "react";

type AppContextType = {
  hoveredDate: string | null;
  setHoveredDate: (date: string | null) => void;
  month: string;
  setMonth: (month: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const defaultMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(defaultMonth);

  return (
    <AppContext.Provider value={{ hoveredDate, setHoveredDate, month, setMonth }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

// Optionally, export dedicated hooks for each context part:
export const useFabHover = () => {
  const { hoveredDate, setHoveredDate } = useAppContext();
  return { hoveredDate, setHoveredDate };
};

export const useMonth = () => {
  const { month, setMonth } = useAppContext();
  return { month, setMonth };
};
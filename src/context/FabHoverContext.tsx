import React, { createContext, useContext, useState } from "react";

type FabHoverContextType = {
    hoveredDate: string | null;
    setHoveredDate: (date: string | null) => void;
};

const FabHoverContext = createContext<FabHoverContextType | undefined>(undefined);

export function FabHoverProvider({ children }: { children: React.ReactNode }) {
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);
    return (
        <FabHoverContext.Provider value={{ hoveredDate, setHoveredDate }}>
            {children}
        </FabHoverContext.Provider>
    );
}

export function useFabHover() {
    const ctx = useContext(FabHoverContext);
    if (!ctx) throw new Error("useFabHover must be used within FabHoverProvider");
    return ctx;
}
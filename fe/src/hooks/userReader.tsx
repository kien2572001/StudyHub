// hooks/useReader.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReaderContextType {
    // Các state và functions cần thiết có thể thêm ở đây
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: ReactNode }) {
    // Khởi tạo state và functions ở đây

    return (
        <ReaderContext.Provider value={{}}>
            {children}
        </ReaderContext.Provider>
    );
}

export function useReader() {
    const context = useContext(ReaderContext);
    if (context === undefined) {
        throw new Error('useReader must be used within a ReaderProvider');
    }
    return context;
}

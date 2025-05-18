import React, { createContext, useState, useContext, useEffect } from 'react';

interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
  setExpanded: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Получаем начальное состояние из localStorage или используем false
  const [expanded, setExpanded] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebar-expanded');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Сохраняем состояние в localStorage при его изменении
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', JSON.stringify(expanded));
  }, [expanded]);

  const toggleSidebar = () => {
    setExpanded(prev => !prev);
  };

  const value = {
    expanded,
    toggleSidebar,
    setExpanded
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// Хук для использования контекста
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
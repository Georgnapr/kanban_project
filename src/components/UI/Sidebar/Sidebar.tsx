// src/components/Sidebar/Sidebar.tsx
import React, { useState } from 'react';
import './Sidebar.css';

// Предполагаемые пути к иконкам в папке public
const icons = {
    home: '/public/Home.svg',
    favorites: '/public/Star.svg',
    calendar: '/public/Calendar.svg',
};

interface SidebarProps {
  onToggle: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    onToggle(newExpandedState);
  };

  // Массив с данными для элементов меню
  const menuItems = [
    { id: 'home', title: 'Домой', icon: icons.home },
    { id: 'favorites', title: 'Избранное', icon: icons.favorites },
    { id: 'calendar', title: 'Календарь', icon: icons.calendar },
  ];

  return (
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      {/* Кнопка переключения */}
      <button 
        className="toggle-button" 
        onClick={handleToggle}
        title={expanded ? "Свернуть" : "Развернуть"}
      >
        {expanded ? '◀' : '▶'}
      </button>

      <div className="sidebar-content">
        {/* Содержимое при развернутом состоянии */}
        {expanded && (
          <div className="full-menu">
            <div className="sidebar-header">
              <h3>Категории</h3>
            </div>
            <div className="sidebar-menu">
              {menuItems.map(item => (
                <div key={item.id} className="sidebar-item">
                  <div className="sidebar-icon">
                    <img src={item.icon} alt={item.title} className="svg-icon" />
                  </div>
                  <span className="sidebar-label">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Содержимое при свернутом состоянии */}
        {!expanded && (
          <div className="icons-menu">
            {menuItems.map(item => (
              <div key={item.id} className="sidebar-icon-item" title={item.title}>
                <img src={item.icon} alt={item.title} className="svg-icon-small" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
// src/components/UI/Sidebar/Sidebar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Sidebar.css';
import { useSidebar } from '../../../context/SidebarContext';

// Импортируем SVG иконки напрямую
// Обратите внимание, что мы используем относительные пути к иконкам в public
const icons = {
    home: "Home.svg",       // Без preffix /public
    favorites: "Star.svg",
    calendar: "Calendar.svg",
};

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path?: string;
}

const Sidebar: React.FC = () => {
  const { expanded, toggleSidebar } = useSidebar();
  const navigate = useNavigate(); // Хук для программной навигации

  // Массив с данными для элементов меню
  const menuItems: MenuItem[] = [
    { id: 'home', title: 'Домой', icon: icons.home, path: '/' },
    { id: 'favorites', title: 'Избранное', icon: icons.favorites },
    { id: 'calendar', title: 'Календарь', icon: icons.calendar },
  ];

  // Функция для навигации при клике
  const handleItemClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      {/* Кнопка переключения */}
      <button 
        className="toggle-button" 
        onClick={toggleSidebar}
        title={expanded ? "Свернуть" : "Развернуть"}
      >
        {expanded ? '◀' : '▶'}
      </button>

      <div className="sidebar-content">
        {expanded && (
          <div className="sidebar-header">
            <h3>Категории</h3>
          </div>
        )}
        
        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <div 
              key={item.id}
              className="sidebar-item" 
              title={!expanded ? item.title : undefined}
              onClick={() => handleItemClick(item.path)}
              style={{ cursor: item.path ? 'pointer' : 'default' }}
            >
              <div className="sidebar-icon-wrapper">
                <img
                  src={`/${item.icon}`} // Добавляем / впереди для доступа из корня
                  alt={item.title}
                  className="sidebar-icon-img"
                />
              </div>
              {expanded && <span className="sidebar-label">{item.title}</span>}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
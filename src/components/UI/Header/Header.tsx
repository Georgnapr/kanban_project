// src/components/UI/Header/Header.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logoSvg from "../../../../public/ZenTaskLogo.svg";

interface User {
  username: string;
  email: string;
  avatar?: string;
}

function Header() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Загружаем данные пользователя
    const userData = localStorage.getItem('kanban-user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]); // Перезагружаем при изменении маршрута

  const handleLogout = () => {
    // Удаляем данные пользователя и перенаправляем на страницу входа
    localStorage.removeItem('kanban-user');
    setUser(null);
    navigate('/login');
  };

  // Не показываем шапку на странице входа
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <div className='header'>
      <div className='burger'></div>
      <img src={logoSvg} alt="TaskZen Logo" className="logo" />
      <span className='project-title'>ZenTask</span>
      <span className='project-menu'>Избранное</span>
      <span className='project-menu'>Недавние</span>
      {user && (
        <div className="user-section">
          <span className="username">{user.username}</span>
          <button className="logout-button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
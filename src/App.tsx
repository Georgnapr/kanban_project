// src/App.tsx с обновленной маршрутизацией
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import DashBoard from './pages/dashBoard/DashBoard';
import ProjectPage from './pages/projectPage/ProjectPage';
import Login from './pages/auth/Login';
import './App.css';
import Header from './components/UI/Header/Header';

// Интерфейс пользователя
interface User {
  username: string;
  email: string;
  avatar?: string;
}

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем наличие пользователя в localStorage
    const userData = localStorage.getItem('kanban-user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Страница входа */}
        <Route path="/login" element={<Login />} />
        
        {/* Защищенные маршруты */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects/:projectId" 
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Перенаправление на страницу входа по умолчанию */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
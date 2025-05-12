// src/pages/auth/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Button from '../../components/UI/Button/Button';

// В будущем этот интерфейс можно заменить на настоящую аутентификацию
interface AuthUser {
  username: string;
  email: string;
  avatar?: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Простая валидация
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    // Имитация входа в систему (в реальном приложении здесь был бы API запрос)
    if (email === 'demo@example.com' && password === 'password') {
      // Сохраняем пользователя в localStorage
      const user: AuthUser = {
        username: 'Демо пользователь',
        email: email
      };
      
      localStorage.setItem('kanban-user', JSON.stringify(user));
      navigate('/'); // Перенаправляем на главную страницу
    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Добро пожаловать в ZenTask</h2>
        <p className="login-subtitle">Введите данные для входа в систему</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>
          
          <Button type="submit">Войти</Button>
        </form>
        
        <div className="demo-credentials">
          <p>Для демо-режима используйте:</p>
          <p><strong>Email:</strong> demo@example.com</p>
          <p><strong>Пароль:</strong> password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
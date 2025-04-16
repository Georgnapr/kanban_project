import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard/DashBoard';
import ProjectPage from './pages/ProjectPage';
import './App.css';
import { useState } from 'react';
import { Project } from './types/entities';


function App() {
  
  const [projects] = useState<Project[]>([ // Явная типизация
    {
      id: '1',
      title: 'Разработка сайта',
      columns: [
        { id: '1', title: 'Дизайн главной'},
        { id: '2', title: 'Верстка'}
      ]
    },
    {
      id: '2',
      title: 'Мобильное приложение',
      columns: [
        { id: '1', title: 'Прототип'}
      ]
    }
  ]);

  return (
    <Router>
      <header className='header'>
        <h1>Проект kanban-доски</h1>
      </header>
      
      <Routes>
        <Route 
          path="/" 
          element={<DashBoard projects={projects} />} 
        />
        <Route 
          path="/projects/:projectId" 
          element={<ProjectPage projects={projects}/>} 
        />
      </Routes>
    </Router>
  );
}

export default App;

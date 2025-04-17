import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard/DashBoard';
import ProjectPage from './pages/ProjectPage';
import './App.css';
import { useState } from 'react';
import { IProject } from './types/entities';


function App() {
  
  const [projects] = useState<IProject[]>([ // Явная типизация
    {
      id: '1',
      title: 'Разработка сайта',
      columns: [
        { id: '1', 
          title: 'Дизайн главной', 
          tasks: [
          ]},
        { id: '2', 
          title: 'Верстка', 
          tasks: [
            {
              id: '1',
              title: 'Верстка лендинга'
            },
            {
              id: '2',
              title: 'Верстка dashboard'
            },
            {
              id: '3',
              title: 'Верстка стр. регистрации'
            },
          ]}
      ]
    },
    {
      id: '2',
      title: 'Мобильное приложение',
      columns: [
        { id: '1', 
          title: 'Прототип', 
          tasks: [
            {
              id: '1',
              title: 'Верстка лендинга моб.'
            },
            {
              id: '2',
              title: 'Верстка dashboard моб.'
            },
          ]}
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

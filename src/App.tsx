import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import ProjectPage from './pages/ProjectPage';
import './App.css';

function App() {
  return (
    <Router>
      <header className='header'>
        <h1>Проект kanban-доски</h1>
      </header>
      
      <Routes>
        {/* Главная страница */}
        <Route path="/dashboard" element={<DashBoard />} />
        
        {/* Страница проекта */}
        <Route path="/projectpage" element={<ProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;

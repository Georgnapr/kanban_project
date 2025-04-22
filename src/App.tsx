import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashBoard from './pages/dashBoard/DashBoard';
import ProjectPage from './pages/projectPage/ProjectPage';
import './App.css';
import Header from './components/UI/Header/Header';


function App() {

  return (
    <Router>
      <Header></Header>
      <Routes>
          <Route 
            path="/" 
            element={<DashBoard />} 
          />
          <Route 
            path="/projects/:projectId" 
            element={<ProjectPage />} 
          />
      </Routes>
    </Router>
  );
}

export default App;

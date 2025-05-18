// src/pages/dashBoard/DashBoard.tsx
import ProjectCard from '../../components/UI/ProjectCard';
import Button from '../../components/UI/Button/Button';
import "./DashBoard.css"
import { useAppSelector } from '../../app/hooks';
import { selectAllProjects } from '../../app/features/board/boardSelectors';
import { useAppDispatch } from '../../app/hooks';
import { useState } from 'react';
import { createProject } from '../../app/features/board/boardSlice';
import InputModal from '../../components/UI/InputModal';
import Sidebar from '../../components/UI/Sidebar/Sidebar';
import { useSidebar } from '../../context/SidebarContext';  // Импортируем хук

const DashboardPage = () => {
  const projects = useAppSelector(selectAllProjects);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Получаем состояние сайдбара из контекста
  const { expanded } = useSidebar();

  const handleCreateProject = (title: string) => {
    dispatch(createProject({ title }));
  };

  return (
    <div className="dashboard">
      <div className='action-bar'>
        <h2 className='action-bar-title'>Мои доски</h2>
      </div>
      {isModalOpen && (
        <InputModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateProject}
          placeholder='Название доски'
          title='Создать новую доску'
        />
      )}
      <div className={`dashboard-content ${expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Sidebar />
        <div className="projects-container">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
            />
          ))}
          <div>
            <Button onClick={() => setIsModalOpen(true)}>Создать доску</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
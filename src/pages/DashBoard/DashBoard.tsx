import ProjectCard from '../../components/UI/ProjectCard';
import Button from '../../components/UI/Button';
import "./DashBoard.css"
import { useAppSelector } from '../../app/hooks';
import { selectAllProjects } from '../../app/features/board/boardSelectors';
import { useAppDispatch } from '../../app/hooks';
import { useState } from 'react';
import { createProject } from '../../app/features/board/boardSlice';
import InputModal from '../../components/UI/InputModal';


const DashboardPage = () => {

  const projects = useAppSelector(selectAllProjects);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (title: string) => {
    dispatch(createProject({ title })); // Используем action creator
  };

  return (
    <div className="dashboard">
      
      <div className='action-bar'>
        <h2>Мои доски</h2>
      </div>
      {isModalOpen && (
        <InputModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateProject}
          placeholder='Название доски'
          title='Создать новую доску'
        />
      )}
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
        {/*TODO: логика создания нового проекта. По умолчанию планируется 2 колонки: Сделано и Сделать*/}
      </div>
    </div>
  );
};

export default DashboardPage;
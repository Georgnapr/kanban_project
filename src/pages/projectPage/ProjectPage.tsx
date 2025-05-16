// src/pages/projectPage/ProjectPage.tsx
import './ProjectPage.css';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import Board from '../../components/Board/Board';
import Button from '../../components/UI/Button/Button';
import { useAppSelector } from '../../app/hooks';
import { selectProjectById, selectIsFiltersActive } from '../../app/features/board/boardSelectors';
import FilterDropdown from '../../components/UI/Filters/FilterDropdown';

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Получаем проект из Redux хранилища
  const project = useAppSelector((state) => selectProjectById(state, projectId!));
  const isFiltersActive = useAppSelector(selectIsFiltersActive);

  if (!project) {
    return (
      <>
        <div>Проект не найден</div>
        <Link to="/">
          <Button>Назад к списку проектов</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="action-bar">
        <h2 className='action-bar-title'>{project.title}</h2>
        <div className='action-bar-controls'>
          <button 
            className={`filter-button ${isFiltersActive ? 'filter-active' : ''}`}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            Фильтры {isFiltersActive && <span className="filter-badge"></span>}
          </button>
          <FilterDropdown 
            projectId={project.id} 
            isOpen={isFiltersOpen} 
            onClose={() => setIsFiltersOpen(false)}
          />
        </div>
      </div>
      
      <div className="project-page">
        <Board project={project} />
        <div className='back-button'>
          <Link to="/">
            <Button>Назад к доскам</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
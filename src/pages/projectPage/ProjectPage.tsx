import './ProjectPage.css';
import { Link, useParams } from 'react-router-dom';
import Board from '../../components/Board/Board';
import Button from '../../components/UI/Button';
import { useAppSelector } from '../../app/hooks';
import { selectProjectById } from '../../app/features/board/boardSelectors';

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Получаем проект из Redux хранилища
  const project = useAppSelector((state) => selectProjectById(state, projectId!));

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
      </div>
      <div className="project-page">
        <Board project={project} />
        <Link to="/">
          <Button>Назад к доскам</Button>
        </Link>
      </div>
    </>
  );
};

export default ProjectPage;
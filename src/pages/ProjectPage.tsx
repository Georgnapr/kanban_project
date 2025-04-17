import './ProjectPage.css'
import { Link, useParams } from 'react-router-dom';
import { IProject } from '../types/entities';
import Board from '../components/Board/Board';
import Button from '../components/UI/Button';

interface Props {
  projects: IProject[];
}
const ProjectPage = ({projects} : Props) => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Находим проект по ID
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <>
        <div>Проект не найден</div>;
        <Link to="/">
          <Button>Назад к списку проектов</Button>
        </Link>
      </>);
  }

  return (
    <>
      <div className="project-title-container">
        <h2>{project.title}</h2>
      </div>
      <div className="project-page">
        <Board project={project}></Board>
        <Link to="/">
          <Button>Назад к доскам</Button>
        </Link>
      </div>
    </>
  );
};

export default ProjectPage;
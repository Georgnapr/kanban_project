import { Link, useParams } from 'react-router-dom';
import { IProject } from '../types/entities';
import Board from '../components/Board/Board';

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
          <button type="button">Назад к списку проектов</button>
        </Link>
      </>);
  }

  return (
    <div className="project-page">
      <h2>{project.title}</h2>
      <Board project={project}></Board>
      <Link to="/">
        <button type="button">Назад к списку проектов</button>
      </Link>
    </div>
  );
};

export default ProjectPage;
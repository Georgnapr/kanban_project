import './ProjectCard.css'
import { Link } from "react-router-dom";
import { IProject } from '../../types/entities';
import Button from './Button';
import { useAppDispatch } from '../../app/hooks';
import { deleteProject } from '../../app/features/board/boardSlice';

type Props = {
    project: IProject
}

const ProjectCard = ({ project }: Props) => {

  const dispatch = useAppDispatch();

  const handleDeleteProject = () => {
    if (window.confirm('Вы уверены, что хотите удалить проект?')) {
      dispatch(deleteProject({ projectId: project.id  }));
    }
  };

    return (
      <div className="project-card">
        <div className='title-container'>
          <span>{project.title}</span>
          <button onClick={handleDeleteProject}>×</button>
        </div>
        <Link to={`/projects/${project.id}`}>
          <Button>
            Открыть проект
          </Button>
        </Link>
      </div>
    );
  };

  export default ProjectCard;
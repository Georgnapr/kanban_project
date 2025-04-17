import './ProjectCard.css'
import { Link } from "react-router-dom";
import { IProject } from '../../types/entities';
import Button from './Button';

type Props = {
    project: IProject
}

const ProjectCard = ({ project }: Props) => {
    return (
      <div className="project-card">
        <h3>{project.title}</h3>

        <Link to={`/projects/${project.id}`}>
          <Button>
            Открыть проект
          </Button>
        </Link>
      </div>
    );
  };

  export default ProjectCard;
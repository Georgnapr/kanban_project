import { Link } from "react-router-dom";
import { Project } from "../types/entities";
import './ProjectCard.css'

type Props = {
    project: Project
}

const ProjectCard = ({ project }: Props) => {
    return (
      <div className="project-card">
        <h3>{project.title}</h3>
        
        <Link 
          to={`/projects/${project.id}`} 
          className="project-button"
        >
          Открыть проект
        </Link>
      </div>
    );
  };

  export default ProjectCard;
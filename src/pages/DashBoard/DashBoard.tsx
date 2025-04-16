import ProjectCard from '../../components/ProjectCard';
import { IProject } from '../../types/entities';
import "./DashBoard.css"
interface Props {
  projects: IProject[];
}

const DashboardPage = ({ projects }: Props) => {
  return (
    <div className="dashboard">
      <h2>Мои проекты</h2>
      <div className="projects-container">
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
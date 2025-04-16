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
        <button>+</button>
        {/*TODO: логика создания нового проекта. По умолчанию планируется 2 колонки: Сделано и Сделать*/}
      </div>
    </div>
  );
};

export default DashboardPage;
import ProjectCard from '../../components/UI/ProjectCard';
import Button from '../../components/UI/Button';
import { IProject } from '../../types/entities';
import "./DashBoard.css"
interface Props {
  projects: IProject[];
}

const DashboardPage = ({ projects }: Props) => {
  return (
    <div className="dashboard">
      <h2>Мои доски</h2>
      <div className="projects-container">
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
          />
        ))}
        <div>
          <Button> + Создать доску </Button>
        </div>
        {/*TODO: логика создания нового проекта. По умолчанию планируется 2 колонки: Сделано и Сделать*/}
      </div>
    </div>
  );
};

export default DashboardPage;
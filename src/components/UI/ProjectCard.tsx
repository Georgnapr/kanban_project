import './ProjectCard.css'
import { Link } from "react-router-dom";
import { IProject } from '../../types/entities';
import Button from './Button/Button';
import { useAppDispatch } from '../../app/hooks';
import { deleteProject, updateProjectTitle } from '../../app/features/board/boardSlice';
import DropdownMenu from './DropDownMenu/DropDownMenu';

type Props = {
    project: IProject
}

const ProjectCard = ({ project }: Props) => {

  const dispatch = useAppDispatch();

    return (
      <div className="project-card">
        <div className='title-container'>
          <span>{project.title}</span>
          <DropdownMenu
            entityType="project"
              onRename={(newTitle) => dispatch(updateProjectTitle({
              projectId: project.id,
              newTitle
            }))}
              onDelete={() => dispatch(deleteProject({
              projectId: project.id
            }))}
          />
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
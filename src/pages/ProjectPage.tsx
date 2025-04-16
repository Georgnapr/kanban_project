import { Link } from 'react-router-dom';

const ProjectPage = () => {
  return (
    <div className="project-page">
      <h2>Проект 1</h2>
      <p>Здесь будет доска задач проекта...</p>
      <Link to="/dashboard">
        <button type="button">Назад к списку проектов</button>
      </Link>
    </div>
  );
};

export default ProjectPage;
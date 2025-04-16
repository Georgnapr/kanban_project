import { Link } from 'react-router-dom';

const DashBoard = () => {
  return (
    <div className="dashboard">
      <h2>Мои проекты</h2>
      <Link to="/projectpage">
        <button type="button">Проект 1</button>
      </Link>
    </div>
  );
};

export default DashBoard;

import './TaskCard.css'
import { ITask } from "../../types/entities"
import { useAppDispatch } from '../../app/hooks';
import { deleteTask } from '../../app/features/board/boardSlice';

type Props = {
    taskcard: ITask;
    projectId: string;
    columnId: string;
}

const TaskCard = ({taskcard, projectId, columnId }: Props) => {
  const dispatch = useAppDispatch();
  
  const handleDeleteTask = () => {
    dispatch(deleteTask({ 
      projectId, 
      columnId, 
      taskId: taskcard.id 
    }));
  };

  return (
    <div className="task-card">
        <label className="round-checkbox">
          <input type='checkbox'></input>
          <span className="checkmark"></span>
        </label>
        <div className='taskcard-title'>{taskcard.title}</div>
        <button onClick={handleDeleteTask}>×</button>
    </div>
  )
}

export default TaskCard

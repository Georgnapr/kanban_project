// Обновленный TaskCard.tsx с использованием RoundCheckbox
import './TaskCard.css'
import { ITask } from "../../types/entities"
import { useAppDispatch } from '../../app/hooks';
import { deleteTask, updateTaskTitle, updateTaskStatus } from '../../app/features/board/boardSlice';
import DropdownMenu from '../UI/DropDownMenu/DropDownMenu';
import { useDrag } from 'react-dnd';
import { useState } from 'react';
import TaskDetails from './TaskDetails';
import RoundCheckbox from '../UI/RoundCheckbox/RoundCheckbox';

type Props = {
    taskcard: ITask;
    projectId: string;
    columnId: string;
}

const TaskCard = ({taskcard, projectId, columnId }: Props) => {
  const dispatch = useAppDispatch();
  const [showDetails, setShowDetails] = useState(false);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { taskcard, projectId, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked;
    
    dispatch(updateTaskStatus({
      projectId,
      columnId,
      taskId: taskcard.id,
      completed: newStatus
    }));
  };

  const handleTaskCardClick = () => {
    setShowDetails(true);
  };

  return (
    <>
      <div 
        ref={drag} 
        className={`task-card ${taskcard.completed ? 'task-completed' : ''}`}
        onClick={handleTaskCardClick}
      >
        <RoundCheckbox 
          checked={taskcard.completed || false}
          onChange={handleCheckboxChange}
        />
        <div className='taskcard-title'>{taskcard.title}</div>
        <DropdownMenu
          entityType="task"
          onRename={(newTitle) => dispatch(updateTaskTitle({
            projectId,
            columnId,
            taskId: taskcard.id,
            newTitle
          }))}
          onDelete={() => dispatch(deleteTask({
            projectId,
            columnId,
            taskId: taskcard.id
          }))}
        />
      </div>
      
      {showDetails && (
        <TaskDetails
          task={taskcard}
          projectId={projectId}
          columnId={columnId}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  )
}

export default TaskCard
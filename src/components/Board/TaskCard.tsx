// src/components/Board/TaskCard.tsx
import './TaskCard.css'
import { ITask } from "../../types/entities"
import { useAppDispatch } from '../../app/hooks';
import { deleteTask, updateTaskTitle, updateTaskStatus } from '../../app/features/board/boardSlice';
import { getPriorityColor, getPriorityLabel } from '../../utils/priorityCalculator';
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

  // Получаем цвет и метку приоритета
  const priorityColor = getPriorityColor(taskcard.priorityLevel || 0);
  const priorityLabel = getPriorityLabel(taskcard.priorityLevel || 0);
  const priorityTooltip = `Приоритет: ${priorityLabel} (${taskcard.priorityLevel || 0})`;

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

  // Форматирование даты для отображения
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit'
    });
  };

  // Проверка просрочен ли дедлайн
  const isDueDatePassed = (): boolean => {
    if (!taskcard.dueDate || taskcard.completed) return false;
    return new Date(taskcard.dueDate) < new Date();
  };

  // Определение класса для отображения срока
  const getDueDateClass = (): string => {
    if (taskcard.completed) return 'due-date-completed';
    if (isDueDatePassed()) return 'due-date-overdue';
    return '';
  };

  return (
    <>
      <div 
        ref={drag} 
        className={`task-card ${taskcard.completed ? 'task-completed' : ''}`}
        onClick={handleTaskCardClick}
      >
        
        <div className="task-card-content">
          <div className="task-card-header">
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
          
          {/* Индикаторы только при наличии описания или срока */}
          {(taskcard.description || taskcard.dueDate || taskcard.priorityLevel) && (
            <div className="task-card-indicators">
              {taskcard.description && (
                <div className="task-indicator description-indicator" title="Есть описание">
                  <i className="task-icon description-icon"></i>
                </div>
              )}
              
              {taskcard.dueDate && (
                <div className={`task-indicator due-date-indicator ${getDueDateClass()}`} title="Срок выполнения">
                  <i className="task-icon due-date-icon"></i>
                  <span className="due-date-text">{formatDueDate(taskcard.dueDate)}</span>
                </div>
              )}
              
              {/* Индикатор приоритета - альтернативный вариант */}
              {(
              <div className="task-indicator priority-indicator" title={priorityTooltip}>
                <i className="task-icon priority-icon" style={{ backgroundColor: priorityColor }}></i>
                <span className="priority-text"style={{ color: priorityColor }}>{priorityLabel}</span>
              </div>
              )}
            </div>
          )}
        </div>
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
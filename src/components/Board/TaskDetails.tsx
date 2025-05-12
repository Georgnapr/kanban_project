// Обновленный TaskDetails.tsx с использованием RoundCheckbox
import { useState, useEffect } from 'react';
import { ITask } from "../../types/entities";
import { useAppDispatch } from '../../app/hooks';
import { updateTaskTitle, updateTaskDescription, updateTaskStatus } from '../../app/features/board/boardSlice';
import './TaskDetails.css';
import RoundCheckbox from '../UI/RoundCheckbox/RoundCheckbox';

interface TaskDetailsProps {
  task: ITask;
  projectId: string;
  columnId: string;
  onClose: () => void;
}

const TaskDetails = ({ task, projectId, columnId, onClose }: TaskDetailsProps) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isEditing, setIsEditing] = useState(false);

  // Обновляем локальное состояние, если значения в Redux изменились
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
  }, [task.title, task.description]);

  const handleSave = () => {
    if (title !== task.title) {
      dispatch(updateTaskTitle({
        projectId,
        columnId,
        taskId: task.id,
        newTitle: title
      }));
    }
    
    if (description !== (task.description || '')) {
      dispatch(updateTaskDescription({
        projectId,
        columnId,
        taskId: task.id,
        description
      }));
    }
    
    setIsEditing(false);
  };

  const handleTaskStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const completed = e.target.checked;
    dispatch(updateTaskStatus({
      projectId,
      columnId,
      taskId: task.id,
      completed
    }));
  };

  // Предотвращаем всплытие события
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="task-details-overlay" onClick={onClose}>
      <div className="task-details-modal" onClick={handleModalClick}>
        <div className="task-details-header">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="task-details-title-input"
            />
          ) : (
            <h2 className="task-details-title">{title}</h2>
          )}
          <div className="task-details-controls">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary">Сохранить</button>
                <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Отмена</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-edit">Редактировать</button>
            )}
            <button onClick={onClose} className="btn btn-close">×</button>
          </div>
        </div>
        
        <h3>Статус выполнения:</h3>
        <div className="task-details-status">
            <RoundCheckbox
                checked={task.completed || false}
                onChange={handleTaskStatusChange}
                stopPropagation={false} // В модалке нам не нужно останавливать всплытие
            />
            <span>{task.completed ? "Завершено" : "В процессе"}</span>
        </div>
        
        <div className="task-details-description">
          <h3>Описание:</h3>
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="task-details-description-textarea"
              placeholder="Добавьте описание..."
            />
          ) : (
            <p>{description || "Нет описания"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
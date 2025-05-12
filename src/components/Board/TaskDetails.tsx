// Обновленный TaskDetails.tsx с компонентом Button
import { useState, useEffect } from 'react';
import { ITask } from "../../types/entities";
import { useAppDispatch } from '../../app/hooks';
import { updateTaskTitle, updateTaskDescription, updateTaskStatus } from '../../app/features/board/boardSlice';
import './TaskDetails.css';
import RoundCheckbox from '../UI/RoundCheckbox/RoundCheckbox';
import Button from '../UI/Button/Button'; // Импортируем компонент Button

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
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  // Обновляем локальное состояние, если значения в Redux изменились
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
  }, [task.title, task.description]);

  const handleSaveTitle = () => {
    if (title !== task.title) {
      dispatch(updateTaskTitle({
        projectId,
        columnId,
        taskId: task.id,
        newTitle: title
      }));
    }
    setIsTitleEditing(false);
  };

  const handleSaveDescription = () => {
    if (description !== (task.description || '')) {
      dispatch(updateTaskDescription({
        projectId,
        columnId,
        taskId: task.id,
        description
      }));
    }
    setIsDescriptionEditing(false);
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
          <div className="task-details-title-section">
            {isTitleEditing ? (
              <div className="edit-section">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="task-details-title-input"
                  autoFocus
                />
                <div className="edit-actions">
                  <Button type="button" onClick={handleSaveTitle}>
                    Сохранить
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => {
                      setTitle(task.title);
                      setIsTitleEditing(false);
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <h2 
                className="task-details-title" 
                onClick={() => setIsTitleEditing(true)}
              >
                {title}
              </h2>
            )}
          </div>
          <div className="task-details-close">
            <button onClick={onClose} className="btn-close">×</button>
          </div>
        </div>
        
        <div className="task-details-content">
          <h3>Статус выполнения:</h3>
          <div className="task-details-status">
            <RoundCheckbox
              checked={task.completed || false}
              onChange={handleTaskStatusChange}
              stopPropagation={false}
            />
            <span>{task.completed ? "Завершено" : "В процессе"}</span>
          </div>
          
          <div className="task-details-description">
            <h3>Описание:</h3>
            {isDescriptionEditing ? (
              <div className="edit-section">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="task-details-description-textarea"
                  placeholder="Добавьте описание..."
                  autoFocus
                />
                <div className="edit-actions">
                  <Button type="button" onClick={handleSaveDescription}>
                    Сохранить
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      setDescription(task.description || '');
                      setIsDescriptionEditing(false);
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <p 
                className="task-description-text" 
                onClick={() => setIsDescriptionEditing(true)}
              >
                {description || "Нет описания. Нажмите, чтобы добавить."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
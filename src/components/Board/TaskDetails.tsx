// Обновленный TaskDetails.tsx с поддержкой дат
import { useState, useEffect } from 'react';
import { ITask } from "../../types/entities";
import { useAppDispatch } from '../../app/hooks';
import { 
  updateTaskTitle, 
  updateTaskDescription, 
  updateTaskStatus,
  updateTaskDueDate 
} from '../../app/features/board/boardSlice';
import './TaskDetails.css';
import RoundCheckbox from '../UI/RoundCheckbox/RoundCheckbox';
import Button from '../UI/Button/Button';

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
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isDueDateEditing, setIsDueDateEditing] = useState(false);
  const [hasDueDate, setHasDueDate] = useState(Boolean(task.dueDate));

  // Обновляем локальное состояние, если значения в Redux изменились
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate || '');
    setHasDueDate(Boolean(task.dueDate));
  }, [task.title, task.description, task.dueDate]);

  // Форматирование даты для отображения
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Форматирование даты для input type="datetime-local"
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Формат YYYY-MM-DDThh:mm
  };

  // Получение текущей даты и времени для инпута
  const getCurrentDateTime = (): string => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Формат YYYY-MM-DDThh:mm
  };

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

  const handleSaveDueDate = () => {
    dispatch(updateTaskDueDate({
      projectId,
      columnId,
      taskId: task.id,
      dueDate: hasDueDate ? dueDate : undefined
    }));
    setIsDueDateEditing(false);
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

  // Проверка просрочен ли дедлайн
  const isDueDatePassed = (): boolean => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  // Классы для отображения статуса срока
  const dueDateStatusClass = (): string => {
    if (task.completed) return 'completed';
    if (isDueDatePassed()) return 'overdue';
    return '';
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
          {/* Информация о создании */}
          <div className="task-details-dates-info">
            <h3>Дата создания:</h3> <p>{formatDate(task.createdAt)}</p>
            {task.completed && task.completedAt && (
                <>
                <h3>Дата выполнения:</h3> <p>{formatDate(task.completedAt)}</p>
                </>  
            )}
          </div>

          {/* Срок выполнения */}
          <div className="task-details-due-date">
            <h3>Срок выполнения:</h3>
            {isDueDateEditing ? (
              <div className="edit-section">
                <div className="due-date-checkbox">
                  <RoundCheckbox
                    checked={hasDueDate}
                    onChange={(e) => setHasDueDate(e.target.checked)}
                    stopPropagation={false}
                  />
                  <label htmlFor="has-due-date">Установить срок выполнения</label>
                </div>
                
                {hasDueDate && (
                  <input
                    type="datetime-local"
                    value={dueDate ? formatDateForInput(dueDate) : getCurrentDateTime()}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="task-details-due-date-input"
                  />
                )}
                
                <div className="edit-actions">
                  <Button type="button" onClick={handleSaveDueDate}>
                    Сохранить
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => {
                      setDueDate(task.dueDate || '');
                      setHasDueDate(Boolean(task.dueDate));
                      setIsDueDateEditing(false);
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <p 
                className={`task-due-date-text ${task.dueDate ? dueDateStatusClass() : 'no-date'}`} 
                onClick={() => setIsDueDateEditing(true)}
              >
                {task.dueDate ? formatDate(task.dueDate) : "Не установлен (нажмите, чтобы добавить)"}
              </p>
            )}
          </div>

          {/* Статус выполнения */}
          <h3>Статус выполнения:</h3>
          <div className="task-details-status">
            <RoundCheckbox
              checked={task.completed || false}
              onChange={handleTaskStatusChange}
              stopPropagation={false}
            />
            <span>{task.completed ? "Завершено" : "В процессе"}</span>
          </div>
          
          {/* Описание */}
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
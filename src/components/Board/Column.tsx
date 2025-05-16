// Улучшенная версия Column.tsx с визуальным отображением при перетаскивании
import { useState } from 'react';
import { IColumn, ITask } from '../../types/entities';
import TaskCard from './TaskCard';
import Button from '../UI/Button/Button';
import InputModal from '../UI/InputModal';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addTask, deleteColumn, moveTask, updateColumnTitle } from '../../app/features/board/boardSlice';
import './Column.css';
import DropdownMenu from '../UI/DropDownMenu/DropDownMenu';
import { useDrop } from 'react-dnd';
import { selectFilteredTasks } from '../../app/features/board/boardSelectors';

type Props = {
  column: IColumn;
  projectId: string;
}

const Column = ({ column, projectId }: Props) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = (title: string) => {
    dispatch(addTask({
      projectId,
      columnId: column.id,
      taskTitle: title
    }));
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { taskcard: ITask; projectId: string; columnId: string }) => {
      if (item.columnId !== column.id || item.projectId !== projectId) {
        dispatch(moveTask({
          sourceProjectId: item.projectId,
          sourceColumnId: item.columnId,
          sourceTaskId: item.taskcard.id,
          targetProjectId: projectId,
          targetColumnId: column.id
        }));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

    // Используем селектор для отфильтрованных задач вместо прямого доступа к задачам
  const filteredTasks = useAppSelector(state => 
    selectFilteredTasks(state, projectId, column.id)
  );

  // Определяем класс для колонки в зависимости от состояния перетаскивания
  const columnClass = `column ${isOver ? 'column-drop-active' : ''} ${canDrop ? 'column-drop-possible' : ''}`;

  return (
    <div ref={drop} className={columnClass}>
      <div className='column-title-container'>
        <span className='column-title'>{column.title}</span>
        <DropdownMenu
          entityType="column"
          onRename={(newTitle) => dispatch(updateColumnTitle({
            projectId,
            columnId: column.id,
            newTitle
          }))}
          onDelete={() => dispatch(deleteColumn({
            projectId,
            columnId: column.id
          }))}
        />
      </div>

      <div className="column-tasks-container">
        {/* Используем filteredTasks вместо column.tasks */}
        {filteredTasks.map((task) => (
          <TaskCard taskcard={task} key={task.id} columnId={column.id} projectId={projectId}/>
        ))}
      </div>
      
      <Button onClick={() => setIsModalOpen(true)}>
        Добавить задачу
      </Button>
      
      {isModalOpen && (
        <InputModal
          title="Добавить задачу"
          placeholder="Название задачи"
          submitText="Добавить"
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTask}
        />
      )}
    </div>
  );
};

export default Column;
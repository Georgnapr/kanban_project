import { useState } from 'react';
import { IColumn, ITask } from '../../types/entities';
import TaskCard from './TaskCard';
import Button from '../UI/Button';
import InputModal from '../UI/InputModal';
import { useAppDispatch } from '../../app/hooks';
import { addTask, deleteColumn, moveTask, updateColumnTitle } from '../../app/features/board/boardSlice';
import './Column.css';
import DropdownMenu from '../UI/DropDownMenu/DropDownMenu';
import { useDrop } from 'react-dnd';

type Props = {
  column: IColumn;
  projectId: string; // Добавим projectId для связи с редюсером
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

  const [{ isOver }, drop] = useDrop(() => ({
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
    }),
  }));

  return (
    <div ref={drop} className='column'>
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

      {column.tasks.map((task) => (
        <TaskCard taskcard={task} key={task.id} columnId={column.id} projectId={projectId}/>
      ))}
      
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
import { useState } from 'react';
import { IColumn } from '../../types/entities';
import TaskCard from './TaskCard';
import Button from '../UI/Button';
import InputModal from '../UI/InputModal';
import { useAppDispatch } from '../../app/hooks';
import { addTask, deleteColumn } from '../../app/features/board/boardSlice';
import './Column.css';

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

  const handleDeleteColumn = () => {
    if (window.confirm('Удалить эту колонку?')) {
      dispatch(deleteColumn({ 
        projectId, 
        columnId: column.id 
      }));
    }
  };

  return (
    <div className='column'>
      <div className='column-title-container'>
        <span className='column-title'>{column.title}</span>
        <button onClick={handleDeleteColumn}>×</button>
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
import './TaskCard.css'
import { ITask } from "../../types/entities"
import { useAppDispatch } from '../../app/hooks';
import { deleteTask, updateTaskTitle } from '../../app/features/board/boardSlice';
import DropdownMenu from '../UI/DropDownMenu/DropDownMenu';
import { useDrag } from 'react-dnd';

type Props = {
    taskcard: ITask;
    projectId: string;
    columnId: string;
}

const TaskCard = ({taskcard, projectId, columnId }: Props) => {
  const dispatch = useAppDispatch();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { taskcard, projectId, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="task-card">
        <label className="round-checkbox">
          <input type='checkbox'></input>
          <span className="checkmark"></span>
        </label>
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
  )
}

export default TaskCard

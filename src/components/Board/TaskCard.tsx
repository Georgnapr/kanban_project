import './TaskCard.css'
import { ITask } from "../../types/entities"

type Props = {
    taskcard: ITask;
}

const TaskCard = ({taskcard}: Props) => {
  return (
    <div className="task-card">
        <label className="round-checkbox">
          <input type='checkbox'></input>
          <span className="checkmark"></span>
        </label>
        <div className='taskcard-title'>{taskcard.title}</div>
    </div>
  )
}

export default TaskCard

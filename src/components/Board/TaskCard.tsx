import './TaskCard.css'
import { ITask } from "../../types/entities"

type Props = {
    taskcard: ITask;
}

const TaskCard = ({taskcard}: Props) => {
  return (
    <div className="task-card">
        <span>{taskcard.title}</span>
    </div>
  )
}

export default TaskCard

import './TaskCard.css'
import { ITask } from "../../types/entities"

type Props = {
    taskcard: ITask;
}

function TaskCard({taskcard}: Props) {
  return (
    <div className="task-card">
        <h4>{taskcard.title}</h4>
    </div>
  )
}

export default TaskCard

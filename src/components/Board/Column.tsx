import './Column.css'
import { IColumn } from '../../types/entities'
import TaskCard from './TaskCard'

type Props = {
    column: IColumn
}

function Column({column}: Props) {
  return (
    <div className='column'>
      <h3>{column.title}</h3>
      {column.tasks.map((task) => (
        <TaskCard taskcard={task}></TaskCard>
      ))}
      
    </div>
  )
}

export default Column

import './Column.css'
import { IColumn } from '../../types/entities'
import TaskCard from './TaskCard'
import Button from '../UI/Button'

type Props = {
    column: IColumn
}

const Column = ({column}: Props) => {
  return (
    <div className='column'>
      <div className='column-title-container'>
        <span className='column-title'>{column.title}</span>
      </div>

      {column.tasks.map((task, index) => (
        <TaskCard taskcard={task} key={index}></TaskCard>
      ))}
      <Button>Добавить задачу</Button>
      {/*TODO: логика создания новой задачи*/}
      {/*TODO: drag-n-drop для задач (между колонками, внутри колонки)*/}
    </div>
  )
}

export default Column

import './Board.css'
import Column from './Column'
import { IProject } from "../../types/entities";
import Button from '../UI/Button';

type Props = {
    project: IProject
}

const Board = ({project}: Props) => {
  return (
    <>
        <div className='columns-container'>
            {project.columns.map((column) =>(
                <Column column={column}></Column>
            ))}
            <div>
                <Button> + Добавить колонку </Button>
            </div>
            {/*TODO: логика создания новой колонки*/}
            {/*TODO: drag-n-drop для перемещения колонок*/}
        </div>
        <p></p>
    </>
    
  )
}

export default Board

import './Board.css'
import Column from './Column'
import { IProject } from "../../types/entities";

type Props = {
    project: IProject
}

function Board({project}: Props) {
  return (
    <>
        <div className='columns-container'>
            {project.columns.map((column) =>(
                <Column column={column}></Column>
            ))}
            <button>+</button>
        </div>
        <p></p>
    </>
    
  )
}

export default Board

import './Board.css'
import Column from './Column'
import { IProject } from "../../types/entities";
import Button from '../UI/Button';
import { useAppDispatch } from '../../app/hooks';
import { useState } from 'react';
import { addColumn } from '../../app/features/board/boardSlice';
import InputModal from '../UI/InputModal';

type Props = {
    project: IProject
}

const Board = ({project}: Props) => {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddColumn = (title: string) => {
        dispatch(addColumn({
        projectId: project.id,
        columnTitle: title
        }));
    };
  return (
    <>
        {isModalOpen && (
            <InputModal
            title="Добавить колонку"
            placeholder="Название колонки"
            submitText="Добавить"
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddColumn}
            />
        )}
        <div className='columns-container'>
            {project.columns.map((column) =>(
                <Column  column={column} key={column.id} projectId={project.id}></Column>
            ))}
            <div>
                <Button onClick={() => setIsModalOpen(true)}>Добавить колонку</Button>
            </div>
            {/*TODO: логика создания новой колонки*/}
            {/*TODO: drag-n-drop для перемещения колонок*/}
        </div>
        <p></p>
    </>
    
  )
}

export default Board

// src/components/Board/Board.tsx
import './Board.css'
import Column from './Column'
import { IProject } from "../../types/entities";
import Button from '../UI/Button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import { addColumn } from '../../app/features/board/boardSlice';
import InputModal from '../UI/InputModal';
import { selectColumnsByProjectId } from '../../app/features/board/boardSelectors';

type Props = {
    project: IProject
}

const Board = ({project}: Props) => {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Получаем колонки из селектора вместо project.columns
    const columns = useAppSelector(state => selectColumnsByProjectId(state, project.id));

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
            <div className="board-container">
                <div className='columns-container'>
                    {columns.map((column) =>(
                        <Column column={column} key={column.id} projectId={project.id} />
                    ))}
                    <div className="add-column-button">
                        <Button onClick={() => setIsModalOpen(true)}>Добавить колонку</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Board
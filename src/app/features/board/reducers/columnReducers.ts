// src/app/features/board/reducers/columnReducers.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { BoardState } from '../boardTypes';

const columnReducers = {
  addColumn: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnTitle: string;
  }>) => {
    const { projectId, columnTitle } = action.payload;
    const dateId = Date.now().toString();
    
    // Определяем порядок новой колонки
    const projectColumns = Object.values(state.columns)
      .filter(column => column.projectId === projectId);
    
    const maxOrder = projectColumns.length > 0
      ? Math.max(...projectColumns.map(c => c.order))
      : -1;
    
    // Добавляем колонку
    state.columns[dateId] = {
      id: dateId,
      projectId,
      title: columnTitle,
      order: maxOrder + 1,
      createdAt: new Date().toISOString()
    };
  },
  
  deleteColumn: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
  }>) => {
    const { columnId } = action.payload;
    
    // Удаляем все задачи колонки
    Object.values(state.tasks).forEach(task => {
      if (task.columnId === columnId) {
        delete state.tasks[task.id];
      }
    });
    
    // Удаляем колонку
    delete state.columns[columnId];
  },
  
  updateColumnTitle: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    newTitle: string;
  }>) => {
    const { columnId, newTitle } = action.payload;
    
    if (state.columns[columnId]) {
      state.columns[columnId].title = newTitle;
      state.columns[columnId].updatedAt = new Date().toISOString();
    }
  }
};

export default columnReducers;
// src/app/features/board/reducers/projectReducers.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { BoardState } from '../boardTypes';

const projectReducers = {
  createProject: (state: BoardState, action: PayloadAction<{ title: string }>) => {
    const dateId = Date.now().toString();
    
    // Добавляем проект
    state.projects[dateId] = {
      id: dateId,
      title: action.payload.title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Создаем дефолтные колонки для проекта
    const column1Id = `${dateId}-1`;
    const column2Id = `${dateId}-2`;
    
    // Добавляем колонки
    state.columns[column1Id] = {
      id: column1Id,
      projectId: dateId,
      title: "Сделать",
      order: 0,
      createdAt: new Date().toISOString()
    };
    
    state.columns[column2Id] = {
      id: column2Id,
      projectId: dateId,
      title: "Сделано",
      order: 1,
      createdAt: new Date().toISOString()
    };
  },
  
  deleteProject: (state: BoardState, action: PayloadAction<{ projectId: string }>) => {
    const { projectId } = action.payload;
    
    // Удаляем все колонки проекта и их задачи
    Object.values(state.columns).forEach(column => {
      if (column.projectId === projectId) {
        // Удаляем все задачи колонки
        Object.values(state.tasks).forEach(task => {
          if (task.columnId === column.id) {
            delete state.tasks[task.id];
          }
        });
        
        // Удаляем колонку
        delete state.columns[column.id];
      }
    });
    
    // Удаляем проект
    delete state.projects[projectId];
    
    // Сбрасываем активный проект, если он был удален
    if (state.activeProjectId === projectId) {
      state.activeProjectId = null;
    }
  },
  
  updateProjectTitle: (state: BoardState, action: PayloadAction<{
    projectId: string;
    newTitle: string;
  }>) => {
    const { projectId, newTitle } = action.payload;
    
    if (state.projects[projectId]) {
      state.projects[projectId].title = newTitle;
      state.projects[projectId].updatedAt = new Date().toISOString();
    }
  }
};

export default projectReducers;
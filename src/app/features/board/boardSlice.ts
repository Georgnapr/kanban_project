// src/app/features/board/boardSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';
import projectReducers from './reducers/projectReducers';
import columnReducers from './reducers/columnReducers';
import taskReducers from './reducers/taskReducers';
import priorityReducers from './reducers/priorityReducers';
import filterReducers from './reducers/filterReducers';

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    ...projectReducers,
    ...columnReducers,
    ...taskReducers,
    ...priorityReducers,
    ...filterReducers
  }
});

// Экспорт всех actions
export const { 
  // Проекты
  createProject,
  deleteProject,
  updateProjectTitle,
  
  // Колонки
  addColumn,
  deleteColumn,
  updateColumnTitle,
  
  // Задачи
  addTask,
  deleteTask,
  updateTaskTitle,
  updateTaskDueDate,
  moveTask,
  updateTaskStatus,
  updateTaskDescription,
  
  // Приоритеты
  updateTaskImportance,
  updateTaskComplexity,
  toggleTaskPriorityMode,
  updateTaskManualPriority,
  recalculateAllTaskPriorities,
  
  // Фильтры
  setSearchQuery,
  toggleStatusFilter,
  toggleDueDateFilter,
  setSortBy,
  resetFilters
} = boardSlice.actions;

export default boardSlice.reducer;
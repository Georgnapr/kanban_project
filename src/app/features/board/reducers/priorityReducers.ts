// src/app/features/board/reducers/priorityReducers.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { BoardState } from '../boardTypes';
import { PriorityLevel } from '../../../../types/entities';
import { 
  calculatePriorityLevel, 
  calculateTaskPriorityValue 
} from '../../../../utils/priorityCalculator';

const priorityReducers = {
  updateTaskImportance: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
    importance: number;
  }>) => {
    const { taskId, importance } = action.payload;
    
    if (state.tasks[taskId]) {
      state.tasks[taskId].importance = importance;
      
      // Обновляем приоритет, если используется автоматический расчет
      if (state.tasks[taskId].useAutoPriority) {
        const priorityValue = calculateTaskPriorityValue(state.tasks[taskId]);
        state.tasks[taskId].priorityLevel = calculatePriorityLevel(priorityValue);
      }
    }
  },
  
  updateTaskComplexity: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
    complexity: number;
  }>) => {
    const { taskId, complexity } = action.payload;
    
    if (state.tasks[taskId]) {
      state.tasks[taskId].complexity = complexity;
      
      // Обновляем приоритет, если используется автоматический расчет
      if (state.tasks[taskId].useAutoPriority) {
        const priorityValue = calculateTaskPriorityValue(state.tasks[taskId]);
        state.tasks[taskId].priorityLevel = calculatePriorityLevel(priorityValue);
      }
    }
  },
  
  toggleTaskPriorityMode: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
    useAutoPriority: boolean;
  }>) => {
    const { taskId, useAutoPriority } = action.payload;
    
    if (state.tasks[taskId]) {
      state.tasks[taskId].useAutoPriority = useAutoPriority;
      
      // Если включен автоматический расчет, пересчитываем приоритет
      if (useAutoPriority) {
        const priorityValue = calculateTaskPriorityValue(state.tasks[taskId]);
        state.tasks[taskId].priorityLevel = calculatePriorityLevel(priorityValue);
      }
      // При переключении в ручной режим, приоритет остается текущим
    }
  },
  
  updateTaskManualPriority: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
    priorityLevel: PriorityLevel;
  }>) => {
    const { taskId, priorityLevel } = action.payload;
    
    if (state.tasks[taskId]) {
      state.tasks[taskId].priorityLevel = priorityLevel;
    }
  },
  
  recalculateAllTaskPriorities: (state: BoardState) => {
    Object.keys(state.tasks).forEach(taskId => {
      const task = state.tasks[taskId];
      
      // Пересчитываем только для задач с автоматическим режимом
      if (task.useAutoPriority) {
        const priorityValue = calculateTaskPriorityValue(task);
        task.priorityLevel = calculatePriorityLevel(priorityValue);
      }
    });
  }
};

export default priorityReducers;
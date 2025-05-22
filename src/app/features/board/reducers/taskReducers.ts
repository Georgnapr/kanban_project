// src/app/features/board/reducers/taskReducers.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { BoardState } from '../boardTypes';
import { ITask, PriorityLevel } from '../../../../types/entities';
import { 
  calculatePriorityLevel, 
  calculateTaskPriorityValue 
} from '../../../../utils/priorityCalculator';

const taskReducers = {
  addTask: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskTitle: string;
    dueDate?: string;
    importance?: number;
    complexity?: number;
  }>) => {
    const { projectId, columnId, taskTitle, dueDate, importance = 3, complexity = 3 } = action.payload;
    const taskId = Date.now().toString();
    
    // Определяем порядок новой задачи
    const columnTasks = Object.values(state.tasks)
      .filter(task => task.columnId === columnId);
    
    const maxOrder = columnTasks.length > 0
      ? Math.max(...columnTasks.map(t => t.order))
      : -1;
    
    // Создаем новую задачу
    const newTask: ITask = {
      id: taskId,
      columnId,
      projectId,
      title: taskTitle,
      completed: false,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      dueDate,
      importance,
      complexity,
      useAutoPriority: false,
      priorityLevel: PriorityLevel.NotSet
    };
    
    // Добавляем задачу
    state.tasks[taskId] = newTask;
  },
  
  deleteTask: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
  }>) => {
    const { taskId } = action.payload;
    
    // Удаляем задачу
    delete state.tasks[taskId];
  },
  
  updateTaskTitle: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
    newTitle: string;
  }>) => {
    const { taskId, newTitle } = action.payload;
    
    if (state.tasks[taskId]) {
      state.tasks[taskId].title = newTitle;
    }
  },
  
  moveTask: (state: BoardState, action: PayloadAction<{
    sourceProjectId: string;
    sourceColumnId: string;
    sourceTaskId: string;
    targetProjectId: string;
    targetColumnId: string;
  }>) => {
    const {
      sourceTaskId,
      targetColumnId,
      targetProjectId
    } = action.payload;
    
    const task = state.tasks[sourceTaskId];
    
    if (task) {
      const oldColumnId = task.columnId;
      
      // Обновляем задачу
      task.columnId = targetColumnId;
      task.projectId = targetProjectId;
      
      // Пересчитываем порядки задач в исходной колонке
      const sourceTasks = Object.values(state.tasks)
        .filter(t => t.columnId === oldColumnId)
        .sort((a, b) => a.order - b.order);
      
      sourceTasks.forEach((t, index) => {
        state.tasks[t.id].order = index;
      });
      
      // Вычисляем новый порядок для перемещенной задачи (в конец целевой колонки)
      const targetTasks = Object.values(state.tasks)
        .filter(t => t.columnId === targetColumnId && t.id !== sourceTaskId);
      
      task.order = targetTasks.length;
    }
  },
  
  updateTaskStatus: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
    completed: boolean;
  }>) => {
    const { taskId, completed } = action.payload;
    
    if (state.tasks[taskId]) {
      state.tasks[taskId].completed = completed;
      
      // Если задача отмечена как выполненная, устанавливаем дату завершения
      if (completed) {
        state.tasks[taskId].completedAt = new Date().toISOString();
      } else {
        // Если задача снова помечена как невыполненная, убираем дату завершения
        state.tasks[taskId].completedAt = undefined;
      }
      
      // Обновляем приоритет
      if (state.tasks[taskId].useAutoPriority) {
        const priorityValue = calculateTaskPriorityValue(state.tasks[taskId]);
        state.tasks[taskId].priorityLevel = calculatePriorityLevel(priorityValue);
      }
    }
  },
  
  updateTaskDescription: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
    description: string;
  }>) => {
    const { taskId, description } = action.payload;
    
    if (state.tasks[taskId]) {
      state.tasks[taskId].description = description;
    }
  },
  
  updateTaskDueDate: (state: BoardState, action: PayloadAction<{
    projectId: string;
    columnId: string;
    taskId: string;
    dueDate?: string;
  }>) => {
    const { taskId, dueDate } = action.payload;
    
    if (state.tasks[taskId]) {
      state.tasks[taskId].dueDate = dueDate;
      
      // Обновляем приоритет, если используется автоматический расчет
      if (state.tasks[taskId].useAutoPriority) {
        const priorityValue = calculateTaskPriorityValue(state.tasks[taskId]);
        state.tasks[taskId].priorityLevel = calculatePriorityLevel(priorityValue);
      }
    }
  }
};

export default taskReducers;
// src/app/features/board/boardSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardState } from './boardTypes';
import {ITask, PriorityLevel } from '../../../types/entities';
import { 
  calculatePriorityLevel, 
  calculateTaskPriorityValue 
} from '../../../utils/priorityCalculator';

// Начальное состояние с плоской структурой
const initialState: BoardState = {
  projects: {
    '1': {
      id: '1',
      title: 'Разработка сайта',
      createdAt: new Date().toISOString()
    },
    '2': {
      id: '2',
      title: 'Мобильное приложение',
      createdAt: new Date().toISOString()
    }
  },
  columns: {
    '1': {
      id: '1',
      projectId: '1',
      title: 'Дизайн главной',
      order: 0,
      createdAt: new Date().toISOString()
    },
    '2': {
      id: '2',
      projectId: '1',
      title: 'Верстка',
      order: 1,
      createdAt: new Date().toISOString()
    },
    '3': {
      id: '3',
      projectId: '2',
      title: 'Прототип',
      order: 0,
      createdAt: new Date().toISOString()
    }
  },
  tasks: {
    '1': {
      id: '1',
      columnId: '2',
      projectId: '1',
      title: 'Верстка лендинга',
      order: 0,
      createdAt: new Date().toISOString(),
      importance: 3,
      complexity: 3,
      useAutoPriority: false,
      priorityLevel: PriorityLevel.NotSet
    },
    '2': {
      id: '2',
      columnId: '2',
      projectId: '1',
      title: 'Верстка dashboard',
      order: 1,
      createdAt: new Date().toISOString(),
      importance: 3,
      complexity: 3,
      useAutoPriority: false,
      priorityLevel: PriorityLevel.NotSet
    },
    '3': {
      id: '3',
      columnId: '2',
      projectId: '1',
      title: 'Верстка стр. регистрации',
      order: 2,
      createdAt: new Date().toISOString(),
      importance: 3,
      complexity: 3,
      useAutoPriority: false,
      priorityLevel: PriorityLevel.NotSet
    },
    '4': {
      id: '4',
      columnId: '3',
      projectId: '2',
      title: 'Верстка лендинга моб.',
      order: 0,
      createdAt: new Date().toISOString(),
      importance: 3,
      complexity: 3,
      useAutoPriority: false,
      priorityLevel: PriorityLevel.NotSet
    },
    '5': {
      id: '5',
      columnId: '3',
      projectId: '2',
      title: 'Верстка dashboard моб.',
      order: 1,
      createdAt: new Date().toISOString(),
      importance: 3,
      complexity: 3,
      useAutoPriority: false,
      priorityLevel: PriorityLevel.NotSet
    }
  },
  activeProjectId: null,
  filters: {
    searchQuery: '',
    statusFilters: {
      completed: false,
      active: false
    },
    dueDateFilters: {
      overdue: false,
      upcoming: false,
      noDueDate: false
    },
    sortBy: 'newest'
  },
  status: 'idle',
  error: null
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // Редьюсеры для проектов
    createProject: (state, action: PayloadAction<{ title: string }>) => {
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
    
    deleteProject: (state, action: PayloadAction<{ projectId: string }>) => {
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
    
    // Редьюсеры для колонок
    addColumn: (state, action: PayloadAction<{
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
    
    deleteColumn: (state, action: PayloadAction<{
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
    
    // Редьюсеры для задач
    addTask: (state, action: PayloadAction<{
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
      
      // Рассчитываем приоритет для новой задачи
      const priorityValue = calculateTaskPriorityValue(newTask);
      newTask.priorityLevel = calculatePriorityLevel(priorityValue);
      
      // Добавляем задачу
      state.tasks[taskId] = newTask;
    },
    
    deleteTask: (state, action: PayloadAction<{
      projectId: string;
      columnId: string;
      taskId: string;
    }>) => {
      const { taskId } = action.payload;
      
      // Удаляем задачу
      delete state.tasks[taskId];
    },
    
    // Изменение названия проекта
    updateProjectTitle: (state, action: PayloadAction<{
      projectId: string;
      newTitle: string;
    }>) => {
      const { projectId, newTitle } = action.payload;
      
      if (state.projects[projectId]) {
        state.projects[projectId].title = newTitle;
        state.projects[projectId].updatedAt = new Date().toISOString();
      }
    },
    
    // Изменение названия колонки
    updateColumnTitle: (state, action: PayloadAction<{
      projectId: string;
      columnId: string;
      newTitle: string;
    }>) => {
      const { columnId, newTitle } = action.payload;
      
      if (state.columns[columnId]) {
        state.columns[columnId].title = newTitle;
        state.columns[columnId].updatedAt = new Date().toISOString();
      }
    },
    
    // Изменение названия задачи
    updateTaskTitle: (state, action: PayloadAction<{
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
    
    // Перемещение задачи
    moveTask: (state, action: PayloadAction<{
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
    
    // Обновление статуса задачи
    updateTaskStatus: (state, action: PayloadAction<{
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
    
    // Обновление описания задачи
    updateTaskDescription: (state, action: PayloadAction<{
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
    
    // Обновление дедлайна задачи
    updateTaskDueDate: (state, action: PayloadAction<{
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
    },
    
    // НОВЫЕ РЕДЬЮСЕРЫ ДЛЯ СИСТЕМЫ ПРИОРИТИЗАЦИИ
    
    // Обновление важности задачи
    updateTaskImportance: (state, action: PayloadAction<{
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
    
    // Обновление сложности задачи
    updateTaskComplexity: (state, action: PayloadAction<{
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
    
    // Переключение режима расчета приоритета
    toggleTaskPriorityMode: (state, action: PayloadAction<{
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
    
    // Установка ручного приоритета задачи
    updateTaskManualPriority: (state, action: PayloadAction<{
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
    
    // Пересчет приоритетов всех задач
    recalculateAllTaskPriorities: (state) => {
      Object.keys(state.tasks).forEach(taskId => {
        const task = state.tasks[taskId];
        
        // Пересчитываем только для задач с автоматическим режимом
        if (task.useAutoPriority) {
          const priorityValue = calculateTaskPriorityValue(task);
          task.priorityLevel = calculatePriorityLevel(priorityValue);
        }
      });
    },
    
    // Редьюсеры для фильтров
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    
    toggleStatusFilter: (state, action: PayloadAction<'completed' | 'active'>) => {
      state.filters.statusFilters[action.payload] = !state.filters.statusFilters[action.payload];
    },
    
    toggleDueDateFilter: (state, action: PayloadAction<'overdue' | 'upcoming' | 'noDueDate'>) => {
      state.filters.dueDateFilters[action.payload] = !state.filters.dueDateFilters[action.payload];
    },
    
    setSortBy: (state, action: PayloadAction<'newest' | 'oldest' | 'dueDate' | 'alphabetical' | 'priority'>) => {
      state.filters.sortBy = action.payload;
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { 
  createProject,
  deleteProject,
  addColumn,
  deleteColumn,
  addTask,
  deleteTask,
  updateProjectTitle,
  updateColumnTitle,
  updateTaskTitle,
  updateTaskDueDate,
  moveTask,
  updateTaskStatus,
  updateTaskDescription,
  setSearchQuery,
  toggleStatusFilter,
  toggleDueDateFilter,
  setSortBy,
  resetFilters,
  
  // Новые действия для приоритизации
  updateTaskImportance,
  updateTaskComplexity,
  toggleTaskPriorityMode,
  updateTaskManualPriority,
  recalculateAllTaskPriorities
} = boardSlice.actions;

export default boardSlice.reducer;
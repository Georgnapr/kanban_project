// src/app/features/board/boardSelectors.ts
import { RootState } from '../../store';
import { IProject, IColumn, ITask } from '../../../types/entities';
import { createSelector } from '@reduxjs/toolkit';
import { PriorityLevel } from '../../../types/entities';
import { getPriorityValue, getTaskPriority } from '../../../utils/priorityCalculator';

const selectAllTasks = (state: RootState) => state.board.tasks;

// Селекторы для проектов
// Базовый селектор для проектов
const selectProjects = (state: RootState) => state.board.projects;

// Мемоизированный селектор для всех проектов
export const selectAllProjects = createSelector(
  [selectProjects],
  (projects) => Object.values(projects)
);

export const selectProjectById = (state: RootState, projectId: string): IProject | undefined => 
  state.board.projects[projectId];

export const selectActiveProject = (state: RootState): IProject | undefined => {
  const { activeProjectId } = state.board;
  return activeProjectId ? state.board.projects[activeProjectId] : undefined;
};

// Селекторы для колонок
export const selectColumnsByProjectId = (state: RootState, projectId: string): IColumn[] => 
  Object.values(state.board.columns)
    .filter(column => column.projectId === projectId)
    .sort((a, b) => a.order - b.order);

export const selectColumnById = (state: RootState, columnId: string): IColumn | undefined => 
  state.board.columns[columnId];

// Селекторы для задач
export const selectTasksByColumnId = (state: RootState, columnId: string): ITask[] => 
  Object.values(state.board.tasks)
    .filter(task => task.columnId === columnId)
    .sort((a, b) => a.order - b.order);

export const selectTaskById = (state: RootState, taskId: string): ITask | undefined => 
  state.board.tasks[taskId];

export const selectTasksByProjectId = (state: RootState, projectId: string): ITask[] => 
  Object.values(state.board.tasks)
    .filter(task => task.projectId === projectId);

// Селектор для получения текущих фильтров
export const selectFilters = (state: RootState) => state.board.filters;

// Селектор для получения отфильтрованных задач колонки
export const selectFilteredTasks = (state: RootState, projectId: string, columnId: string): ITask[] => {
  const tasks = selectTasksByColumnId(state, columnId);
  const filters = selectFilters(state);
  
  // Проверяем, активны ли вообще какие-либо фильтры
  const hasActiveStatusFilters = Object.values(filters.statusFilters).some(value => value);
  const hasActiveDueDateFilters = Object.values(filters.dueDateFilters).some(value => value);
  
  return tasks.filter(task => {
    // Фильтрация по поиску
    const matchesSearch = !filters.searchQuery || 
      task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    
    // Фильтрация по статусу - если ни один фильтр не выбран, показываем все
    let matchesStatus = true;
    if (hasActiveStatusFilters) {
      matchesStatus = (filters.statusFilters.completed && task.completed) || 
                      (filters.statusFilters.active && !task.completed);
    }
    
    // Фильтрация по дедлайну - если ни один фильтр не выбран, показываем все
    let matchesDueDate = true;
    if (hasActiveDueDateFilters) {
      const now = new Date();
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      
      matchesDueDate = (filters.dueDateFilters.overdue && dueDate && dueDate < now && !task.completed) ||
                       (filters.dueDateFilters.upcoming && dueDate && dueDate >= now) ||
                       (filters.dueDateFilters.noDueDate && !dueDate);
    }
    
    return matchesSearch && matchesStatus && matchesDueDate;
  }).sort((a, b) => {
    // Сортировка в зависимости от выбранного параметра
    switch (filters.sortBy) {
      case 'priority':
        // Получаем значение приоритета с учетом типа (авто/ручной)
        const priorityA = getPriorityValue(a);
        const priorityB = getPriorityValue(b);
        return priorityB - priorityA; // Сортировка по убыванию
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};

// Обновленный селектор активности фильтров
export const selectIsFiltersActive = (state: RootState) => {
  const filters = state.board.filters;
  return filters.searchQuery !== '' || 
         Object.values(filters.statusFilters).some(value => value) || 
         Object.values(filters.dueDateFilters).some(value => value) || 
         filters.sortBy !== 'newest'; // Это уже учитывает 'priority' как нестандартную сортировку
};

// Подсчет количества отфильтрованных задач
export const selectFilteredTasksCount = (state: RootState, projectId: string) => {
  const columns = selectColumnsByProjectId(state, projectId);
  
  let totalFilteredTasks = 0;
  
  columns.forEach(column => {
    totalFilteredTasks += selectFilteredTasks(state, projectId, column.id).length;
  });
  
  return totalFilteredTasks;
};

export const selectTasksWithDueDate = createSelector(
  [selectAllTasks], // входные селекторы
  (tasks) => Object.values(tasks).filter(task => task.dueDate) // функция преобразования
);

// Мемоизированный селектор для задач с дедлайнами конкретного проекта
export const selectTasksWithDueDateByProject = createSelector(
  [selectAllTasks, (_, projectId: string) => projectId],
  (tasks, projectId) => Object.values(tasks)
    .filter(task => task.projectId === projectId && task.dueDate)
);

// Селектор для получения задач, отсортированных по приоритету
export const selectTasksByPriority = createSelector(
  [selectAllTasks],
  (tasks) => {
    // Сортируем задачи по приоритету
    return [...Object.values(tasks)]
      .filter(task => !task.completed) // Фильтруем только незавершенные задачи
      .sort((a, b) => {
        // Получаем значения приоритета для сортировки
        const priorityA = getPriorityValue(a);
        const priorityB = getPriorityValue(b);
        return priorityB - priorityA; // Сортировка по убыванию
      });
  }
);

// Селектор для получения задач с высоким и критическим приоритетом
export const selectHighPriorityTasks = createSelector(
  [selectAllTasks],
  (tasks) => Object.values(tasks)
    .filter(task => {
      if (task.completed) return false;
      
      // Получаем текущий уровень приоритета
      const priority = getTaskPriority(task);
      
      // Фильтруем задачи с высоким и критическим приоритетом
      return priority === PriorityLevel.High || priority === PriorityLevel.Critical;
    })
);

// Селектор для получения задач колонки, отсортированных по приоритету
export const selectTasksByColumnIdSortedByPriority = createSelector(
  [selectAllTasks, (_, columnId: string) => columnId],
  (tasks, columnId) => Object.values(tasks)
    .filter(task => task.columnId === columnId)
    .sort((a, b) => {
      // Сравниваем значения приоритета
      const priorityA = getPriorityValue(a);
      const priorityB = getPriorityValue(b);
      return priorityB - priorityA; // Сортировка по убыванию
    })
);

// Селектор для получения критических задач проекта
export const selectCriticalTasksByProject = createSelector(
  [selectAllTasks, (_, projectId: string) => projectId],
  (tasks, projectId) => Object.values(tasks)
    .filter(task => 
      task.projectId === projectId && 
      !task.completed &&
      getTaskPriority(task) === PriorityLevel.Critical
    )
);
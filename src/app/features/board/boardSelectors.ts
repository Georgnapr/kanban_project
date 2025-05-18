// src/app/features/board/boardSelectors.ts
import { RootState } from '../../store';
import { IProject, IColumn, ITask } from '../../../types/entities';

// Селекторы для проектов
export const selectAllProjects = (state: RootState): IProject[] => 
  Object.values(state.board.projects);

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
         filters.sortBy !== 'newest';
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
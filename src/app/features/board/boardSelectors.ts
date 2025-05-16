import { RootState } from '../../store';

// Все проекты
export const selectAllProjects = (state: RootState) => state.board.projects;

// Проект по ID
export const selectProjectById = (state: RootState, projectId: string) => 
  state.board.projects.find(project => project.id === projectId);

// Активный проект
export const selectActiveProject = (state: RootState) => 
  state.board.projects.find(p => p.id === state.board.activeProjectId);

// Селектор для получения текущих фильтров
export const selectFilters = (state: RootState) => state.board.filters;

// Селектор для получения отфильтрованных задач проекта
export const selectFilteredTasks = (state: RootState, projectId: string, columnId: string) => {
  const project = selectProjectById(state, projectId);
  const filters = selectFilters(state);
  
  if (!project) return [];
  
  const column = project.columns.find(c => c.id === columnId);
  if (!column) return [];

  // Проверим, активны ли вообще какие-либо фильтры
  const hasActiveStatusFilters = Object.values(filters.statusFilters).some(value => value);
  const hasActiveDueDateFilters = Object.values(filters.dueDateFilters).some(value => value);
  
  return column.tasks.filter(task => {
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
    // Сортировка в зависимости от выбранного параметра (без изменений)
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

// Обновите селектор активности фильтров
export const selectIsFiltersActive = (state: RootState) => {
  const filters = state.board.filters;
  return filters.searchQuery !== '' || 
         Object.values(filters.statusFilters).some(value => value) || 
         Object.values(filters.dueDateFilters).some(value => value) || 
         filters.sortBy !== 'newest';
};

// Подсчет количества отфильтрованных задач
export const selectFilteredTasksCount = (state: RootState, projectId: string) => {
  const project = selectProjectById(state, projectId);
  
  if (!project) return 0;
  
  let totalFilteredTasks = 0;
  
  project.columns.forEach(column => {
    totalFilteredTasks += selectFilteredTasks(state, projectId, column.id).length;
  });
  
  return totalFilteredTasks;
};
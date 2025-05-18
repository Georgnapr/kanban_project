// src/types/entities.ts

// Проект
export interface IProject {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

// Колонка
export interface IColumn {
  id: string;
  projectId: string;  // Ссылка на родительский проект
  title: string;
  order: number;      // Для сортировки колонок
  createdAt?: string;
  updatedAt?: string;
}

// Задача
export interface ITask {
  id: string;
  columnId: string;   // Ссылка на родительскую колонку
  projectId: string;  // Ссылка на проект для упрощения запросов
  title: string;
  description?: string;
  completed?: boolean;
  order: number;      // Для сортировки задач в колонке
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
}

// Структура фильтров (остается без изменений)
export interface FilterState {
  searchQuery: string;
  statusFilters: {
    completed: boolean;
    active: boolean;
  };
  dueDateFilters: {
    overdue: boolean;
    upcoming: boolean;
    noDueDate: boolean;
  };
  sortBy: 'newest' | 'oldest' | 'dueDate' | 'alphabetical';
}
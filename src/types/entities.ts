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

export enum PriorityLevel {
  NotSet = 'Не задан',        // Не задан (серый)
  Low = 'Низкий',              // Низкий (зеленый)
  Medium = 'Средний',        // Средний (синий)
  High = 'High',            // Высокий (оранжевый)
  Critical = 'Критический'     // Критический (красный)
}

// Задача
export interface ITask {
  id: string;
  columnId: string;
  projectId: string;
  title: string;
  description?: string;
  completed?: boolean;
  order: number;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  
  // Поля для системы приоритизации
  importance: number;                        // Субъективная важность (1-5)
  complexity: number;                        // Сложность задачи (1-5)
  // Упрощенная модель приоритета
  useAutoPriority: boolean;       // Использовать автоматический расчет?
  priorityLevel: PriorityLevel;   // Уровень приоритета (вычисленный или заданный вручную)
}

// Структура фильтров 
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
  sortBy: 'newest' | 'oldest' | 'dueDate' | 'alphabetical' | 'priority';
}
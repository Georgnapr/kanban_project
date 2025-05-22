// src/app/features/board/initialState.ts
import { BoardState } from './boardTypes';
import { PriorityLevel } from '../../../types/entities';

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

export default initialState;
import { RootState } from '../../store';

// Все проекты
export const selectAllProjects = (state: RootState) => state.board.projects;

// Проект по ID
export const selectProjectById = (state: RootState, projectId: string) => 
  state.board.projects.find(project => project.id === projectId);

// Активный проект
export const selectActiveProject = (state: RootState) => 
  state.board.projects.find(p => p.id === state.board.activeProjectId);
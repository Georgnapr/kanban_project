import { IProject } from "../../../types/entities";

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

export interface boardState {
  projects: IProject[];
  activeProjectId: string | null;
  filters: FilterState;
}
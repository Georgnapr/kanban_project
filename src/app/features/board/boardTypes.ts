// src/app/features/board/boardTypes.ts
import { FilterState, IProject, IColumn, ITask } from "../../../types/entities";

export interface BoardState {
  projects: { [id: string]: IProject };
  columns: { [id: string]: IColumn };
  tasks: { [id: string]: ITask };
  activeProjectId: string | null;
  filters: FilterState;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
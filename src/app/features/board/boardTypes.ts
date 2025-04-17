import { IProject } from "../../../types/entities";

export interface boardState {
    projects: IProject[];
    activeProjectId: string | null; // Текущая открытая доска
  }
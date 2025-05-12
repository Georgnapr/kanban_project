// Проект
export interface IProject {
    id: string;
    title: string;
    columns: IColumn[];
}
  
// Задача
export interface IColumn {
    id: string;
    title: string;
    order?: number;
    tasks: ITask[];     // Задачи
}
  
// Задача
export interface ITask {
    id: string;
    title: string;
    order?: number;
    completed?: boolean;
    description?: string;
}
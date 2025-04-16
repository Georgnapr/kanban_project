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
    tasks: ITask[];     // Задачи
}
  
// Задача
export interface ITask {
    id: string;
    title: string;
    completed?: boolean;
}
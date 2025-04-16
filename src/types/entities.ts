// Проект
export interface Project {
    id: string;
    title: string;
    columns: Column[];
}
  
// Задача
export interface Column {
    id: string;
    title: string;
    tasks?: Task[];     // Задачи
}
  
// Задача
export interface Task {
    id: string;
    title: string;
    completed?: boolean;
}
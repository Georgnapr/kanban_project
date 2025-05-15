import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { boardState } from './boardTypes';

const initialState: boardState = {
    projects: [ // Ваш initial state
        {
            id: '1',
            title: 'Разработка сайта',
            columns: [
              { id: '1', 
                title: 'Дизайн главной', 
                tasks: [
                ]},
              { id: '2', 
                title: 'Верстка', 
                tasks: [
                  {
                    id: '1',
                    title: 'Верстка лендинга',
                    createdAt: new Date().toISOString(),
                  },
                  {
                    id: '2',
                    title: 'Верстка dashboard',
                    createdAt: new Date().toISOString(),
                  },
                  {
                    id: '3',
                    title: 'Верстка стр. регистрации',
                    createdAt: new Date().toISOString(),
                  },
                ]}
            ]
          },
          {
            id: '2',
            title: 'Мобильное приложение',
            columns: [
              { id: '1', 
                title: 'Прототип', 
                tasks: [
                  {
                    id: '1',
                    title: 'Верстка лендинга моб.',
                    createdAt: new Date().toISOString(),
                  },
                  {
                    id: '2',
                    title: 'Верстка dashboard моб.',
                    createdAt: new Date().toISOString(),
                  },
                ]}
            ]
          }
    ], 
    activeProjectId: null,
  };

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers : {
      createProject: (state, action: PayloadAction<{ title: string }>) => {
        const dateId = Date.now().toString(); // Генерируем ID из текущей даты
        
        const defaultColumns = [
          {
            id: `${dateId}-1`, // Используем дату + суффикс для колонок
            title: "Сделать",
            tasks: []
          },
          {
            id: `${dateId}-2`,
            title: "Сделано",
            tasks: []
          }
        ];
        
        const newProject = {
          id: dateId, // Используем дату как ID проекта
          title: action.payload.title,
          columns: defaultColumns
        };
        
        state.projects.push(newProject);
      },
      deleteProject: (state, action: PayloadAction<{ projectId: string }>) => {
        state.projects = state.projects.filter(
          project => project.id !== action.payload.projectId
        );
        // Сбрасываем активный проект, если он был удален
        if (state.activeProjectId === action.payload.projectId) {
          state.activeProjectId = null;
        }
      },

      addColumn: (state, action: PayloadAction<{
        projectId: string;
        columnTitle: string;
      }>) => {
        const { projectId, columnTitle } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        const dateId = Date.now().toString();
        if (project) {
          const newColumn = {
            id: `${dateId}`,
            title: columnTitle,
            tasks: []
          };
          project.columns.push(newColumn);
        }
      },

      deleteColumn: (state, action: PayloadAction<{
        projectId: string;
        columnId: string;
      }>) => {
        const { projectId, columnId } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          project.columns = project.columns.filter(
            column => column.id !== columnId
          );
        }
      },


      addTask: (state, action: PayloadAction<{
        projectId: string;
        columnId: string;
        taskTitle: string;
        dueDate?: string; // Опциональный дедлайн при создании
      }>) => {
        const { projectId, columnId, taskTitle, dueDate } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            const currentDate = new Date().toISOString();
            const newTask = {
              id: Date.now().toString(),
              title: taskTitle,
              completed: false,
              order: column.tasks.length + 1,
              createdAt: currentDate,        // Дата создания задачи
              dueDate: dueDate || undefined  // Дедлайн только если указан
            };
            column.tasks.push(newTask);
          }
        }
      },

      deleteTask: (state, action: PayloadAction<{
        projectId: string;
        columnId: string;
        taskId: string;
      }>) => {
        const { projectId, columnId, taskId } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            column.tasks = column.tasks.filter(
              task => task.id !== taskId
            );
          }
        }
      },
            // Изменение названия проекта
      updateProjectTitle: (state, action: PayloadAction<{
        projectId: string;
        newTitle: string;
      }>) => {
        const { projectId, newTitle } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          project.title = newTitle;
        }
      },

      // Изменение названия колонки
      updateColumnTitle: (state, action: PayloadAction<{
        projectId: string;
        columnId: string;
        newTitle: string;
      }>) => {
        const { projectId, columnId, newTitle } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            column.title = newTitle;
          }
        }
      },

      // Изменение названия задачи
      updateTaskTitle: (state, action: PayloadAction<{
        projectId: string;
        columnId: string;
        taskId: string;
        newTitle: string;
      }>) => {
        const { projectId, columnId, taskId, newTitle } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            const task = column.tasks.find(t => t.id === taskId);
            if (task) {
              task.title = newTitle;
            }
          }
        }
      },
      moveTask: (state, action: PayloadAction<{
        sourceProjectId: string;
        sourceColumnId: string;
        sourceTaskId: string;
        targetProjectId: string;
        targetColumnId: string;
         // Опциональная позиция в новой колонке
      }>) => {
        const {
          sourceProjectId,
          sourceColumnId,
          sourceTaskId,
          targetProjectId,
          targetColumnId,
        } = action.payload;
      
        const sourceProject = state.projects.find(p => p.id === sourceProjectId);
        const targetProject = state.projects.find(p => p.id === targetProjectId);
        console.log(action);
        
        if (!sourceProject || !targetProject) return;
      
        const sourceColumn = sourceProject.columns.find(c => c.id === sourceColumnId);
        const targetColumn = targetProject.columns.find(c => c.id === targetColumnId);
      
        if (!sourceColumn || !targetColumn) return;
      
        const taskIndex = sourceColumn.tasks.findIndex(t => t.id === sourceTaskId);
        if (taskIndex === -1) return;
      
        const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
        
        // Обновляем порядок задач в исходной колонке
        sourceColumn.tasks.forEach((task, index) => {
          task.order = index;
        });
      
        // Вставляем задачу в целевую колонку
        const insertIndex = targetColumn.tasks.length;
        targetColumn.tasks.splice(insertIndex, 0, movedTask);
        
        // Обновляем порядок задач в целевой колонке
        targetColumn.tasks.forEach((task, index) => {
          task.order = index;
        });
      },

      updateTaskStatus: (state, action: PayloadAction<{
        projectId: string;
        columnId: string;
        taskId: string;
        completed: boolean;
      }>) => {
        const { projectId, columnId, taskId, completed } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            const task = column.tasks.find(t => t.id === taskId);
            if (task) {
              task.completed = completed;
              
              // Если задача отмечена как выполненная, устанавливаем дату завершения
              if (completed) {
                task.completedAt = new Date().toISOString();
              } else {
                // Если задача снова помечена как невыполненная, убираем дату завершения
                task.completedAt = undefined;
              }
            }
          }
        }
      },

      // Обновление описания задачи
      updateTaskDescription: (state, action: PayloadAction<{
        projectId: string;
        columnId: string;
        taskId: string;
        description: string;
      }>) => {
        const { projectId, columnId, taskId, description } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            const task = column.tasks.find(t => t.id === taskId);
            if (task) {
              task.description = description;
            }
          }
        }
      },

      // Редьюсеры для обновления дат задач
      updateTaskDueDate: (state, action: PayloadAction<{
        projectId: string;
        columnId: string;
        taskId: string;
        dueDate?: string; // Может быть undefined для удаления дедлайна
      }>) => {
        const { projectId, columnId, taskId, dueDate } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            const task = column.tasks.find(t => t.id === taskId);
            if (task) {
              task.dueDate = dueDate;
            }
          }
        }
      },
    }
})

export const { 
  createProject,
  deleteProject,
  addColumn,
  deleteColumn,
  addTask,
  deleteTask,
  updateProjectTitle,
  updateColumnTitle,
  updateTaskTitle,
  updateTaskDueDate,
  moveTask,
  updateTaskStatus,
  updateTaskDescription,
} = boardSlice.actions
export default boardSlice.reducer;
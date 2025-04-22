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
                    title: 'Верстка лендинга'
                  },
                  {
                    id: '2',
                    title: 'Верстка dashboard'
                  },
                  {
                    id: '3',
                    title: 'Верстка стр. регистрации'
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
                    title: 'Верстка лендинга моб.'
                  },
                  {
                    id: '2',
                    title: 'Верстка dashboard моб.'
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
      }>) => {
        const { projectId, columnId, taskTitle } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            const newTask = {
              id: Date.now().toString(), // или uuidv4()
              title: taskTitle,
              completed: false,
              order: column.tasks.length + 1
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
    }
})

export const { 
  createProject,
  deleteProject,
  addColumn,
  deleteColumn,
  addTask,
  deleteTask,
} = boardSlice.actions
export default boardSlice.reducer;
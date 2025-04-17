import { createSlice } from '@reduxjs/toolkit';
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

    }
})

export default boardSlice.reducer;
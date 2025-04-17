import { configureStore } from '@reduxjs/toolkit';
import boardReducer from "./features/board/boardSlice"

export const store = configureStore({
    reducer: {
        board: boardReducer,
    }
})

//TODO: Типы для TypeScript. Разобраться как работают
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
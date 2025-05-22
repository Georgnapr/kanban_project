// src/app/features/board/reducers/filterReducers.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { BoardState } from '../boardTypes';
import initialState from '../initialState';

const filterReducers = {
  setSearchQuery: (state: BoardState, action: PayloadAction<string>) => {
    state.filters.searchQuery = action.payload;
  },
  
  toggleStatusFilter: (state: BoardState, action: PayloadAction<'completed' | 'active'>) => {
    state.filters.statusFilters[action.payload] = !state.filters.statusFilters[action.payload];
  },
  
  toggleDueDateFilter: (state: BoardState, action: PayloadAction<'overdue' | 'upcoming' | 'noDueDate'>) => {
    state.filters.dueDateFilters[action.payload] = !state.filters.dueDateFilters[action.payload];
  },
  
  setSortBy: (state: BoardState, action: PayloadAction<'newest' | 'oldest' | 'dueDate' | 'alphabetical' | 'priority'>) => {
    state.filters.sortBy = action.payload;
  },
  
  resetFilters: (state: BoardState) => {
    state.filters = initialState.filters;
  }
};

export default filterReducers;
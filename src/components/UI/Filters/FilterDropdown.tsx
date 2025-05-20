// src/components/UI/Filters/FilterDropdown.tsx
import React, { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  setSearchQuery,
  toggleStatusFilter,
  toggleDueDateFilter,
  setSortBy,
  resetFilters
} from '../../../app/features/board/boardSlice';
import { selectFilters, selectFilteredTasksCount } from '../../../app/features/board/boardSelectors';
import SquareCheckbox from '../SquareCheckbox/SquareCheckbox';
import SearchInput from '../SearchInput/SearchInput';
import './FilterDropdown.css';

interface FilterDropdownProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ projectId, isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const filteredTasksCount = useAppSelector(state => 
    selectFilteredTasksCount(state, projectId)
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  if (!isOpen) return null;

  return (
    <div className="filter-dropdown-container" ref={dropdownRef}>
      <div className="filter-dropdown">
        {/* Поисковая строка */}
        <div className="filter-search-section">
          <SearchInput
            value={filters.searchQuery}
            onChange={handleSearch}
            placeholder="Поиск задач..."
          />
        </div>
        
        <div className="filter-divider"></div>
        
        {/* Фильтр статуса */}
        <div className="filter-section">
          <h4 className="filter-section-title">Статус</h4>
          <div className="filter-options">
            <SquareCheckbox
              checked={filters.statusFilters.active}
              onChange={() => dispatch(toggleStatusFilter('active'))}
              label="В процессе"
              id="status-active"
            />
            <SquareCheckbox
              checked={filters.statusFilters.completed}
              onChange={() => dispatch(toggleStatusFilter('completed'))}
              label="Завершенные"
              id="status-completed"
            />
          </div>
        </div>
        
        <div className="filter-divider"></div>
        
        {/* Фильтр дедлайна */}
        <div className="filter-section">
          <h4 className="filter-section-title">Дедлайн</h4>
          <div className="filter-options">
            <SquareCheckbox
              checked={filters.dueDateFilters.overdue}
              onChange={() => dispatch(toggleDueDateFilter('overdue'))}
              label="Просроченные"
              id="duedate-overdue"
            />
            <SquareCheckbox
              checked={filters.dueDateFilters.upcoming}
              onChange={() => dispatch(toggleDueDateFilter('upcoming'))}
              label="Предстоящие"
              id="duedate-upcoming"
            />
            <SquareCheckbox
              checked={filters.dueDateFilters.noDueDate}
              onChange={() => dispatch(toggleDueDateFilter('noDueDate'))}
              label="Без срока"
              id="duedate-nodate"
            />
          </div>
        </div>
        
        <div className="filter-divider"></div>
        
        {/* Сортировка */}
        <div className="filter-section">
          <h4 className="filter-section-title">Сортировка</h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === 'newest'}
                onChange={() => dispatch(setSortBy('newest'))}
              />
              <span>Сначала новые</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === 'oldest'}
                onChange={() => dispatch(setSortBy('oldest'))}
              />
              <span>Сначала старые</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === 'dueDate'}
                onChange={() => dispatch(setSortBy('dueDate'))}
              />
              <span>По дедлайну</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === 'alphabetical'}
                onChange={() => dispatch(setSortBy('alphabetical'))}
              />
              <span>По алфавиту</span>
            </label>
          </div>
        </div>
        
        <div className="filter-footer">
          <div className="filter-stats">
            Найдено задач: {filteredTasksCount}
          </div>
          <button 
            className="filter-reset-btn"
            onClick={() => dispatch(resetFilters())}
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;
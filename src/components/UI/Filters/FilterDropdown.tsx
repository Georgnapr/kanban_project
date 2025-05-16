// src/components/Filters/FilterDropdown.tsx
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
import Button from '../../UI/Button/Button';
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

  if (!isOpen) return null;

  return (
    <div className="filter-dropdown-container" ref={dropdownRef}>
      <div className="filter-dropdown">
        {/* Поисковая строка */}
        <div className="filter-search-section">
          <input
            type="text"
            placeholder="Поиск задач..."
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="filter-search-input"
          />
        </div>
        
        <div className="filter-divider"></div>
        
        {/* Фильтр статуса */}
        <div className="filter-section">
          <h4 className="filter-section-title">Статус</h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.statusFilters.active}
                onChange={() => dispatch(toggleStatusFilter('active'))}
              />
              <span>В процессе</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.statusFilters.completed}
                onChange={() => dispatch(toggleStatusFilter('completed'))}
              />
              <span>Завершенные</span>
            </label>
          </div>
        </div>
        
        <div className="filter-divider"></div>
        
        {/* Фильтр дедлайна */}
        <div className="filter-section">
          <h4 className="filter-section-title">Дедлайн</h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.dueDateFilters.overdue}
                onChange={() => dispatch(toggleDueDateFilter('overdue'))}
              />
              <span>Просроченные</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.dueDateFilters.upcoming}
                onChange={() => dispatch(toggleDueDateFilter('upcoming'))}
              />
              <span>Предстоящие</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.dueDateFilters.noDueDate}
                onChange={() => dispatch(toggleDueDateFilter('noDueDate'))}
              />
              <span>Без срока</span>
            </label>
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
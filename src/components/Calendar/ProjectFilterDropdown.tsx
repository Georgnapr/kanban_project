// src/components/Calendar/ProjectFilterDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { IProject } from '../../types/entities';
import SquareCheckbox from '../UI/SquareCheckbox/SquareCheckbox';
import SearchInput from '../UI/SearchInput/SearchInput';
import './ProjectFilterDropdown.css';

interface ProjectFilterDropdownProps {
  projects: IProject[];
  selectedProjectIds: string[];
  onChange: (selectedIds: string[] | ((prevIds: string[]) => string[]) | 'DESELECT_ALL') => void;
  onClose: () => void;
  isOpen: boolean;
}

const ProjectFilterDropdown: React.FC<ProjectFilterDropdownProps> = ({
  projects,
  selectedProjectIds,
  onChange,
  onClose,
  isOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Фильтрация проектов на основе поискового запроса
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Закрытие при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Обработчик изменения состояния чекбокса
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const projectId = e.target.value;
    
    onChange((prevIds: string[]) => {
      if (e.target.checked) {
        return [...prevIds, projectId];
      } else {
        return prevIds.filter(id => id !== projectId);
      }
    });
  };
  
  // Выбрать все отфильтрованные проекты
  const selectAllFilteredProjects = () => {
    const filteredIds = filteredProjects.map(project => project.id);
    onChange((prevIds: string[]) => {
      const newIds = [...prevIds];
      
      filteredIds.forEach(id => {
        if (!newIds.includes(id)) {
          newIds.push(id);
        }
      });
      
      return newIds;
    });
  };
  
  // Снять выбор со всех отфильтрованных проектов
  const deselectAllFilteredProjects = () => {
    // Если поле поиска пустое, снимаем выбор со всех проектов
    if (!searchQuery.trim()) {
      // Специальная команда для снятия выбора со всех проектов
      onChange('DESELECT_ALL');
    } else {
      // Снимаем выбор только с отфильтрованных проектов
      const filteredIds = filteredProjects.map(project => project.id);
      onChange((prevIds: string[]) => prevIds.filter(id => !filteredIds.includes(id)));
    }
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  if (!isOpen) return null;

  return (
    <div className="project-filter-dropdown" ref={dropdownRef}>
      {/* Поиск с использованием нового компонента */}
      <div className="filter-dropdown-search">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск проекта..."
          autoFocus={true}
        />
      </div>
      
      {/* Заголовок и действия */}
      <div className="filter-dropdown-header">
        <h3>Выберите проекты</h3>
        <div className="filter-dropdown-actions">
          <button onClick={selectAllFilteredProjects} className="select-all-button">
            Выбрать все
          </button>
          <button onClick={deselectAllFilteredProjects} className="clear-all-button">
            Снять выбор
          </button>
        </div>
      </div>
      
      {/* Список проектов */}
      <div className="filter-dropdown-content">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="filter-dropdown-item">
              <SquareCheckbox
                id={`project-filter-${project.id}`}
                value={project.id}
                checked={selectedProjectIds.includes(project.id)}
                onChange={handleCheckboxChange}
                label={project.title}
                stopPropagation={false}
              />
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>Проекты не найдены</p>
          </div>
        )}
      </div>
      
      {/* Подвал */}
      <div className="filter-dropdown-footer">
        <button onClick={onClose} className="apply-button">
          Применить
        </button>
      </div>
    </div>
  );
};

export default ProjectFilterDropdown;
// Обновленный компонент DropdownMenu.tsx
// Добавим возможность остановки всплытия событий

import { useState, useRef, useEffect } from 'react';
import InputModal from '../InputModal';
import './DropDownMenu.css'

interface DropdownMenuProps {
  entityType: 'project' | 'column' | 'task';
  onRename: (newTitle: string) => void;
  onDelete: () => void;
  className?: string;
}

const DropdownMenu = ({ 
  entityType,
  onRename,
  onDelete,
  className = ''
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Остановка всплытия
    setIsOpen(!isOpen);
  };

  const handleRename = (newTitle: string) => {
    onRename(newTitle);
    setIsRenameModalOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Остановка всплытия
    if (window.confirm(`Вы уверены, что хотите удалить ${getEntityName()}?`)) {
      onDelete();
    }
    setIsOpen(false);
  };

  const getEntityName = () => {
    switch (entityType) {
      case 'project': return 'проект';
      case 'column': return 'колонку';
      case 'task': return 'задачу';
      default: return '';
    }
  };

  return (
    <div 
      className={`dropdown ${className}`} 
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()} // Остановка всплытия для всего компонента
    >
      <button 
        className="dropdown__toggle" 
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        ⋮
      </button>
      
      {isOpen && (
        <div className="dropdown__menu">
          <button
            className="dropdown__item"
            onClick={(e) => {
              e.stopPropagation(); // Остановка всплытия
              setIsRenameModalOpen(true);
              setIsOpen(false);
            }}
          >
            Переименовать
          </button>
          <button
            className="dropdown__item dropdown__item--danger"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      )}

      {isRenameModalOpen && (
        <InputModal
          title={`Переименовать ${getEntityName()}`}
          placeholder={`Новое название ${getEntityName()}`}
          submitText="Сохранить"
          onClose={() => setIsRenameModalOpen(false)}
          onSubmit={handleRename}
        />
      )}
    </div>
  );
};

export default DropdownMenu;
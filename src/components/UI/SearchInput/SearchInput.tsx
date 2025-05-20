// src/components/UI/SearchInput/SearchInput.tsx
import React, { useState, useEffect } from 'react';
import './SearchInput.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Поиск...',
  autoFocus = false,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value);
  
  // Синхронизируем внутреннее состояние с внешним значением
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };
  
  const clearSearch = () => {
    setInputValue('');
    onChange('');
  };
  
  return (
    <div className={`search-input-container ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
        autoFocus={autoFocus}
      />
      {inputValue && (
        <button 
          className="clear-search-button" 
          onClick={clearSearch}
          type="button"
          aria-label="Очистить поиск"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchInput;
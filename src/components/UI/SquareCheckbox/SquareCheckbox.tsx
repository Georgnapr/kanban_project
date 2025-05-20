// src/components/UI/SquareCheckbox/SquareCheckbox.tsx
import { ChangeEvent } from 'react';
import './SquareCheckbox.css';

interface SquareCheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  id?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  stopPropagation?: boolean; // Опция для предотвращения всплытия события
}

const SquareCheckbox = ({
  checked,
  onChange,
  label,
  id,
  name,
  value,
  disabled = false,
  className = '',
  stopPropagation = true
}: SquareCheckboxProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    onChange(e);
  };
  
  return (
    <label
      className={`square-checkbox ${className} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        id={id}
        name={name}
        value={value}
        disabled={disabled}
      />
      <span className="checkmark"></span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export default SquareCheckbox;
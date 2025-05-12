// src/components/UI/RoundCheckbox/RoundCheckbox.tsx
import { ChangeEvent } from 'react';
import './RoundCheckbox.css';

interface RoundCheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  stopPropagation?: boolean; // Опция для предотвращения всплытия события
}

const RoundCheckbox = ({ 
  checked, 
  onChange, 
  label, 
  stopPropagation = true 
}: RoundCheckboxProps) => {
  
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
    <label className="round-checkbox" onClick={handleClick}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={handleChange}
      />
      <span className="checkmark"></span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export default RoundCheckbox;
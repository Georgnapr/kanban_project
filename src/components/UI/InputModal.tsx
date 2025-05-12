import { useState } from 'react';
import Button from './Button/Button';
import './InputModal.css';

interface InputModalProps {
  title: string;
  placeholder: string;
  submitText?: string;
  cancelText?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

const InputModal = ({ 
  title, 
  placeholder, 
  submitText = 'Подтвердить', 
  cancelText = 'Отмена',
  onClose, 
  onSubmit 
}: InputModalProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
          <div className="modal-actions">
            <Button type="button" onClick={onClose}>
              {cancelText}
            </Button>
            <Button type="submit">{submitText}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
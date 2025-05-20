// src/utils/priorityCalculator.ts
import { ITask, PriorityLevel } from '../types/entities';

// Перечисления для уровней важности и сложности
export enum ImportanceLevel {
  "Очень низкая" = 1,
  "Низкая" = 2,
  "Средняя" = 3,
  "Высокая" = 4,
  "Наивысшая" = 5
}

export enum ComplexityLevel {
  "Очень низкая" = 1,
  "Низкая" = 2,
  "Средняя" = 3,
  "Высокая" = 4,
  "Наивысшая" = 5
}

/**
 * Вычисление уровня приоритета на основе числового значения
 * 
 * @param value Числовое значение 0-100
 * @return PriorityLevel Уровень приоритета
 */
export const calculatePriorityLevel = (value: number): PriorityLevel => {
  if (value >= 80) return PriorityLevel.Critical;
  if (value >= 60) return PriorityLevel.High;
  if (value >= 40) return PriorityLevel.Medium;
  if (value >= 20) return PriorityLevel.Low;
  return PriorityLevel.NotSet;
};

/**
 * Расчет числового значения приоритета задачи
 * 
 * @param task Задача для расчета приоритета
 * @return number Приоритет от 0 до 100
 */
export const calculateTaskPriorityValue = (task: ITask): number => {
  // Если задача завершена, приоритет всегда 0
  if (task.completed) return 0;
  
  // Фактор дедлайна (0-10)
  const deadlineFactor = calculateDeadlineFactor(task);
  
  // Фактор важности (1-5 * 2 = 2-10)
  const importanceFactor = (task.importance || 3) * 2;
  
  // Фактор сложности (1-5)
  const complexityFactor = task.complexity || 3;
  
  // Весовые коэффициенты
  const deadlineWeight = 0.5;
  const importanceWeight = 0.4;
  const complexityWeight = 0.1;
  
  // Итоговый приоритет (0-100)
  return Math.round(
    (deadlineFactor * deadlineWeight + 
     importanceFactor * importanceWeight + 
     complexityFactor * complexityWeight) * 10
  );
};

/**
 * Расчет фактора дедлайна для приоритизации
 * 
 * @param task Задача с дедлайном
 * @return number Фактор дедлайна от 0 до 10
 */
export const calculateDeadlineFactor = (task: ITask): number => {
  // Если нет дедлайна
  if (!task.dueDate) return 0;
  
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  
  // Количество дней до дедлайна
  const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Преобразуем в шкалу 0-10
  if (daysLeft < 0) return 10; // Просрочено
  if (daysLeft === 0) return 9; // Сегодня
  if (daysLeft <= 1) return 8; // Завтра
  if (daysLeft <= 2) return 7; // 2 дня
  if (daysLeft <= 3) return 6; // 3 дня
  if (daysLeft <= 5) return 5; // До 5 дней
  if (daysLeft <= 7) return 4; // До недели
  if (daysLeft <= 14) return 3; // До 2 недель
  if (daysLeft <= 30) return 2; // До месяца
  return 1; // Больше месяца
};

/**
 * Функция для получения уровня приоритета задачи (с учетом режима)
 * 
 * @param task Задача
 * @return PriorityLevel Уровень приоритета
 */
export const getTaskPriority = (task: ITask): PriorityLevel => {
  // Если задача завершена, приоритет всегда NotSet
  if (task.completed) return PriorityLevel.NotSet;
  
  // Если ручной режим, возвращаем priorityLevel как есть
  if (!task.useAutoPriority) {
    return task.priorityLevel || PriorityLevel.NotSet;
  }
  
  // Иначе рассчитываем на основе факторов
  const priorityValue = calculateTaskPriorityValue(task);
  return calculatePriorityLevel(priorityValue);
};

/**
 * Получение числового значения приоритета для отображения
 * 
 * @param task Задача
 * @return number Числовое значение приоритета (0-100)
 */
export const getPriorityValue = (task: ITask): number => {
  if (task.completed) return 0;
  
  if (!task.useAutoPriority) {
    // Преобразуем уровень приоритета в числовое значение
    switch (task.priorityLevel) {
      case PriorityLevel.Critical: return 90;
      case PriorityLevel.High: return 70;
      case PriorityLevel.Medium: return 50;
      case PriorityLevel.Low: return 30;
      default: return 0;
    }
  }
  
  return calculateTaskPriorityValue(task);
};

/**
 * Получение цвета для индикации приоритета
 * 
 * @param priorityLevel Уровень приоритета
 * @return string Шестнадцатеричный код цвета (#RRGGBB)
 */
export const getPriorityColor = (priorityLevel: PriorityLevel): string => {
  switch (priorityLevel) {
    case PriorityLevel.Critical:
      return '#e74c3c'; // Критический - красный
    case PriorityLevel.High:
      return '#f39c12'; // Высокий - оранжевый
    case PriorityLevel.Medium:
      return '#3498db'; // Средний - синий
    case PriorityLevel.Low:
      return '#2ecc71'; // Низкий - зеленый
    case PriorityLevel.NotSet:
    default:
      return '#95a5a6'; // Не задан - серый
  }
};

/**
 * Получение текстового описания приоритета
 * 
 * @param priorityLevel Уровень приоритета
 * @return string Текстовое описание
 */
export const getPriorityLabel = (priorityLevel: PriorityLevel): string => {
  switch (priorityLevel) {
    case PriorityLevel.Critical:
      return 'Критический';
    case PriorityLevel.High:
      return 'Высокий';
    case PriorityLevel.Medium:
      return 'Средний';
    case PriorityLevel.Low:
      return 'Низкий';
    case PriorityLevel.NotSet:
    default:
      return 'Не задан';
  }
};

/**
 * Получение всех уровней приоритета для отображения в UI
 * 
 * @return Array Массив уровней приоритета
 */
export const getAllPriorityLevels = (): PriorityLevel[] => [
  PriorityLevel.NotSet,
  PriorityLevel.Low,
  PriorityLevel.Medium,
  PriorityLevel.High,
  PriorityLevel.Critical
];

/**
 * Получение информации о приоритете для отображения
 * 
 * @param task Задача
 * @return Object Объект с информацией о приоритете
 */
export const getPriorityInfo = (task: ITask) => {
  const priorityLevel = getTaskPriority(task);
  const priorityValue = getPriorityValue(task);
  const color = getPriorityColor(priorityLevel);
  const label = getPriorityLabel(priorityLevel);
  
  return {
    level: priorityLevel,
    value: priorityValue,
    color,
    label,
    tooltipText: `Приоритет: ${label} ${task.useAutoPriority ? `(${priorityValue})` : ''}`,
    shouldShow: !task.completed
  };
};

export default {
  getTaskPriority,
  calculateTaskPriorityValue,
  getPriorityColor,
  getPriorityLabel,
  getAllPriorityLevels,
  getPriorityInfo
};
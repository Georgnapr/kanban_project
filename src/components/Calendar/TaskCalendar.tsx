// src/components/Calendar/TaskCalendar.tsx
import { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { useSidebar } from '../../context/SidebarContext';
import { useAppSelector } from '../../app/hooks';
import { selectTasksWithDueDate, selectAllProjects } from '../../app/features/board/boardSelectors';
import { ITask } from '../../types/entities';
import TaskDetails from '../Board/TaskDetails';
import ProjectFilterDropdown from './ProjectFilterDropdown';
import './TaskCalendar.css';

// Интерфейс для событий календаря
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  classNames?: string[];
  extendedProps?: {
    taskId: string;
    projectId: string;
    columnId: string;
    completed: boolean;
  };
}

const TaskCalendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const { expanded } = useSidebar();
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasDeselectAll, setHasDeselectAll] = useState(false);
  
  // Получаем проекты и задачи из Redux
  const projects = useAppSelector(selectAllProjects);
  const tasksWithDueDate = useAppSelector(selectTasksWithDueDate);
  
  // Эффект для обновления размера календаря при изменении состояния сайдбара
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.updateSize();
      }
    });
    
    return () => clearTimeout(timeoutId);
  }, [expanded]);

  // Более простой подход для инициализации: автоматически выбираем все,
  // только если массив не был явно очищен и projects загрузились
  useEffect(() => {
    if (projects.length > 0 && selectedProjectIds.length === 0 && !hasDeselectAll) {
      setSelectedProjectIds(projects.map(project => project.id));
    }
  }, [projects, selectedProjectIds.length, hasDeselectAll]);

  // Преобразование задач в формат событий календаря
  const events: CalendarEvent[] = tasksWithDueDate
    // Фильтруем по выбранным проектам, если есть фильтр
    .filter(task => selectedProjectIds.length === 0 || selectedProjectIds.includes(task.projectId))
    .map(task => {
      // Определяем цвет в зависимости от статуса задачи
      let backgroundColor;
      let borderColor;
      let textColor = '#FFFFFF';
      let classNames = [];
      
      if (task.completed) {
        // Выполненная задача
        backgroundColor = '#22C941';
        borderColor = '#27ae60';
        classNames.push('task-completed');
      } else if (task.dueDate && new Date(task.dueDate) < new Date()) {
        // Просроченная задача
        backgroundColor = '#e74c3c';
        borderColor = '#c0392b';
        classNames.push('task-overdue');
      } else {
        // Обычная активная задача
        backgroundColor = '#5795ED';
        borderColor = '#3498db';
        classNames.push('task-active');
      }
      
      return {
        id: task.id,
        title: task.title,
        start: task.dueDate!,
        backgroundColor,
        borderColor, 
        textColor,
        classNames,
        extendedProps: {
          taskId: task.id,
          projectId: task.projectId,
          columnId: task.columnId,
          completed: task.completed || false
        }
      };
    });

  // Обработчик клика по событию
  const handleEventClick = (clickInfo: any) => {
    const taskId = clickInfo.event.id;
    const task = tasksWithDueDate.find(task => task.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  // Проверка, все ли проекты выбраны
  const allProjectsSelected = projects.length > 0 && projects.length === selectedProjectIds.length;
  
  // Проверка, фильтр активен (не все проекты выбраны)
  const isFilterActive = !allProjectsSelected && projects.length > 0;

  // Обработчик изменения выбранных проектов
  const handleProjectFilterChange = (newIdsOrFn: string[] | ((prevIds: string[]) => string[]) | 'DESELECT_ALL') => {
    if (newIdsOrFn === 'DESELECT_ALL') {
      // Если передана команда "Снять выбор со всех"
      setSelectedProjectIds([]);
      setHasDeselectAll(true);
    } else if (Array.isArray(newIdsOrFn)) {
      // Если передан массив
      setSelectedProjectIds(newIdsOrFn);
      // Если массив пустой, помечаем, что был Deselect All
      if (newIdsOrFn.length === 0) {
        setHasDeselectAll(true);
      }
    } else if (typeof newIdsOrFn === 'function') {
      // Если передана функция преобразования
      setSelectedProjectIds(prevIds => {
        const newIds = newIdsOrFn(prevIds);
        // Если результат пустой, помечаем, что был Deselect All
        if (newIds.length === 0) {
          setHasDeselectAll(true);
        }
        return newIds;
      });
    }
  };

  return (
    <div className="task-calendar-container">
      {/* Верхняя панель с кнопкой фильтра */}
      <div className="calendar-toolbar">
        <button 
          className={`filter-button ${isFilterActive ? 'filter-active' : ''}`}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          Фильтр проектов
          {isFilterActive && <span className="filter-badge"></span>}
        </button>
        
        {/* Выпадающий фильтр проектов */}
        <ProjectFilterDropdown
          projects={projects}
          selectedProjectIds={selectedProjectIds}
          onChange={handleProjectFilterChange}
          onClose={() => setIsFilterOpen(false)}
          isOpen={isFilterOpen}
        />
      </div>
      
      {/* Календарь */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        locale={ruLocale}
        firstDay={1} // Понедельник как первый день недели
        height="auto" // Автоматическая высота
        buttonText={{
          today: 'Сегодня',
          month: 'Месяц',
          week: 'Неделя',
          day: 'День'
        }}
        events={events} // Добавляем события из Redux
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        eventClick={handleEventClick}
      />
      
      {/* Модальное окно с деталями задачи */}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          projectId={selectedTask.projectId}
          columnId={selectedTask.columnId}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default TaskCalendar;
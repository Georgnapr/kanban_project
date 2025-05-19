// src/pages/calendar/CalendarPage.tsx
import React from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/UI/Sidebar/Sidebar';
import TaskCalendar from '../../components/Calendar/TaskCalendar';
import './CalendarPage.css';

const CalendarPage = () => {
  const { expanded } = useSidebar();

  return (
    <>
      <div className='action-bar'>
        <h2 className='action-bar-title'>Календарь задач</h2>
      </div>
      <div className={`calendar-page ${expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Sidebar />
        <TaskCalendar />
      </div>
    </>
  );
};

export default CalendarPage;
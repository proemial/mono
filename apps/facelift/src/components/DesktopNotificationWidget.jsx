import React from 'react';
import { useState } from 'react';
import notification from '../assets/notification.svg'
import Notification from './Notification';
import chevron from '../assets/chevron-right.svg'



const DesktopNotificationWidget = () => {
  const [collapsed, setCollapsed] = useState(false);

const handleToggleCollapse = () =>{
  setCollapsed(!collapsed);
}
  return (
    <aside className={`desktop-notification-container ${collapsed ? 'collapse-right' : 'open'}`}>
      <button onClick={handleToggleCollapse} className={`collapse-button notification-button ${collapsed ? 'rotate' : ''}`}><img className='icon-white' src={chevron}></img></button>
      <div className='notification-header'>
        <img alt="notification icon" className='icon-white' src={notification}></img>
        <h3>Notifications</h3>
      </div>
      <div className='notification-wrapper'>
      <Notification></Notification>
      <Notification></Notification>
      <Notification></Notification>
      <Notification></Notification>
      <Notification></Notification>
      </div>

    </aside>
  );
};

export default DesktopNotificationWidget;
import React from 'react';
import { useState } from 'react';
import logo from '../assets/logo.svg'
import flag from '../assets/flag.svg'
import chevron from '../assets/chevron-left.svg'

const DesktopSidebar = () => {

  const [collapsed, setCollapsed] = useState(false);

  const handleToggleCollapse = () =>{
    setCollapsed(!collapsed);
  }

  return (
    <aside className={`desktop-sidebar-container ${collapsed ? 'collapse-left' : 'open'}`}>
      <button onClick={handleToggleCollapse} className={`collapse-button ${collapsed ? 'rotate' : ''}`}><img className='icon-white' src={chevron}></img></button>
      <img src={logo}></img>

      <div className='sidebar-nav-container'>
      <div className='sidebar-nav-group'>
      <h3>Your activity</h3>
      <ul>
        <li className='sidebar-nav-active'>Feed</li>
        <li>Bookmarks</li>
        <li>Asked questions</li>
        <li>Saved institutions</li>
        <li>Saved authors</li>
      </ul>
      </div>
      <div className='sidebar-nav-group'>
        <h3>Teams</h3>
        <div className='upgrade-callout'>
          <img className='icon-white' src={flag}></img>
          <p>Upgrade to pro to create a team</p>
        </div>
        </div>
      <div className='sidebar-nav-group'>
      <h3>Geet Khosla</h3>
      <ul>
        <li>Profile</li>
        <li>Inbox(0)</li>
        <li>Settings</li>
      </ul>
      </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
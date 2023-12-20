import React from 'react';
import profile from '../assets/user.svg'
import home from '../assets/home.svg'
import message from '../assets/message.svg'
import bookmark from '../assets/bookmark.svg'


const BottomNav = () => {
  return (
    <nav className='bottom-nav-container'>
      <div className='gradient-overlay-nav'></div>
      <ul className='bottom-nav'>
        <li><img className='icon-white' src={home}></img></li>
        <li><img className='icon-white' src={message}></img></li>
        <li><img className='icon-white' src={bookmark}></img></li>
        <li><img className='icon-white' src={profile}></img></li>
      </ul>
    </nav>
  );
};

export default BottomNav;
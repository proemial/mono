import React from 'react';
import logo from '../assets/logo2.svg'
import search from '../assets/search.svg'
import notification from '../assets/notification.svg'

const TopHeader = () => {
  return (
    <div className='top-header'>
      <img alt="logo" src={logo}></img>
      <div className="icon-container">
        <img className='icon-white' src={search}></img>
        <img className='icon-white' src={notification}></img>
      </div>
    </div>
  );
};

export default TopHeader;
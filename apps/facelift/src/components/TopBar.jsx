import React from 'react';
import back from '../assets/back.svg'
import bookmark from '../assets/bookmark.svg'
import share from '../assets/share.svg'

const TopBar = () => {
  return (
    <div className='top-bar-container'>
      <div className='back-container'>
        <img alt="back icon" className='icon-white' src={back}></img>
        <span>Back</span>
      </div>
      <div className='icon-container'>
        <img alt="bookmark icon" className='icon-white' src={share}></img>
        <img alt="bookmark icon" className='icon-white' src={bookmark}></img>
      </div>
    </div>
  );
};

export default TopBar;
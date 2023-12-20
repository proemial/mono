import React from 'react';
import search from '../assets/search.svg'

const DesktopSearch = () => {
  return (
    <div className='desktop-search-container'>
      <div className='search-icon-container'>
      <img className='icon-white' src={search}></img>
      </div>
      <input type="text" placeholder="Search for papers, institutes or authors"></input>
    </div>
  );
};

export default DesktopSearch;
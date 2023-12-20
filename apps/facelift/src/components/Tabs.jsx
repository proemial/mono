import React from 'react';

const Tabs = () => {
  return (
    <div className="tabs-wrapper">
    <div className='tabs-container'>
      <ul>
        <li id='tab-active'>All</li>
        <li>Machine Learning</li>
        <li>Data Science</li>
        <li>Computer Science</li>
        <li>Quantum Computing</li>
        <li>AI</li>
      </ul>
    </div>
    <div className="gradient-overlay"></div>
    </div>
  );
};

export default Tabs;
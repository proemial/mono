import React from 'react';
import avatar from '../assets/test-avatar.png'

const Notification = () => {
  return (
    <div className='notification-container'>
      <img src={avatar}></img>
      <div>
        <p>Floyd Creev asked a question on a paper you follow</p>
      </div>
    </div>
  );
};

export default Notification;
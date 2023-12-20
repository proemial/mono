import React from 'react';
import avatar from '../assets/test-avatar.png'
import proemBot from '../assets/proem-bot.svg'

const Chat = () => {
  return (
    <div className='chat-container'>
      <div className='chat-reply chat-question'>
        <p>What is the goal of the P2C framework?</p>
        <div className='chat-sender you'><span>you</span><img src={avatar}></img></div>
      </div>
      <div className='chat-reply chat-answer'>
        <p>The genetic algorithm, specifically the GASP (Genetic Algorithm for State Preparation) framework, can help optimize the encoding circuits used in quantum support vector machines (QSVMs) by autonomously selecting the best gate sequences, addressing issues of manual design time and performance, and ultimately enhancing QSVM-based machine learning performance across various applications.</p>
        <div className='chat-sender'><img src={proemBot}></img><span>proem standard bot</span></div>
      </div>
    </div>
  );
};

export default Chat;
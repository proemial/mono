import React from 'react';
import avatar from '../assets/test-avatar.png'
import plus from '../assets/add.svg'

const ArticleAuthors = () => {
  return (
    <div className='article-authors-container'>
      <ul>
        <li className='author'><img className='author-avatar' src={avatar}></img> Shaowen Li <button className='follow-button'>Follow <img className='icon-white' src={plus}></img></button></li>
        <li className='author'><img className='author-avatar' src={avatar}></img> Yusuke Kimura <button className='follow-button'>Follow<img className='icon-white' src={plus}></img></button></li>
        <li className='author verified'><img className='author-avatar' src={avatar}></img> Hiroyuki Sato <button className='follow-button'>Follow<img className='icon-white' src={plus}></img></button></li>
        <li className='author verified'><img className='author-avatar' src={avatar}></img> Junwei Yu <button className='follow-button'>Follow<img className='icon-white' src={plus}></img></button></li>
        <li className='author'><img className='author-avatar' src={avatar}></img> Masahiro Fujita <button className='follow-button'>Follow<img className='icon-white' src={plus}></img></button></li>
      </ul>
    </div>
  );
};

export default ArticleAuthors;
import React from 'react';

const ArticleMetadata = () => {
  return (
    <div className='article-metadata-container'>
      <h2>Article Metadata</h2>
      <p className='article-metadata-journal'>Preprint published on ArXiv, Dec 04, 2023</p>
      <p>Title: Parallelizing quantum simulation with decision diagrams</p>
      <button className='primary-button'>Read the full paper</button>
    </div>
  );
};

export default ArticleMetadata;
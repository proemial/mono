import React from 'react';
import TopHeader from './TopHeader';
import Tabs from './Tabs';
import CardContainer from './CardContainer';
import DesktopSearch from './DesktopSearch';
import BottomNav from './BottomNav';

const FeedView = () => {
  return (
    <div className='feed-view'>
      <TopHeader></TopHeader>
      <div className='container'>
        <DesktopSearch></DesktopSearch>
        <BottomNav></BottomNav>
        <Tabs></Tabs>
        <CardContainer></CardContainer>
      </div>
    </div>
  );
};

export default FeedView;
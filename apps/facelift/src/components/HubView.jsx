import React from 'react';
import MetaData from './SummaryMetadata';
import Tag from './Tag';
import HubSummary from './HubSummary';
import GeneratedQuestion from './GeneratedQuestion';
import QuestionInput from './QuestionsInput';
import Tabs from './Tabs';
import TopBar from './TopBar';
import ArticleMetadata from './ArticleMetadata';
import ArticleAuthors from './ArticleAuthors';
import Chat from './Chat';
const HubView = () => {
  return (
    <div>
      <div className='container'>
      <TopBar></TopBar>
      
      <section className='top-container'>
      <div className="tag-container">
        <Tag text="data-science"></Tag>
        <Tag text="ai"></Tag>
        <Tag text="3d-models"></Tag>
      </div>
      <MetaData journal="arxiv" date="27.11.2023"></MetaData>
      <HubSummary></HubSummary>
      <div className='questions-container'>
        <Chat></Chat>
          {/* <GeneratedQuestion question="What is the goal of the P2C framework?"></GeneratedQuestion>
          <GeneratedQuestion question="How does the P2C framework complete point cloud objects using only a single incomplete point cloud per object?"></GeneratedQuestion> */}
          <QuestionInput></QuestionInput>
        </div>
        </section>
        <Tabs></Tabs>
        <section className='bottom-container'>
          {/* <ArticleAuthors></ArticleAuthors> */}
        <ArticleMetadata></ArticleMetadata>
        </section>
    </div>
    </div>
  );
};

export default HubView;
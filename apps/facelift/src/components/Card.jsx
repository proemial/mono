import Tag from './Tag'
import MetaData from './SummaryMetadata'
import PaperSummary from './CardSummary'
import GeneratedQuestion from './GeneratedQuestion'
import QuestionInput from './QuestionsInput'
import Reactions from './Reactions'
import options from '../assets/options.svg'

function Card() {
 
  return (
    <>
      <div className='card'>
        <div className='tag-metadata-container'>
          <div>
            <div className='tag-container'> 
              <Tag text="data-science"></Tag>
              <Tag text="ai"></Tag>
              <Tag text="3d-models"></Tag>
            </div>
            <MetaData journal="arxiv" date="27.06.2023"></MetaData>
          </div>
          <img className='icon-white' src={options}></img>
        </div>
        <PaperSummary summary="New self-supervised framework completes 3D shapes from partial observations using single incomplete point clouds"></PaperSummary>
        <div className='questions-container'>
          <GeneratedQuestion question="What is the goal of the P2C framework?"></GeneratedQuestion>
          <GeneratedQuestion question="How does the P2C framework complete point cloud objects using only a single incomplete point cloud per object?"></GeneratedQuestion>
          <QuestionInput></QuestionInput>
        </div>
        <Reactions comments="6" bookmarks="48"></Reactions>
      </div>
      
    </>
  )
}

export default Card

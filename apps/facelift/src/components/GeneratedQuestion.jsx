import sendIcon from '../assets/send.svg'

function GeneratedQuestion(props) {

  return (
    <div className="generated-question">
    <p>{props.question}</p>
    <img className='icon-grey' alt="send icon" src={sendIcon}></img>
  </div>
  )
}

export default GeneratedQuestion

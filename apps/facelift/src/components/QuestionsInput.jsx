import send from '../assets/send.svg'

function QuestionInput() {
  return (
      <div className="question-input">
        <input type="text" placeholder="Ask your own question"></input>
        <img alt="send icon" className="icon-grey send-icon" src={send}></img>
      </div>
  )
}

export default QuestionInput

import commentIcon from '../assets/message.svg'
import bookmarkIcon from '../assets/bookmark.svg'

function Reactions(props) {
  let text = props.text;
  return (
    <div className="reactions-container">
      <div className="reactions">
      <img className='icon-white' alt="message icon" src={commentIcon}></img>
        <span>{props.comments}</span>
      </div>
      <div className="reactions">
      <img className='icon-white' alt="message icon" src={bookmarkIcon}></img>
      <span>{props.bookmarks}</span>
      </div>
  </div>
  )
}

export default Reactions

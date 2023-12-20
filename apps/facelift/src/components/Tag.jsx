// import './App.css'

function Tag(props) {
  let text = props.text;
  return (
    <>
      <span className="tag">#{props.text}</span>
    </>
  )
}

export default Tag

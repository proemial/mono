function MetaData(props) {
  return (
    <div className="card-metadata">
      <span className="card-metadata-journal">Published on {props.journal}</span>
      <span className="card-metadata-date">- {props.date}</span>
    </div>
  )
}

export default MetaData

export default function Spinner ( { text = "Cargando..." } ) {
  return (
    <div className="spinner-border text-success h4 m-auto d-block" role="status">
      <span className="visually-hidden">{text} </span>
    </div>
  )
}

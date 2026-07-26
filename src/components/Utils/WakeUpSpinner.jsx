export default function WakeUpSpinner({ message = 'Cargando...' }) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-center px-3"
    >
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="text-muted mb-0">{message}</p>
    </div>
  );
}
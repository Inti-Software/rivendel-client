  const DeleteDialog = ({ deleteMessage, handleDelete, handleCancel }) => (
    <div className={`modal show modal-backdrop-50 dialog-centered`} 
         style={{display: 'flex'}}
         tabIndex="-1"
         >
      <div className="modal-dialog center-vertical">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar eliminación</h5>
            {/* <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button> */}
          </div>
          <div className="modal-body">
            <p>{deleteMessage}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

	export default DeleteDialog;
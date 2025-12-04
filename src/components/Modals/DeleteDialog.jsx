  const DeleteDialog = ({ deleteMessage, handleDelete, handleCancel }) => (
    <div className={`modal show modal-backdrop-50 dialog-centered`} 
         style={{display: 'flex'}}
         tabIndex="-1"
         >
      <div className="modal-dialog center-vertical">
        <div className="modal-content">
          <div className="modal-body">
            <h6 className="modal-title mb-1">Confirmar eliminación</h6>
            <p>{deleteMessage}</p>
            <div className="buttons">
              <button type="button" className="btn btn-sm btn-danger" onClick={handleDelete}>
                Eliminar
              </button>
              <button type="button" className="btn btn-sm btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

	export default DeleteDialog;
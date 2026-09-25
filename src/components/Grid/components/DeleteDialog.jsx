  const DeleteDialog = ({ deleteMessage, handleDelete, handleCancel }) => (
    <div className={`modal show modal-backdrop-50 dialog-centered`} 
         style={{display: 'flex'}}
         tabIndex="-1"
         >
      <div className="modal-dialog center-vertical">
        <div className="modal-content">
          <div className="modal-header h5 py-2">
            Confirmar eliminación
          </div>
          <div className="modal-body py-0">
            {deleteMessage}
          </div>
          <div className="modal-footer py-2">
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
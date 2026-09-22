import { handleChkComparecenciaChange, handleNroWhatsappChange } from '../eventHandlers.utils'

const NroWhatsappInput = ({ parte, esPatrocinante, esReclamante, visible, onChange }) => {
	if (!visible) return null;

	const nroWhatsapp = esPatrocinante ? parte.nroWhatsappPatrocinante : parte.nroWhatsappParte;
  const inputVisible = nroWhatsapp !== null && nroWhatsapp !== undefined;
	const payload = { idParte: parte.id, esPatrocinante, esReclamante, onChange };

	return (
		<div className={(esPatrocinante ? "col-6" : "col-5") + " d-flex align-items-center gap-2 mb-1"}>
			<label className="me-2">
					<input 	type="checkbox" 
									defaultChecked={inputVisible}
									onChange={(e) => handleChkComparecenciaChange(e, payload)} 
					/> &nbsp;{esPatrocinante ? "Patrocinio " : "Comparecencia "} Online
			</label>
			{inputVisible &&
			(<input	type="number" 
							className="form-control-inline form-control-sm border-0" 
							style={{ backgroundColor: "#fff", borderBottom: "1px solid #ced4da" }}
							placeholder="38541234567"
							value={nroWhatsapp}
							onChange={(e) => handleNroWhatsappChange(e, payload)}
				/>)}
		</div>
	)
}

export default NroWhatsappInput;
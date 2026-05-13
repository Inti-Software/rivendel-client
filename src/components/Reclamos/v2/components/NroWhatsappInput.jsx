const NroWhatsappInput = ({ parte, esPatrocinante, esReclamante, onChange }) => {
	const nroWhatsapp = esPatrocinante ? parte.nroWhatsappPatrocinante : parte.nroWhatsappParte;
  const estaActivo = nroWhatsapp !== null && nroWhatsapp !== undefined;

	function handleCheckboxChange(e) {
		const checked = e.target.checked;
		const nuevoValor = checked ? "" : null;
		onChange(nuevoValor, parte.id, esPatrocinante, esReclamante);
	}

  const handleInputChange = (e) => {
    onChange(e.target.value, parte.id, esPatrocinante, esReclamante);
  };

	return (
		<div className={(esPatrocinante ? "col-6" : "col-5") + " d-flex align-items-center gap-2 mb-1"}>
			<label className="me-2">
					<input 	type="checkbox" 
									defaultChecked={estaActivo}
									onChange={handleCheckboxChange} 
					/> &nbsp;{esPatrocinante ? "Patrocinio " : "Comparecencia "} Online
			</label>
			{estaActivo &&
			(<input	type="number" 
							className="form-control-inline form-control-sm border-0" 
							style={{ backgroundColor: "#fff", borderBottom: "1px solid #ced4da" }}
							placeholder="38541234567"
							value={nroWhatsapp}
							onChange={handleInputChange}
							autoFocus
				/>)}
		</div>
	)
}

export default NroWhatsappInput;
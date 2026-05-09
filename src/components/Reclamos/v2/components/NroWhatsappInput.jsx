const habilitarWhatsapp = (e) => {
	const input = e.target.parentNode.nextSibling;
	if (e.target.checked) {
		input.disabled = "";
		input.style.backgroundColor = "#fff";
		input.focus();
		input.hidden = false;
		input.display = "inline";
	} else {
		input.hidden = "hidden";
		input.display = "none";
		input.disabled = "disabled";
		input.style.backgroundColor = "#aaa";
		input.value = "";
	}
}

const NroWhatsappInput = ({ parte, esPatrocinante, esReclamante, onChange }) => {
	const nroWhatsapp = esPatrocinante ? parte.nroWhatsappPatrocinante : parte.nroWhatsappParte;
	const hasValue = nroWhatsapp && nroWhatsapp.trim() !== "";
	const disabled = hasValue? "" : "disabled";
	const style = hasValue? { backgroundColor: "#fff" } : { backgroundColor: "#aaa" };
	return (
		<div className={(esPatrocinante ? "col-6" : "col-5") + " d-flex align-items-center gap-2 mb-1"}>
			<label className="me-2">
					<input 	type="checkbox" 
									defaultChecked={hasValue}
									onChange={(e) => habilitarWhatsapp(e)} 
					/> &nbsp;{esPatrocinante ? "Patrocinio " : "Comparecencia "} Online
			</label>
			<input 	type="number" 
							className="form-control-inline form-control-sm border-0" 
							disabled={disabled}
							placeholder={"Whatsapp " + (esPatrocinante ? "Patrocinante" : "Parte") }
							style={style}
							display={hasValue? "inline" : "none"}
							hidden={!hasValue}
							value={nroWhatsapp || undefined}
							onChange={e => onChange(e, parte.id, esPatrocinante, esReclamante)} />
		</div>
	)
}

export default NroWhatsappInput;
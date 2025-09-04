const ErrorMessage = ({message}) => {
return (
	<div className="row" style={{ minHeight: "30px" }}>
			<div id="mensaje" className="d-flex justify-content-between align-items-center">
				<span className={`badge m-auto p-2 fw-normal text-bg-danger`}>
					{message}
				</span>
	</div>
	</div>
	);
};

export default ErrorMessage;
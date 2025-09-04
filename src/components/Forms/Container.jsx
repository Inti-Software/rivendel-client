import { Link } from "react-router-dom";

const Container = ({children, title, newPath}) => {
return (
	<div className="container mt-4">
		<div>
			<div className="col-8 d-inline-block">
					<h1>{title}</h1>
			</div>
			<div className="col-4 d-inline-flex justify-content-end">
				<Link to={newPath} className="btn btn-outline-primary mb-2">
					Nuevo
				</Link>
			</div>
		</div>
		{children}
	</div>
);
}

export default Container;
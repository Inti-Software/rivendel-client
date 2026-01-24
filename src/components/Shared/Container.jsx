import { Link } from "react-router-dom";
import { FILEEARMARKPLUS } from "../../utils/Icons";

const Container = ({children, title, pathToNew}) => {
return (
	<div className="container mt-4">
		<div>
			<div className="col-8 d-inline-block">
					<h1>{title}</h1>
			</div>
			<div className="col-4 d-inline-flex justify-content-end">
				<Link to={pathToNew} className="btn btn-outline-primary mb-2" title="Nuevo">
					{FILEEARMARKPLUS}
				</Link>
			</div>
		</div>
		{children}
	</div>
);
}

export default Container;

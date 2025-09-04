import { Link } from "react-router-dom";

const GridEditButton = ({path}) => {
	return (
		<Link to={path}
				className="btn btn-outline-secondary btn-sm ms-2">
			Editar
		</Link>
	);
}

const GridDeleteButton = ({onDelete}) => {
	return (
		<a href={"/#"} onClick={onDelete}
			className="btn btn-outline-danger btn-sm ms-2">
			Eliminar
		</a>
	);
}

export { GridEditButton, GridDeleteButton };
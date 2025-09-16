import { Link } from "react-router-dom";

const GridEditButton = ({path, style, className}) => {
	return (
		<Link to={path}
				className={"btn btn-outline-secondary btn-sm ms-2" + (className ? ` ${className}` : "")}
				style={style || {}}
		>
			Editar
		</Link>
	);
}

const GridDeleteButton = ({onDelete, style, className}) => {
	return (
		<a href={"/#"} onClick={onDelete}
			className={"btn btn-outline-danger ms-2" + (className ? ` ${className}` : "")}
			style={style || {}}
			>
			Eliminar
		</a>
	);
}

export { GridEditButton, GridDeleteButton };
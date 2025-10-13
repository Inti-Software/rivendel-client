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
			className={"btn btn-outline-danger btn-sm ms-2" + (className ? ` ${className}` : "")}
			style={style || {}}
			>
			Eliminar
		</a>
	);
}

const GridPrintButton = ({path, style, className, onClick}) => {
	return (
		<Link to={path || "#"}
				className={"btn btn-outline-primary btn-sm ms-2" + (className ? ` ${className}` : "")}
				style={style || {}}
				onClick={onClick}
				target="__blank"
		>
			Imprimir
		</Link>
	);
}

export { GridEditButton, GridDeleteButton, GridPrintButton };
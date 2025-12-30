import { Link } from "react-router-dom";
import { DELETE, EDIT, PRINT } from "../../utils/Icons";

const GridEditButton = ({path, style, className}) => {
	return (
		<Link to={path}
				className={"btn btn-outline-secondary btn-sm ms-2" + (className ? ` ${className}` : "")}
				style={style || {}}
		>
			{EDIT}
		</Link>
	);
}

const GridDeleteButton = ({path, style, className, onDelete}) => {
	return (
		<a href={path || "/#"} onClick={onDelete}
			className={"btn btn-outline-danger btn-sm ms-2" + (className ? ` ${className}` : "")}
			style={style || {}}
			>
			{DELETE}
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
			{PRINT}
		</Link>
	);
}

export { GridEditButton, GridDeleteButton, GridPrintButton };
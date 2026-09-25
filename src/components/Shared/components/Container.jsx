import { Link } from "react-router-dom";
import { FILEEARMARKPLUS } from "./Icons";
import { useMemo } from "react";

const Container = ({children, title = "", pathToNew}) => {
	const headerTitle = useMemo(() => {
		if (title) return title;
		const pageTitle = document.title;
		return pageTitle.includes("|")
			? pageTitle.substring(0, pageTitle.indexOf("|")).trim()
			: pageTitle;
	}, [title])

	return (
		<div className="container mt-4">
			<div>
				<div className="col-8 d-inline-block">
						<h1>{headerTitle}</h1>
				</div>
				<div className="col-4 d-inline-flex justify-content-end">
					<Link to={pathToNew} className="btn btn-outline-primary mb-2 d-inline-flex align-items-center justify-content-center" title="Nuevo">
						{FILEEARMARKPLUS}
					</Link>
				</div>
			</div>
			{children}
		</div>
	);
}

export default Container;

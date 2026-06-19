import { Link } from "react-router-dom";
import { FILEEARMARKPLUS } from "./Icons";
import { useEffect, useState } from "react";

const Container = ({children, title = "", pathToNew}) => {
	const [headerTitle, setHeaderTitle] = useState(title)

	useEffect(() => {
		let filteredTitle = title
		if (!title) {
			const t = document.title
			filteredTitle = t.includes("|")? t.substring(0, t.indexOf("|")).trim() : t;			
		}
		setHeaderTitle(filteredTitle)
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

export default function TemplateResults({ template, data, selectedId, selectRow }) {
	return (
		<table className="w-100 mx-1">
			<tbody>
				{data.map((row) => template(row, row.id === selectedId, selectRow))}
			</tbody>
		</table>
	);	
}
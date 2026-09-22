export default function TabularResults({ columns, data, selectedId, selectRow }) {
	return (
		<table className="table table-striped table-sm mx-1 table-hover" style={{ fontSize: "0.9em" }}>
			<thead>
				<tr>
					{columns.map(col => <th key={col.key} scope="col">{col.label}</th>)}
				</tr>
			</thead>
			<tbody>
				{data.map((row) => {
					const isSelected = row.id === selectedId;
					return (
						<tr key={row.id} onClick={() => selectRow(row.id)} style={{ cursor: "pointer" }}>
							{columns.map(col => (
								<td key={col.key} className={isSelected ? "bg-warning-subtle" : ""}>
									{row[col.key]}
								</td>
							))}
						</tr>
					);
				})}
			</tbody>
		</table>
	);	
}
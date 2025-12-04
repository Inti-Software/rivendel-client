export default function DataBindedSelect({ data, selectedValue, setSelectedValue }) {
	if (data?.length > 0 && (!selectedValue || !data.some(d => d.value === selectedValue))) {
		selectedValue = data[0].value
	}
  return (
    <select key={1} className="form-select" onChange={(e) => setSelectedValue(e.target.value)}
			 value={selectedValue}>
      {data.map((item, i) => (
					<option key={i} value={item.value}>
						{item.text}
					</option>
        )
      )}
    </select>
  );
}

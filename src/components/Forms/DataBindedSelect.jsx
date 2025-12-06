import { useEffect } from "react";

export default function DataBindedSelect({ id, data, selectedValue, setSelectedValue }) {
	useEffect(() => {
		if (data?.length > 0 && (!selectedValue || !data.some(d => d.value === selectedValue))) {
			setSelectedValue(data[0].value);
		}
	}, [data, selectedValue]);

  return (
    <select key={1} id={id} className="form-select"  value={selectedValue}
			onChange={(e) => setSelectedValue(e.target.value)} >
      {data.map((item, i) => (
					<option key={i} value={item.value}>
						{item.text}
					</option>
        )
      )}
    </select>
  );
}

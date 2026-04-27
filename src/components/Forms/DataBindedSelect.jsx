import { useEffect, useId } from "react";

export default function DataBindedSelect({ id, data = [], selectedValue, setSelectedValue }) {
  const internalId = useId();
  const selectId = id ?? internalId;

  useEffect(() => {
    if (!data?.length) return;

    const exists = data.some((item) => item.value === selectedValue);
    
    if (!exists) {
      setSelectedValue(data[0].value);
    }
  }, [data, selectedValue, setSelectedValue]);

  return (
    <select
      id={selectId}
      className="form-select"
      value={selectedValue ?? ""}
      onChange={(e) => setSelectedValue(e.target.value)}
    >
      {data.map((item) => (
        <option key={item.value} value={item.value}>
          {item.text}
        </option>
      ))}
    </select>
  );
}
import ReactDatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);

function parseHora(hhmm) {
  if (!hhmm) return null;
  const [hours, minutes] = hhmm.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export default function HourPicker({ id, name, value, setField }) {
  return (
    <ReactDatePicker
      id={id}
      selected={parseHora(value)}
      onChange={(date) => {
        const formatted = date
          ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
          : "";
        setField(name, formatted);
      }}
      showTimeSelect
      showTimeSelectOnly
      timeFormat="HH:mm"
      timeIntervals={5}
      dateFormat="HH:mm"
      locale="es"
      placeholderText="HH:mm"
      className="form-control text-center d-inline w-25"
			wrapperClassName="d-inline"
    />
  );
}
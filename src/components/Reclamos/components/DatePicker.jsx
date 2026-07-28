import ReactDatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";

export default function DatePicker({ id, name, value, setField }) {
  registerLocale("es", es);

  return (
    <ReactDatePicker
      id={id}
      selected={value ? new Date(value.replace(" ", "T")) : null}
      onChange={(date) => {
        const formatted = date
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
          : "";
        setField(name, formatted);
      }}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={5}
      dateFormat="yyyy-MM-dd HH:mm"
      locale="es"
      placeholderText="aaa-mm-dd hh:mm"
      className="form-control text-center d-inline w-auto"
      wrapperClassName="d-inline"
    />
  );
}

import ReactDatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';

export default function DatePicker({
  id,
  name,
  value,
  setField,
  showTime = true,
  className = 'form-control text-center d-inline w-auto',
}) {
  registerLocale('es', es);

  return (
    <ReactDatePicker
      id={id}
      selected={value ? new Date(value.replace(' ', 'T')) : null}
      onChange={(date) => {
        if (!date) {
          setField(name, '');
          return;
        }

        const datePart = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        if (showTime) {
          const timePart = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
          setField(name, `${datePart} ${timePart}`);
        } else {
          setField(name, datePart);
        }
      }}
      showTimeSelect={showTime}
      timeFormat="HH:mm"
      timeIntervals={5}
      dateFormat={showTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
      locale="es"
      placeholderText={showTime ? 'aaaa-mm-dd hh:mm' : 'aaaa-mm-dd'}
      className={className}
      wrapperClassName="d-inline"
    />
  );
}

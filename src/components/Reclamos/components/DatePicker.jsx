import ReactDatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';

// Parsea "yyyy-MM-dd", "yyyy-MM-dd HH:mm" o "yyyy-MM-ddTHH:mm[:ss][.sss][Z]"
// como fecha/hora LOCAL, para evitar el corrimiento de día que produce
// `new Date(str)` cuando el string no tiene información de zona horaria.
function parseLocalDate(value) {
  if (!value) return null;

  const normalized = String(value).trim().replace('T', ' ').replace('Z', '');
  const [datePart, timePart] = normalized.split(' ');
  if (!datePart) return null;

  const [year, month, day] = datePart.split('-').map(Number);
  const [hours = 0, minutes = 0] = (timePart ? timePart.split(':') : []).map(Number);

  if ([year, month, day].some((n) => Number.isNaN(n))) return null;

  const parsed = new Date(year, month - 1, day, hours || 0, minutes || 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

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
      selected={parseLocalDate(value)}
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
      dateFormat={showTime ? 'dd-MM-yyyy HH:mm' : 'dd-MM-yyyy'}
      locale="es"
      placeholderText={showTime ? 'dd-mm-aaaa hh:mm' : 'dd-mm-aaaa'}
      className={className}
      wrapperClassName="d-inline"
    />
  );
}

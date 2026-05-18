import { isValidResolucion } from '../Resoluciones/tiposResoluciones';
import { isChronological, isValidDateTime, isValidHour } from './dateUtils';

export const validateReclamo = (state) => {
  const errors = [];
  if (state.numero <= 0) errors.push('Ingrese un número de reclamo válido');
  if (!isValidDateTime(state.fechaHoraInicio))
    errors.push('Ingrese una fecha y hora de inicio válidas');
  if (isValidHour(state.horaFin)) errors.push('Ingrese una hora de fin válida');
  if (!isValidResolucion(state.idResolucion)) errors.push('Seleccione una resolución válida');
  if (isValidDateTime(state.proxAudiencia)) errors.push('Ingrese una próxima fecha válida');
  if (!isChronological(state.fechaHoraInicio, state.proxAudiencia))
    errors.push('La próxima fecha no puede ser anterior a la fecha hora de inicio.');
  return errors;
};

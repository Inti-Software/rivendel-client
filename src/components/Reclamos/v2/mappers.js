import { apiDateToInput, apiHourToInput, combineDateAndHour } from './dateUtils';

export function mapApiToForm(data) {
  return {
    id: data.id,
    numero: data.numero,
    rubros: data.rubros,
    idResolucion: getNumber(data.idResolucion),
    fechaHoraInicio: apiDateToInput(data.fechaHoraInicio),
    horaFin: apiHourToInput(data.horaFin),
    proxAudiencia: apiDateToInput(data.proximaAudiencia),
    reclamantes: data.reclamantes || [],
    reclamados: data.reclamados || [],
  };
}

function getNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

function parteToDto(p) {
  return {
    idParte: p.id,
    nroWhatsappParte: p.nroWhatsappParte || null,
    nroWhatsappPatrocinante: p.nroWhatsappPatrocinante || null,
    postergo: p.postergo || false,
    incomparendo: p.incomparendo || false,
    multado: p.multado || false,
  };
}

export function mapFormToApi(state) {
  return {
    id: state.id,
    numero: state.numero,
    rubros: state.rubros,
    idResolucion: state.idResolucion,
    fechaHoraInicio: state.fechaHoraInicio,
    horaFin: combineDateAndHour(state.fechaHoraInicio, state.horaFin),
    proximaAudiencia: state.proxAudiencia || null,
    reclamantes: state.reclamantes.map(parteToDto),
    reclamados: state.reclamados.map(parteToDto),
  };
}

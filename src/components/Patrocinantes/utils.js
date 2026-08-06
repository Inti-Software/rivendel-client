import { NO_ESPECIFICADO } from "../Shared/constants";

export const getDomicilio = (patrocinante) => {
  let s = NO_ESPECIFICADO;
  if (patrocinante?.domicilio?? '' !== '') s = patrocinante?.domicilio;
  if (patrocinante?.localidad?? '' !== '') s += ', ' + patrocinante?.localidad;

  return s;
};

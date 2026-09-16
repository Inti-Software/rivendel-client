export const getPatrocinante = (p) => {
  if (p.nroMatricula > 0 && p.nombre?.trim() !== '') {
    return `${p.nroMatricula} - ${p.nombre}`;
  }

  return '';
};

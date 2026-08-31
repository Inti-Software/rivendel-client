export const getPatrocinante = (p) => {
  if (p.nroMatricula > 0 && p.nombre?.trim() !== '') {
    return `${p.nroMatricula} - ${p.nombre}`;
  }

  return '';
};

export function formatCuil(value = '') {
  const digits = value.replace(/\D/g, '').padEnd(11, ' ');
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
}

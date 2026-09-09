export const isNew = (value) => (Number.isInteger(value) && value === 0);

export function formatCuil(value = '') {
  const digits = value.replace(/\D/g, '').padEnd(11, ' ');
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
}


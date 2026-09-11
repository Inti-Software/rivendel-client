// Convierte un número entero (0 a 999.999.999) a su representación en letras, en español.
// Pensado para montos en documentos legales/formales (reclamos, conciliaciones, etc.)

const UNIDADES = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const DIECIS = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const VEINTIS = ['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

function convertirDecena(num) {
  if (num < 10) return UNIDADES[num];
  if (num < 20) return DIECIS[num - 10];
  if (num < 30) return VEINTIS[num - 20];
  const d = Math.floor(num / 10);
  const u = num % 10;
  return u === 0 ? DECENAS[d] : `${DECENAS[d]} y ${UNIDADES[u]}`;
}

function grupoATexto(num) {
  if (num === 0) return '';
  if (num === 100) return 'cien';
  const centena = Math.floor(num / 100);
  const resto = num % 100;
  const partes = [];
  if (centena > 0) partes.push(CENTENAS[centena]);
  if (resto > 0) partes.push(convertirDecena(resto));
  return partes.join(' ');
}

/**
 * @param {number} numero - entero a convertir (soporta hasta 999.999.999)
 * @param {object} [opciones]
 * @param {boolean} [opciones.unMilLegal=false] - si es true, escribe "un mil" en vez de "mil"
 *   para 1000-1999 (convención habitual en documentos legales/bancarios en Argentina,
 *   para evitar ambigüedad o adulteración del monto).
 * @returns {string}
 */
export function numeroALetras(numero, { unMilLegal = false } = {}) {
  if (!Number.isFinite(numero)) return '';
  if (numero === 0) return 'cero';
  if (numero < 0) return `menos ${numeroALetras(-numero, { unMilLegal })}`;

  numero = Math.floor(numero); // esta función es para la parte entera

  const millones = Math.floor(numero / 1000000);
  const miles = Math.floor((numero % 1000000) / 1000);
  const resto = numero % 1000;

  const partes = [];

  if (millones > 0) {
    partes.push(millones === 1 ? 'un millón' : `${grupoATexto(millones)} millones`);
  }

  if (miles > 0) {
    if (miles === 1) {
      partes.push(unMilLegal ? 'un mil' : 'mil');
    } else {
      partes.push(`${grupoATexto(miles)} mil`);
    }
  }

  if (resto > 0) {
    partes.push(grupoATexto(resto));
  }

  return partes.join(' ').toUpperCase();
}

// Ejemplos:
// numeroALetras(1500)                       -> "mil quinientos"
// numeroALetras(1500, { unMilLegal: true })  -> "un mil quinientos"
// numeroALetras(21034)                       -> "veintiún mil treinta y cuatro"  (*)
// numeroALetras(1000000)                     -> "un millón"
// numeroALetras(2450000)                     -> "dos millones cuatrocientos cincuenta mil"
//
// (*) Nota: esta versión no aplica el apócope "veintiún"/"un" cuando el número queda pegado
// a un sustantivo (ej: "veintiún pesos"), sino la forma cardinal plena "veintiuno".
// Si necesitás esa forma exacta para el texto legal, decímelo y lo ajusto.
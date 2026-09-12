import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import DOMPurify from 'dompurify';
import defaultTemplate from '../../assets/clausulas-template.html?raw';
import { numeroALetras } from '../Reclamos/numeros-a-letras';
import dayjs from 'dayjs';

export const EXTENSIONS = [Document, Paragraph, Text, Bold, HardBreak, History];
export const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

export function cleanPastedHTML(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'b', 'br'],
    ALLOWED_ATTR: [],
  });
}

const sanitizedTemplate = cleanPastedHTML(defaultTemplate)
  //eliminar saltos de línea y reemplazarlos por un solo espacio
  .replace(/\n/g, ' ')
  //eliminar dos espacios seguidos y reemplazarlos por un solo espacio
  .replace(/ {2,}/g, ' ')
  //eliminar todos los espacios al inicio de cada línea y reemplazarlos por un solo espacio
  .replace(/^\s+/gm, ' ')
  //eliminar tabulaciones y reemplazarlas por un solo espacio
  .replace(/\t/g, ' ')
  //eliminar todos los espacios antes y después de <br/> y reemplazarlos por vacío
  .replace(/ *<br\/?> */g, '<br/>')
  //eliminar espacios al inicio y al final
  .trim();

export function fillTemplate(fields) {
  if (!fields) {
    return sanitizedTemplate;
  }

  const strToDate = (dateStr, defaultValue) =>
    dayjs(dateStr).isValid() ? dayjs(dateStr).format('DD [de] MMMM [de] YYYY') : defaultValue;

  const strToLocaleDate = (dateStr, defaultValue) =>
    dayjs(dateStr).isValid() ? dayjs(dateStr).format('DD/MM/YYYY') : defaultValue;

  const formatNumber = (numero) =>
    numero.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  let template = sanitizedTemplate
    .replaceAll('[PUESTO]', fields.puesto.trim() === '' ? '[PUESTO]' : fields.puesto.trim())
    .replaceAll('[FECHA]', strToDate(fields.fecha, '[FECHA]'))
    .replaceAll('[FECHA-TELEGRAMA]', strToLocaleDate(fields.fechaTelegrama, '[FECHA-TELEGRAMA]'))
    .replaceAll('[RECLAMADO]', fields.reclamado.trim() === '' ? '[RECLAMADO]' : fields.reclamado)
    .replaceAll('[IMPORTE]', formatNumber(fields.importe))
    .replaceAll('[IMPORTE-NROS]', numeroALetras(fields.importe))
    .replaceAll('[RUBROS]', fields.rubros === '' ? '[RUBROS]' : fields.rubros)
    .replaceAll('[CANTIDAD-CUOTAS]', numeroALetras(fields.cuotas.cantidad))
    .replaceAll('[IMPORTE-CUOTA]', numeroALetras(fields.cuotas.importe))
    .replaceAll(
      '[FECHA-PRIMERA-CUOTA]',
      strToDate(fields.cuotas.fechaPrimera, '[FECHA-PRIMERA-CUOTA]'),
    )
    .replaceAll(
      '[TITULAR-CUENTA]',
      fields.cuenta.titular.trim() === '' ? '[TITULAR-CUENTA]' : fields.cuenta.titular,
    )
    .replaceAll('[DNI-RECLAMANTE]', formatNumber(fields.reclamante.dni))
    .replaceAll(
      '[CUIL-TITULAR-CUENTA]',
      fields.cuenta.cuilTitular.trim() === '' ? '[CUIL-TITULAR-CUENTA]' : fields.cuenta.cuilTitular,
    )
    .replaceAll(
      '[ENTIDAD-CUENTA]',
      fields.cuenta.entidad.trim() === '' ? '[ENTIDAD-CUENTA]' : fields.cuenta.entidad,
    )
    .replaceAll(
      '[ALIAS-CUENTA]',
      fields.cuenta.alias.trim() === '' ? '[ALIAS-CUENTA]' : fields.cuenta.alias,
    )
    .replaceAll(
      '[RECLAMANTE]',
      fields.reclamante.nombre.trim() === '' ? '[RECLAMANTE]' : fields.reclamante.nombre,
    );

		return template;
}

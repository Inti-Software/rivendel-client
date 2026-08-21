import { Reclamos } from '../../api/endpoints/reclamos.js';
import ReportData from './DTOs/reportData.js';
import { NO_ESPECIFICADO } from '../Shared/constants.js';
import { CON_ARREGLO } from './tiposResoluciones.js';
import { tiptapDocumentToPdfMake } from './tiptap-to-pdfmake.js';

const PARAGRAPH_SPACING_PT = 10;
const EMPTY_PARAGRAPH_HEIGHT_PT = 12;
const EMPTY_SIGN = '1';

const preTitulo = (data) => {
  return {
    text: `RECLAMO Nº ${data.numero}`,
    margin: [0, 0, 0, PARAGRAPH_SPACING_PT],
  };
};

const titulo = (data) => {
  return {
    text: data?.titulo,
    style: 'header',
  };
};

const reclamantes = (data) => {
  const row = (value, label) => ({
    columns: [
      { text: label, width: 70 },
      { text: value, bold: true },
    ],
  });

  return {
    margin: [0, 0, 0, PARAGRAPH_SPACING_PT],
    stack: [
      row(data?.nombresReclamantes, 'Reclamante/s: '),
      row(data?.nombresReclamados, 'Reclamado/s: '),
    ],
  };
};

const rubros = (data) => {
  return {
    margin: [0, 0, 0, PARAGRAPH_SPACING_PT],
    text: [{ text: 'OBJETO DEL RECLAMO/RUBROS Y PERÍODOS: ' }, { text: data?.rubros }],
  };
};

const getParte = (partes, esReclamado, cantidadReclamos) => {
  let s = '';
  if (!partes || partes.length === 0) {
    return s;
  }
  if (partes.length === 1) {
    s = `por la parte ${esReclamado ? 'reclamada/empleadora' : 'reclamante/trabajadora'}: `;
  } else {
    s = `por las partes ${esReclamado ? 'reclamadas/empleadoras' : 'reclamantes/trabajadoras'}: `;
  }
  partes.forEach((parte) => {
    const nombre = parte.nombre;
    const sintetico = parte.sintetico;
    const nroDocumento = parte.nroDocumento;
    const cuil = parte.cuil;
    const domicilio = parte.domicilio || '';
    const localidad = parte.localidad || '';
    const patrocinante = parte.patrocinante || {};

    s += nombre;
    
    if (nroDocumento !== NO_ESPECIFICADO) {
      s += ` ${sintetico} ${nroDocumento}`;
    }

    if (cuil !== NO_ESPECIFICADO) {
      s += `, CUIL ${cuil}`;
    }

    s += `, con domicilio en ${domicilio}`;

    if (localidad && localidad.trim() !== '') {
      s += `, de la localidad ${localidad}`;
    }

    if (parte.nroWhatsappParte) {
      s += `, quien comparece virtualmente por videollamada de Whatsapp desde el número ${parte.nroWhatsappParte}`;
    }

    if (parte.postergo) {
      s +=
        ' la cual solicitó el cambio de fecha original para el día de hoy, pese a lo cual no compareció';
    }

    if (Object.keys(patrocinante || {}).length > 0) {
      if (parte.esApoderado) {
        s += `, representado por su apoderado el Dr. ${patrocinante.nombre} MP Nº ${patrocinante.nroMatricula}`;
      } else {
        s += `, con el patrocinio letrado del Dr. ${patrocinante.nombre} MP Nº ${patrocinante.nroMatricula}`;
      }

      if (patrocinante.domicilio !== NO_ESPECIFICADO) {
        s += ` ratificando domicilio en ${patrocinante.domicilio}`;
      }

      if (patrocinante.localidad !== NO_ESPECIFICADO) {
        s += ` de la ciudad ${patrocinante.localidad}`;
      }

      if (patrocinante.nroCasillero !== NO_ESPECIFICADO) {
        s += `, casillero Nº ${patrocinante.nroCasillero}`;
      }

      if (parte.nroWhatsappPatrocinante) {
        s += `, quien comparece virtualmente por videollamada de Whatsapp desde el número ${parte.nroWhatsappPatrocinante}`;
      }
    }

    if (parte.incomparendoParte && cantidadReclamos) {
      s += ` quien fue notificada de las ${cantidadReclamos} fechas de audiencia de conciliación, según informe suministrado por la DICLO.`;
    }

    if (parte.multado) {
      s +=
        '.\nAsimismo se solicita la aplicación de la multa establecida  en el Artículo 8°, del Anexo II de la Ley Nacional ' +
        'N° 25.212 Régimen General de Sanciones por Infracciones Laborales por ser considerada la conducta de la patronal ' +
        'como obstructiva y, como tal, sancionable de conformidad a la  normativa nombrada anteriormente.';
    }
  });

  return s;
};

const joinPartes = (data, incomparendo) => {
  const reclamantes = data?.reclamantes?.filter((r) => r.incomparendoParte === incomparendo);
  const reclamados = data?.reclamados?.filter((r) => r.incomparendoParte === incomparendo);

  const partesReclamantes = getParte(reclamantes, false, data?.cantidad);
  const partesReclamados = getParte(reclamados, true, data?.cantidad);

  let partes = '';
  if (partesReclamantes) {
    partes = partesReclamantes;
  }

  if (partesReclamados) {
    if (partes) {
      partes += ' y ';
    }
    partes += partesReclamados;
  }

  return partes;
};

const getPostergacion = (proximaAudiencia) => {
  if (proximaAudiencia) {
    return (
      `Esta conciliadora le fija una SEGUNDA FECHA para el día ${proximaAudiencia.dia} de ${proximaAudiencia.mes}` +
      ` de ${proximaAudiencia.anio} a las ${proximaAudiencia.hora} horas, bajo apercibimiento de requerir la aplicación` +
      ` de la multa establecida en el Art.14 párrafo 5º de la ley 7330. Se solicita desde la DICLO se realice la` +
      ` notificación respectiva.`
    );
  }
  return '';
};

const getDeclaracion = (data) => {
  if (data.idResolucion === CON_ARREGLO) {
    return 'las partes expresan lo siguiente:';
  }
  let partes = joinPartes(data, true);
  if (partes) {
    if (partes.endsWith('.')) {
      partes = partes.slice(0, -1);
    }
    return (
      'se deja constancia de la imposibilidad de celebrar la audiencia fijada para el día de ' +
      `la fecha atento a la incomparencia ${partes}. ${getPostergacion(data.proximaAudiencia)}`
    );
  }

  return (
    'Las partes manifiestan que luego de un breve intercambio respecto de los reclamos enunciados, ' +
    'no es posible arribar a un acuerdo conciliatorio. En razón de ello se deja constancia que con ' +
    'esta audiencia culmina el procedimiento de conciliación laboral obligatorio, extendiéndose la ' +
    'correspondiente CERTIFICACIÓN DE FRACASO (art. 16 ley 7.330 y 15, 21, Dec. Reg), quedando expedita ' +
    'la instancia judicial para el reclamo de los rubros arriba identificados. '
  );
};

const getFinalizacion = (data) => {
  if (data.idResolucion === CON_ARREGLO) return '';
  return (
    `Siendo las ${data?.horaFin} horas, se da por finalizado el acto, previa lectura, firmando los comparecientes al pie ` +
    `de la presente, ante mí conciliadora autorizante.`
  );
};

const cuerpo = (data) => {
  let s =
    `En la ciudad de Santiago del Estero, provincia del mismo nombre, a los ${data?.fechaInicio.dia} días ` +
    `del mes de ${data?.fechaInicio.mes} del año ${data?.fechaInicio.anio}, siendo las ${data?.fechaInicio.hora} ` +
    `horas, ante mí ${data.conciliador}, en mi calidad de Conciliador Laboral, habilitación Nº ${data.nroHabilitacion}, en ` +
    `ejercicio de las funciones conferidas por la ley 7.330 y el decreto reglamentario 2.230/22. En el Marco del ` +
    `trámite de referencia, comparecen ${joinPartes(data, false)}.- Y ABIERTO EL ACTO: ${getDeclaracion(data)}`;
  s += `\n${getFinalizacion(data)}`;
  return {
    margin: [0, 0, 0, PARAGRAPH_SPACING_PT],
    text: s,
  };
};

const clausulas = (data) => {
  if (!data.clausulas || data.clausulas.length === 0) {
    return {
      text: '',
      margin: [0, 0, 0, PARAGRAPH_SPACING_PT],
    };
  }
  const paragraphs = tiptapDocumentToPdfMake(data.clausulas);
  const result = [];
  paragraphs.forEach((element) => {
    result.push({
      text: element,
      margin: [0, 0, 0, PARAGRAPH_SPACING_PT],
    });
  });
  return result;
};

const firmas = (data) => {
  const existeParte = (p) =>
    (p.nroWhatsappParte ?? '') === '' && (p?.incomparendoParte ?? false) === false;
  const existePatrocinante = (p) =>
    p.patrocinante &&
    (p.nroWhatsappPatrocinante ?? '') === '' &&
    (p?.incomparendoPatrocinante ?? false) === false;
  const existenReclamantes = data?.reclamantes?.some(existeParte);
  const existenReclamados = data?.reclamados?.some(existeParte);
  const existenLetradosReclamantes = data?.reclamantes?.some(existePatrocinante);
  const existenLetradosReclamados = data?.reclamados?.some(existePatrocinante);

  const firmasIzquierda = [];
  const firmasDerecha = [];
  if (existenReclamantes && existenLetradosReclamantes) {
    firmasIzquierda.push('Firma Reclamante');
    firmasIzquierda.push('Aclaración Reclamante');
    firmasIzquierda.push('Tipo y Nro. Documento Reclamante');
    firmasIzquierda.push('Firma Letrado Reclamante');
  } else if (existenReclamantes) {
    firmasIzquierda.push('Firma Reclamante');
    firmasIzquierda.push('Aclaración Reclamante');
    firmasIzquierda.push('Tipo y Nro. Documento Reclamante');
    firmasIzquierda.push(EMPTY_SIGN);
  } else if (existenLetradosReclamantes) {
    firmasIzquierda.push('Firma Letrado Reclamante');
    firmasIzquierda.push(EMPTY_SIGN);
    firmasIzquierda.push(EMPTY_SIGN);
    firmasIzquierda.push(EMPTY_SIGN);
  } else {
    firmasIzquierda.push(EMPTY_SIGN);
    firmasIzquierda.push(EMPTY_SIGN);
    firmasIzquierda.push(EMPTY_SIGN);
    firmasIzquierda.push(EMPTY_SIGN);
  }

  if (existenReclamados && existenLetradosReclamados) {
    firmasDerecha.push('Firma Reclamado');
    firmasDerecha.push('Aclaración Reclamado');
    firmasDerecha.push('Tipo y Nro. Documento Reclamado');
    firmasDerecha.push('Firma Letrado Reclamado');
  } else if (existenReclamados) {
    firmasDerecha.push('Firma Reclamado');
    firmasDerecha.push('Aclaración Reclamado');
    firmasDerecha.push('Tipo y Nro. Documento Reclamado');
    firmasDerecha.push(EMPTY_SIGN);
  } else if (existenLetradosReclamados) {
    firmasDerecha.push('Firma Letrado Reclamado');
    firmasDerecha.push(EMPTY_SIGN);
    firmasDerecha.push(EMPTY_SIGN);
    firmasDerecha.push(EMPTY_SIGN);
  } else {
    firmasDerecha.push(EMPTY_SIGN);
    firmasDerecha.push(EMPTY_SIGN);
    firmasDerecha.push(EMPTY_SIGN);
    firmasDerecha.push(EMPTY_SIGN);
  }

  return [
    firma(firmasIzquierda[0], firmasDerecha[0]),
    firma(firmasIzquierda[1], firmasDerecha[1]),
    firma(firmasIzquierda[2], firmasDerecha[2]),
    firma(firmasIzquierda[3], firmasDerecha[3]),
  ];
};

const cell = (margins, label) => {
  if (label === EMPTY_SIGN) return {};

  return {
    table: {
      widths: ['*'],
      body: [
        [
          {
            text: label,
            border: [false, true, false, false],
            fontSize: 8,
            verticalAlignment: 'bottom',
            alignment: 'center',
          },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0.2,
      hLineColor: () => '#000',
    },
    margin: margins,
  };
};

const firma = (label1, label2) => ({
  columns: [
    {
      stack: [cell([0, 20, 5, 0], label1)],
    },
    {
      stack: [cell([5, 20, 0, 0], label2)],
    },
  ],
});

function content(data) {
  const result = [];
  if (data.idResolucion === CON_ARREGLO) {
    result.push([preTitulo(data), titulo(data), cuerpo(data), clausulas(data)]);
  } else {
    result.push([titulo(data), reclamantes(data), rubros(data), cuerpo(data)]);
  }
  result.push(firmas(data));
  return result;
}

const buildActaDoc = (data) => {
  const result = {
    pageSize: {
      width: 609.5,
      height: 935.5,
    },
    pageMargins: [85, 70, 85, 70],
    defaultStyle: {
      font: 'Times',
      fontSize: 12,
      lineHeight: 1.5,
      alignment: 'justify',
    },
    content: content(data),
    styles: {
      header: {
        bold: true,
        alignment: 'center',
        decoration: 'underline',
        margin: [0, 0, 0, 15],
      },
    },
  };
  return result;
};

const buildErrorDoc = (message) => ({
  content: [
    {
      text: message,
      color: 'red',
      bold: true,
      fontSize: 14,
      alignment: 'center',
      margin: [0, 50, 0, 0],
      font: 'Times',
    },
  ],
});

const buildDocument = async (id) => {
  const response = await Reclamos.get(id);
  let doc;
  if (!response.ok) {
    doc = buildErrorDoc('Error: Se produjo un error al obtener los datos del reclamo.');
  } else {
    const data = response.data;
    if (!data || Object.keys(data).length === 0) {
      doc = buildErrorDoc('Error: No se encontraron datos para el reclamo solicitado.');
    } else {
      doc = buildActaDoc(new ReportData(data));
    }
  }
  return doc;
};

const createPDF = async (id) => {
  const doc = await buildDocument(id);
  const { default: pdfMake } = await import('pdfmake/build/pdfmake');
  const { default: vfs } = await import('../../assets/vfs_fonts');
  pdfMake.vfs = vfs;
  pdfMake.fonts = {
    Times: {
      normal: 'LiberationSerif-Regular.ttf',
      bold: 'LiberationSerif-Bold.ttf',
      italics: 'LiberationSerif-Italic.ttf',
      bolditalics: 'LiberationSerif-BoldItalic.ttf',
    },
  };
  return pdfMake.createPdf(doc).open();
};

export default createPDF;

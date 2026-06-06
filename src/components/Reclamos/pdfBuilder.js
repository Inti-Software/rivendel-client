import pdfMake from 'pdfmake/build/pdfmake';
import vfs from '../../assets/vfs_fonts.js';
import { Reclamos } from '../../api/endpoints/reclamos.js';
import ReportData from './DTOs/reportData.js';
import { NO_ESPECIFICADO } from '../Shared/constants.js';

pdfMake.vfs = vfs;
pdfMake.fonts = {
  Times: {
    normal: 'LiberationSerif-Regular.ttf',
    bold: 'LiberationSerif-Bold.ttf',
    italics: 'LiberationSerif-Italic.ttf',
    bolditalics: 'LiberationSerif-BoldItalic.ttf',
  },
};

const subHeader = (data) => {
  const row = (value, label) => ({
    columns: [
      { text: label, width: 70 },
      { text: value, bold: true }
    ]
  });

  return {
    margin: [0, 0, 0, 10],
    stack: [
      row(data?.nombresReclamantes, "Reclamante/s: "),
      row(data?.nombresReclamados, "Reclamado/s: ")
    ],
  }  
}

const getParte = (partes, esReclamado, cantidadReclamos) => {
  let s = "";
  if (!partes || partes.length === 0) {
    return s;
  }
  if (partes.length === 1) {
    s = `por la parte ${esReclamado? "reclamada/empleadora" : "reclamante/trabajadora"}: `;
  } else {
    s = `por las partes ${esReclamado? "reclamadas/empleadoras" : "reclamantes/trabajadoras"}: `;
  }
  partes.forEach((parte) => {
    const nombre = parte.nombre;
    const sintetico = parte.sintetico;
    const nroDocumento = parte.nroDocumento;
    const cuil = parte.cuil;
    const domicilio = parte.domicilio || '';
    const localidad = parte.localidad || '';
    const patrocinante = parte.patrocinante || {};

    s += `${nombre} ${sintetico} ${nroDocumento}`;

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
      s += ' la cual solicitó el cambio de fecha original para el día de hoy, pese a lo cual no compareció';
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

    if (parte.incomparendo && cantidadReclamos) {
      s += ` quien fue notificada de las ${cantidadReclamos} fechas de audiencia de conciliación, según informe suministrado por la DICLO.`;
    }

    if (parte.multado) {
      s += '.\nAsimismo se solicita la aplicación de la multa establecida  en el Artículo 8°, del Anexo II de la Ley Nacional ' + 
           'N° 25.212 Régimen General de Sanciones por Infracciones Laborales por ser considerada la conducta de la patronal ' + 
           'como obstructiva y, como tal, sancionable de conformidad a la  normativa nombrada anteriormente.';
    }
  });

  return s;
};

const joinPartes = (data, incomparendo) => {
  const reclamantes = data?.reclamantes?.filter((r) => r.incomparendo === incomparendo);
  const reclamados = data?.reclamados?.filter((r) => r.incomparendo === incomparendo);
  
  const partesReclamantes = getParte(reclamantes, false, data?.cantidad);
  const partesReclamados = getParte(reclamados, true, data?.cantidad);
  
  let s = "";
  if (partesReclamantes) {
    s = partesReclamantes;
  }

  if (partesReclamados) {
     if (s) {
      s += " y ";
    }
    s += partesReclamados;
  }

  return s;
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
  let s = joinPartes(data, true);
  if (s) {
    if (s.endsWith('.')) {
      s = s.slice(0, -1);
    }
    s = "se deja constancia de la imposibilidad de celebrar la audiencia fijada para el día de " + 
        `la fecha atento a la incomparencia ${s}. ${getPostergacion(data.proximaAudiencia)}`;
    return s;
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
  return (
    `Siendo las ${data?.horaFin} horas, se da por finalizado el acto, previa lectura, firmando los comparecientes al pie ` +
    `de la presente, ante mí conciliadora autorizante.`
  );
};

const getCuerpo = (data) => {
  let s = `En la ciudad de Santiago del Estero, provincia del mismo nombre, a los ${data?.fechaInicio.dia} días ` +
    `del mes de ${data?.fechaInicio.mes} del año ${data?.fechaInicio.anio}, siendo las ${data?.fechaInicio.hora} ` +
    `horas, ante mí María Cristina Lavaisse Beck, en mi calidad de Conciliador Laboral, habilitación Nº 7, en ` +
    `ejercicio de las funciones conferidas por la ley 7.330 y el decreto reglamentario 2.230/22. En el Marco del ` +
    `trámite de referencia, comparecen ${joinPartes(data, false)}.- Y ABIERTO EL ACTO: ${getDeclaracion(data)}`;
  s += `\n${getFinalizacion(data)}`;
  return s;
};

const cell = (margins, label) => ({
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
});

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

const buildActaDoc = (data) => {
  return {
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

    content: [
      {
        text: data?.titulo,
        style: 'header',
      },
      subHeader(data),
      {
        margin: [0, 0, 0, 10],
        text: [{ text: 'OBJETO DEL RECLAMO/RUBROS Y PERÍODOS: ' }, { text: data?.rubros }],
      },
      {
        margin: [0, 0, 0, 10],
        text: getCuerpo(data),
      },
      firma('Firma Reclamante', 'Firma Reclamado'),
      firma('Aclaración Reclamante', 'Aclaración Reclamado'),
      firma('Tipo y Nro. Documento Reclamante', 'Tipo y Nro. Documento Reclamado'),
      firma('Firma Letrado Reclamante', 'Firma Letrado Reclamado'),
    ],
    styles: {
      header: {
        bold: true,
        alignment: 'center',
        decoration: 'underline',
        margin: [0, 0, 0, 15],
      },
    },
  };
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
  return pdfMake.createPdf(doc).open();
};

export default createPDF;

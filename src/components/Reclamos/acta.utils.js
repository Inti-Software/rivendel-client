import { NO_ESPECIFICADO } from '../Shared/constants.js';

export const PRESENCIALES = 1;
export const INCOMPARENDOS = 2;

export function getComparecientes(data) {
  const existeParte = (p) =>
    (p.nroWhatsappParte ?? '') === '' && (p?.incomparendoParte ?? false) === false;
  const existePatrocinante = (p) =>
    p.patrocinante &&
    (p.nroWhatsappPatrocinante ?? '') === '' &&
    (p?.incomparendoPatrocinante ?? false) === false;
  return {
    existenReclamantes: data?.reclamantes?.some(existeParte),
    existenReclamados: data?.reclamados?.some(existeParte),
    existenLetradosReclamantes: data?.reclamantes?.some(existePatrocinante),
    existenLetradosReclamados: data?.reclamados?.some(existePatrocinante)
  };
}

function concatenatePartes(partes, esReclamado, cantidadReclamos) {
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

export function joinPartes(data, tipoIncomparecencia) {
  let reclamantes = [];
  let reclamados = [];
  if (tipoIncomparecencia === PRESENCIALES) {
    reclamantes = data?.reclamantes?.filter((r) => r.incomparendoParte === false || r.incomparendoPatrocinante === false);
    reclamados = data?.reclamados?.filter((r) => r.incomparendoParte === false || r.incomparendoPatrocinante === false);
  } else {
    reclamantes = data?.reclamantes?.filter((r) => r.incomparendoParte === true && r.incomparendoPatrocinante === true);
    reclamados = data?.reclamados?.filter((r) => r.incomparendoParte === true && r.incomparendoPatrocinante === true);
  }

  const partesReclamantes = concatenatePartes(reclamantes, false, data?.cantidad);
  const partesReclamados = concatenatePartes(reclamados, true, data?.cantidad);

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
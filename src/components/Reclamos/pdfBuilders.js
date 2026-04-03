import pdfMake from "pdfmake/build/pdfmake";
import vfs from "../../assets/vfs_fonts.js";
import { Reclamos } from "../../api/endpoints";
import ReportData from "./DTOs/ReportData";
import { NO_ESPECIFICADO } from "../Shared/constants";

pdfMake.vfs = vfs; // 👈 este suele ser el correcto
pdfMake.fonts = {
  Times: {
    normal: "LiberationSerif-Regular.ttf",
    bold: "LiberationSerif-Bold.ttf",
    italics: "LiberationSerif-Italic.ttf",
    bolditalics: "LiberationSerif-BoldItalic.ttf",
  },
};

const getParte = (partes) => {
	let s = "";
	partes.forEach((parte) => {
		const nombre = parte.nombre;
		const sintetico = parte.sintetico;
		const nroDocumento = parte.nroDocumento;
		const cuil = parte.cuil;
		const domicilio = parte.domicilio || "";
		const localidad = parte.localidad || "";
		const patrocinante = parte.patrocinante || {};

		s += (s === "" ? " " : ", ") + `${nombre} ${sintetico} ${nroDocumento}`;

		if (parte.cuil !== "0") {
			s += `, CUIL ${cuil}`;
		}

		s += `, con domicilio en ${domicilio}`;

		if (localidad && localidad.trim() !== "") {
			s += `, de la localidad ${localidad}`;
		}

		if (parte.nroWhatsappParte) {
			s += `, quien comparece virtualmente por videollamada de Whatsapp desde el número ${parte.nroWhatsappParte}`;
		}

		if (Object.keys(patrocinante || {}).length > 0) {
			if (parte.esApoderado) {
				s += `, representado por su apoderado el Dr. ${patrocinante.nombre} MP Nº ${patrocinante.nroMatricula},`;
			} else {
				s += `, con el patrocinio letrado del Dr. ${patrocinante.nombre} MP Nº ${patrocinante.nroMatricula},`;
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
	});

	return s.trim();
};

const buildActaDocDefinition = (data) => {
  const lineaFirma = (label1, label2) => ({
    columns: [
      {
        width: "50%",
        text: label1,
        margin: [0, 25, 10, 0],
        decoration: "overline",
        alignment: "center",
        fontSize: 8,
      },
      {
        width: "50%",
        text: label2,
        margin: [10, 25, 0, 0],
        decoration: "overline",
        alignment: "center",
        fontSize: 8,
      },
    ],
  });

  return {
    pageSize: {
      width: 609.5,
      height: 935.5,
    },
    pageMargins: [85, 70, 85, 70],

    defaultStyle: {
      font: "Times",
      fontSize: 12,
    },

    content: [
      {
        text: data?.titulo,
        style: "header",
      },

      {
        margin: [0, 10],
        text: [
          { text: "Reclamante: " },
          { text: data?.nombresReclamantes, bold: true },
        ],
      },
      {
        margin: [0, 0, 0, 10],
        text: [
          { text: "Reclamados: " },
          { text: data?.nombresReclamados, bold: true },
        ],
      },

      {
        margin: [0, 0, 0, 10],
        text: [
          { text: "OBJETO DEL RECLAMO/RUBROS Y PERÍODOS: " },
          { text: data?.rubros },
        ],
        alignment: "justify",
        lineHeight: 1.2,
      },

      {
        text: `En la ciudad de Santiago del Estero, provincia del mismo nombre, a los ${data?.fechaInicio.dia} días del mes de ${data?.fechaInicio.mes} del año ${data?.fechaInicio.anio}, siendo las ${data?.fechaInicio.hora} horas, ante mí María Cristina Lavaisse Beck, en mi calidad de Conciliador Laboral, habilitación Nº 7, en ejercicio de las funciones conferidas por la ley 7.330 y el decreto reglamentario 2.230/22. En el Marco del trámite de referencia, comparecen por una parte ${getParte(
          data?.reclamantes,
        )} y por la otra parte reclamada/empleadora ${getParte(
          data?.reclamados,
        )}.

- Y ABIERTO EL ACTO: ${data?.resolucion} Siendo las ${data?.horaFin} horas, se da por finalizado el acto de conciliación, previa lectura, firmando los comparecientes al pie de la presente, ante mí conciliadora autorizante.`,
        alignment: "justify",
        lineHeight: 1.2,
      },

      { text: "\n\n" },

      lineaFirma("Firma Reclamante", "Firma Reclamado"),
      lineaFirma("Aclaración Reclamante", "Aclaración Reclamado"),
      lineaFirma(
        "Tipo y Nro. Documento Reclamante",
        "Tipo y Nro. Documento Reclamado",
      ),
      lineaFirma("Firma Letrado Reclamante", "Firma Letrado Reclamado"),
    ],

    styles: {
      header: {
        bold: true,
        alignment: "center",
        decoration: "underline",
        margin: [0, 0, 0, 20],
      },
    },
  };
};

const buildErrorDoc = (message) => ({
  content: [
    {
      text: message,
      color: "red",
      bold: true,
      fontSize: 14,
      alignment: "center",
      margin: [0, 50, 0, 0],
    },
  ],
});

const createPDF = async (id) => {
	const response = await Reclamos.get(id);

	if (!response.ok) {
		pdfMake.createPdf(buildErrorDoc("Error: Se produjo un error al obtener los datos del reclamo.")).open();
		return;
	}

	const data = response.data;

	if (!data || Object.keys(data).length === 0) {
		pdfMake.createPdf(buildErrorDoc("Error: No se encontraron datos para el reclamo solicitado.")).open();	
		return;
	}

	const acta = buildActaDocDefinition(new ReportData(data));
	pdfMake.createPdf(acta).open();

	return;
};

export default createPDF;
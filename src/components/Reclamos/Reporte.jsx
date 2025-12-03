import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Reclamos } from '../../utils/endpoints';
import ReportData from './DTOs/ReportData';

const SIZE_OFICIO_LA = {
  width: 609.5, // 21.5 cm
  height: 935.5, // 33.0 cm
};

const styles = StyleSheet.create({
	page: { 
		size: SIZE_OFICIO_LA,
		paddingTop: "2.5cm",
		paddingBottom: "2.5cm",
		paddingLeft: "3cm",
		paddingRight: "3cm",
		fontSize: "12pt",
		fontFamily: 'Times-Roman' 
	},
	header: { 
		fontWeight: 'bold',
		marginBottom: 20, 
		textAlign: 'center',
		textDecoration: 'underline'
	},
	partes: { 
		marginBottom: 10,
	},
	rubros: { 
		marginBottom: 10,
		textAlign: 'justify',
		lineHeight: "18pt"
	},
	cuerpo: { 
		marginBottom: 20,
		textAlign: 'justify',
		lineHeight: "18pt"
	},

	firmas: {
		fontSize: "8pt",
		fontFamily: "Helvetica",
    width: '100%',
		textAlign: 'center',
  },

  filaFirmas: {
    flexDirection: 'row', // Organiza los elementos en fila (horizontal)
    alignItems: 'center',
		gap: 4,
		marginTop: "40px",
  },

  colFirmas: {
    width: '50%', // Definición explícita del 50%
    paddingLeft: 8,
		borderTop: '1px solid #000',
  }
});

const Acta = ({ data = ReportData }) => (
	<div id='reporte'>
		<PDFViewer>
			<Document>
				<Page style={styles.page}>
					<View>
						<Text style={styles.header}>{data?.titulo}</Text>
						<Text style={styles.partes}>
							<Text>Reclamante: </Text>
							<Text style={{ fontWeight: 'bold' }} >{data?.reclamante.nombre}</Text>
						</Text>
						<Text style={styles.partes}>
							<Text>Reclamados: </Text>
							<Text style={{ fontWeight: 'bold' }} >{data?.reclamado.nombre}</Text>
						</Text>
						<Text style={styles.rubros}>
							<Text>OBJETO DEL RECLAMO/RUBROS Y PERÍODOS: </Text>
							<Text>{data?.rubros}</Text>
						</Text>
						<Text style={styles.cuerpo}>
							En la ciudad de Santiago del Estero, provincia del mismo nombre, a los {data?.fechaInicio.dia} días 
							del mes de {data?.fechaInicio.mes} del año {data?.fechaInicio.anio}, siendo las {data?.fechaInicio.hora} horas,
							ante mí María Cristina Lavaisse Beck, en mi calidad de Conciliador Laboral, habilitación Nº 7, en ejercicio de las
							funciones conferidas por la ley 7.330 y el decreto reglamentario 2.2230/22. En el Marco del trámite de referencia,
							comparecen 
							
							por una parte {data?.reclamante.nombre} {data?.reclamante.tipoDocumento.sintetico} {data?.reclamante.nroDocumento}, 
							CUIL {data?.reclamante.cuil}, con domicilio en {data?.reclamante.domicilio}, Localidad: {data?.reclamante.localidad}, 
							con el patrocinio letrado del Dr. {data?.reclamante.patrocinante.nombre} MP Nº {data?.reclamante.patrocinante.nroMatricula},
							ratificando domicilio en {data?.reclamante.patrocinante.domicilio}, Localidad: {data?.reclamante.patrocinante.localidad} y
							constituyendo domicilio en casillero de notificaciones Nº {data?.reclamante.patrocinante.nroCasillero} 
							
							y por la otra parte 
							reclamada/empleadora {data?.reclamado.nombre} {data?.reclamado.tipoDocumento.sintetico} {data?.reclamado.nroDocumento}, 
							CUIL {data?.reclamado.cuil}, con domicilio en {data?.reclamado.domicilio}, Localidad: {data?.reclamado.localidad}, 
							con el patrocinio letrado del Dr. {data?.reclamado.patrocinante.nombre} MP Nº {data?.reclamado.patrocinante.nroMatricula},
							ratificando domicilio en {data?.reclamado.patrocinante.domicilio}, Localidad: {data?.reclamado.patrocinante.localidad} y
							constituyendo domicilio en casillero de notificaciones Nº {data?.reclamado.patrocinante.nroCasillero}.

							- Y ABIERTO EL ACTO: {data?.resolucion}
							Siendo las {data?.horaFin} horas, se da por finalizado el acto de conciliación, previa lectura, firmando los 
							comparecientes al pie de la presente, ante mí conciliadora autorizante.
						</Text>
					</View>


					<View style={styles.firmas}>
					
						<View style={styles.filaFirmas}>
							<View style={styles.colFirmas}>
								<Text>Firma Reclamante</Text>
							</View>
							<View style={styles.colFirmas}>
								<Text>Firma Reclamado</Text>
							</View>
						</View>

						<View style={styles.filaFirmas}>
							<View style={styles.colFirmas}>
								<Text>Aclaración Reclamante</Text>
							</View>
							<View style={styles.colFirmas}>
								<Text>Aclaración Reclamado</Text>
							</View>
						</View>
						
						<View style={styles.filaFirmas}>
							<View style={styles.colFirmas}>
								<Text>DNI Reclamante</Text>
							</View>
							<View style={styles.colFirmas}>
								<Text>DNI Reclamado</Text>
							</View>
						</View>

						<View style={styles.filaFirmas}>
							<View style={styles.colFirmas}>
								<Text>Firma letrado Reclamante</Text>
							</View>
							<View style={styles.colFirmas}>
								<Text>Firma letrado Reclamado</Text>
							</View>
						</View>

					</View>
				</Page>
			</Document>
		</PDFViewer>
	</div>
)

const Reporte = ({ root }) => {
	const { id } = useParams();

	useEffect(() => {
		try {
			const fetchData = async () => {
				const response = await Reclamos.get(id);
				if (response.ok) {
					const data = await response.json();
					root.render(<Acta data={new ReportData(data)} />)
				} else {
					const msg = await response.json();
					root.render(<div>Error: {msg.code} - {msg.message}</div>);
				}
			};
			fetchData();
		} catch (err) {
			root.render(<div>Error: {err.message}</div>);
		}

	}, [id])
}

export default Reporte;
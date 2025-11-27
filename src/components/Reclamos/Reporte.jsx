import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Reclamos } from '../../utils/endpoints';
import ReportData from './DTOs/ReportData';

const styles = StyleSheet.create({
	page: { 
		padding: 30 ,
		fontSize: 12 
	},
	header: { 
		fontWeight: 'bold',
		marginBottom: 20, 
		textAlign: 'center',
		textDecoration: 'underline'
	},
	partes: { 
		marginBottom: 5,
	},
});

const Acta = ({ data = ReportData }) => (
	<div id='reporte'>
		<PDFViewer>
			<Document>
				<Page size="A4" style={styles.page}>
					<View>
						<Text style={styles.header}>{data?.titulo}</Text>
						<Text style={styles.partes}>
							<Text>Reclamante: </Text>
							<Text style={{ fontWeight: 'bold' }} >{data?.reclamante}</Text>
						</Text>
						<Text style={styles.partes}>
							<Text>Reclamados: </Text>
							<Text style={{ fontWeight: 'bold' }} >{data?.reclamado}</Text>
						</Text>

						<Text style={styles.dataItem}>Datos cargados a las: {new Date().toLocaleTimeString()}</Text>
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
					// const data = {
					// 	titulo: `CERTIFICACIÓN DE FRACASO RECLAMO ${r.numero}`,
					// 	id: id
					// }
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
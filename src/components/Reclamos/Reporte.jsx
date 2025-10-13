import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Reclamos } from '../../utils/endpoints';

const styles = StyleSheet.create({
	page: { padding: 30 },
	header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
	dataItem: { fontSize: 12, marginBottom: 5 },
});

const Acta = ({ data }) => (
	<div id='reporte'>
		<PDFViewer>
			<Document>
				<Page size="A4" style={styles.page}>
					<View>
						<Text style={styles.header}>{data?.titulo}</Text>
						<Text style={styles.dataItem}>ID del Reporte: {data?.id}</Text>
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
					const r = await response.json();
					const data = {
						titulo: `CERTIFICACIÓN DE FRACASO RECLAMO ${r.numero}`,
						id: id
					}
					root.render(<Acta data={data} />)
				} else {
					const msg = await response.json();
					root.render(<div>Error: {msg.code} - {msg.message}</div>);
				}
			};
			fetchData();
		} catch (err) {
			root.render(<div>Error: {err.message}</div>);
		}

	}, [])
}

export default Reporte;
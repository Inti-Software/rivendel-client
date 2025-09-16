import ErrorMessage from "../Shared/ErrorMessage";
import Spinner from "../Shared/Spinner";
import Container from "../Forms/Container";
import useFormGrid from "../../hooks/useFormGrid";
import { Resoluciones } from "../../utils/endpoints";
import { RECORDS_PER_PAGE } from "../../utils/constants";
import ResolucionesGrid from "./ResolucionesGrid";

const ListResoluciones = () => {
	const { loading, data, error, currentPage, totalPages, setData, 
		setCurrentPage } = useFormGrid(Resoluciones.findAll, RECORDS_PER_PAGE)

	if (loading) {
		return <Spinner/>
	}

	return (
		<Container title={"Resoluciones"} newPath="/resoluciones/new">
			{error ? (
				<ErrorMessage message={error} />
			) : (
				<ResolucionesGrid
					data={data}
					currentPage={currentPage}
					totalPages={totalPages}
					setData={setData}
					setCurrentPage={setCurrentPage}
				/>
			)}
		</Container>
	)
};

export default ListResoluciones;

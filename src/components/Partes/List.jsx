import ErrorMessage from "../Shared/ErrorMessage";
import Spinner from "../Shared/Spinner";
import Container from "../Forms/Container";
import useFormGrid from "../../hooks/useFormGrid";
import { Partes } from "../../utils/endpoints";
import { RECORDS_PER_PAGE } from "../../utils/constants";
import PartesGrid from "./PartesGrid";

const ListPartes = () => {
	const { loading, data, error, currentPage, totalPages, setData, 
		setCurrentPage } = useFormGrid(Partes.findAll, RECORDS_PER_PAGE)


	if (loading) {
		return <Spinner/>
	}

	return (
		<Container title={"Partes"} newPath="/partes/new">
			{error ? (
				<ErrorMessage message={error} />
			) : (
				<PartesGrid
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

export default ListPartes;

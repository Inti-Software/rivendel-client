import ErrorMessage from "../Shared/ErrorMessage";
import Spinner from "../Shared/Spinner";
import Container from "../Forms/Container";
import Grid from "./Grid";
import useFormGrid from "../../hooks/useFormGrid";
import { Patrocinantes } from "../../utils/endpoints";
import { RECORDS_PER_PAGE } from "../../utils/constants";

const ListPatrocinantes = () => {
  const { loading, data, error, currentPage, totalPages, setData, 
    setCurrentPage } = useFormGrid(Patrocinantes.findAll, RECORDS_PER_PAGE)

  if (loading) {
    return <Spinner/>
  }

  return (
    <Container title={"Patrocinantes"} newPath="/patrocinantes/new">
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <Grid
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

export default ListPatrocinantes;

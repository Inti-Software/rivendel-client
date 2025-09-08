import ErrorMessage from "../Shared/ErrorMessage";
import Spinner from "../Shared/Spinner";
import Container from "../Forms/Container";
import PatrocinantesGrid from "./PatrocinantesGrid";
import useFormGrid from "../../hooks/useFormGrid";
import { RECORDS_PER_PAGE, Patrocinantes } from "../../utils/endpoints";

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
        <PatrocinantesGrid
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

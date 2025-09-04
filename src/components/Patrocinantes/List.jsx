import ErrorMessage from "../Shared/ErrorMessage";
import Spinner from "../Shared/Spinner";
import Container from "../Forms/Container";
import PatrocinantesGrid from "./PatrocinantesGrid";
import useFormGrid from "../../hooks/useFormGrid";

const ListPatrocinantes = () => {
  const RECORDS_PER_PAGE = 5;

  const request = async (currentPage) => fetch(
    `http://localhost:3000/patrocinantes?page=${currentPage}&limit=${RECORDS_PER_PAGE}`
  );
  
  const { loading, data, error, currentPage, totalPages, setData, 
    setCurrentPage } = useFormGrid(request, RECORDS_PER_PAGE)


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

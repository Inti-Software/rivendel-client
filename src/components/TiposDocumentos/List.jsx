import ErrorMessage from "../Shared/ErrorMessage";
import Container from "../Forms/Container";
import Spinner from "../Shared/Spinner";
import TipoDocumentoGrid from "./TipoDocumentoGrid";
import useFormGrid from "../../hooks/useFormGrid";

const ListTiposDocumentos = () => {
  const RECORDS_PER_PAGE = 5;

  const request = async (currentPage) => fetch(
    `http://localhost:3000/tipdocs?page=${currentPage}&limit=${RECORDS_PER_PAGE}`
  );

  const { loading, data, error, currentPage, totalPages, setData,
    setCurrentPage } = useFormGrid(request, RECORDS_PER_PAGE)
    
  if (loading) {
    return <Spinner />;
  }

  return (
    <Container title={"Tipos de Documentos"} newPath="/tipos-documentos/new">
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
        <TipoDocumentoGrid
          data={data}
          currentPage={currentPage}
          totalPages={totalPages}
          setData={setData}
          setCurrentPage={setCurrentPage}
        />
        </>
      )}
    </Container>
  );
};

export default ListTiposDocumentos;
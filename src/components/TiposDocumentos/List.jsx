import ErrorMessage from "../Shared/ErrorMessage";
import Container from "../Forms/Container";
import Spinner from "../Shared/Spinner";
import Grid from "./Grid";
import useFormGrid from "../../hooks/useFormGrid";
import { TiposDocumento } from "../../utils/endpoints";
import { RECORDS_PER_PAGE } from "../../utils/constants";

const ListTiposDocumentos = () => {
  const { loading, data, error, currentPage, totalPages, setData,
    setCurrentPage } = useFormGrid(TiposDocumento.findAll, RECORDS_PER_PAGE)
    
  if (loading) {
    return <Spinner />;
  }

  console.log(data);

  return (
    <Container title={"Tipos de Documentos"} newPath="/tipos-documentos/new">
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
        <Grid
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
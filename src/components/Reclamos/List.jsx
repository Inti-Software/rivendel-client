import ErrorMessage from "../Shared/ErrorMessage";
import Container from "../Forms/Container";
import Spinner from "../Shared/Spinner";
import useFormGrid from "../../hooks/useFormGrid";
import { Reclamos } from "../../utils/endpoints";
import { RECORDS_PER_PAGE } from "../../utils/constants";
import ReclamosGrid from "./ReclamosGrid";

const ListReclamos = () => {
  const { loading, data, error, currentPage, totalPages, setData,
    setCurrentPage } = useFormGrid(Reclamos.findAll, RECORDS_PER_PAGE)
    
  if (loading) {
    return <Spinner />;
  }

  return (
    <Container title={"Reclamos"} newPath="/reclamos/new">
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
        <ReclamosGrid
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

export default ListReclamos;
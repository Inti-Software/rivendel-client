import './GridButtons'
import NotificationDisplay from '../Shared/NotificationDisplay';

const Grid = ({data, headers, row, currentPage, totalPages, setCurrentPage}) => {
    const nextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    };

    return (
      <>
      <NotificationDisplay />
        <table className="table table-striped table-hover">
          {headers && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>)
          }
          <tbody>
            {!data || data.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center">
                  <span className="badge text-secondary bg-body-secondary rounded-2 border border-secondary">
                    No hay datos para mostrar.
                  </span>
                </td>
              </tr>
            ) : (
              data.map((doc) => {
                const r = row(doc);
                return (
                  <tr key={r.key}>
                    {r.columns.map((c, i) => (
                      <td key={i}>{c}</td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-primary"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            {" "}
            Página {currentPage} de {totalPages}{" "}
          </span>
          <button
            className="btn btn-primary"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </>
    );
  }

	export default Grid;
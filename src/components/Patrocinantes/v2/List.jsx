import ErrorMessage from "../../Shared/ErrorMessage";
import { Patrocinantes } from "../../../utils/endpoints";
import { useState, useEffect } from "react";
import { useNotification } from "../../../contexts/Constants";
import useDebounce from "../../../hooks/useDebounce";
import { GridEditButton, GridDeleteButton } from "../../Grid/GridButtons";
import { Link } from "react-router-dom";
import { SEARCH } from "../../../utils/Icons";
import DeleteDialog from "../../Modals/DeleteDialog";
import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../../../utils/constants";

const ListPatrocinantes = () => {
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [userInput, setUserInput] = useState("");
	const debouncedValue = useDebounce(userInput, 300)
	const [onDeleteId, setOnDeleteId] = useState(null);
	const [deleteDialog, setDeleteDialog] = useState({ show: false, message: "" });
	const { showSuccess, showError } = useNotification();

  const endpoint = Patrocinantes.findAll
  const recordsPerPage = 50
	const headers = ["Nombre", "Matrícula", "Domicilio", "Localidad", "Casillero", ""];	
  const showSearchBar = true
  const debug = false
  const searchPlaceHolder = "Nombre, matrícula o casillero"

  const onFetchData = async (query, currentPage, recordsPerPage) => {
    try {
      const response = await endpoint({ query, currentPage, recordsPerPage });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const fetchedData = await response.json();
      const totalRecords = fetchedData.totalRecords;
      const totalPages = Math.ceil(totalRecords / recordsPerPage);
      return {
        data: fetchedData.data || fetchedData,
        totalPages: totalPages,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        totalPages: 0,
        error: `Error ${error.message} al consultar los datos.`
      }
    } 
  };

  const onDeleteRow = async (id) => {
    try {
      const response = await Patrocinantes.delete(id);
      if (!response.ok) {
        throw new Error(response.status);
      }
    } catch (error) {
      return { error: `Se produjo un error ${error.message} al intentar eliminar el registro.`};
    }
  };

  const rowGenerator = (pat) => {
    const getMessage = (pat) => (
      <>
        ¿Está seguro de eliminar el siguiente patrocinante?
        <span className="fw-bold text-danger text-center d-block">
          {pat.nroMatricula} - {pat.nombre}
        </span>
        <span style={{ fontSize: "10px"}} className="text-secondary-subtle text-center pt-2 d-block">
          Esta operación no se puede deshacer.
        </span>
      </>
    )

    return {
      key: pat.id,
      columns: [
        {type: DATA_COLUMN, data: pat.nombre },
        {type: DATA_COLUMN, data: pat.nroMatricula },
        {type: DATA_COLUMN, data: pat.domicilio },
        {type: DATA_COLUMN, data: pat.localidad },
        {type: DATA_COLUMN, data: pat.nroCasillero },
        {type: BUTTON_COLUMN, 
          buttons: [
            { type: EDIT_BUTTON, path: `/patrocinantes/edit/${pat.id}` },
            { type: DELETE_BUTTON, 
              path: `/patrocinantes/delete/${pat.id}`,
              id: pat.id,
              message: (getMessage(pat))
            },
          ]
        },
      ],
    };
  }

  const handleDelete = async () => {
    const result = await onDeleteRow(onDeleteId);
    if (result.error) {
      showError(error.message);
    } else {
      setData((prevData) => prevData.filter((doc) => doc.id !== onDeleteId));
      showSuccess("Se eliminó correctamente el registro.");
      setDeleteDialog({show: false});
    }
  };	

	useEffect(() => {
    setLoading(true);
    onFetchData(debouncedValue.trim(), currentPage, recordsPerPage)
      .then(result => {
        setData(result.data);
        setTotalPages(result.totalPages);
        setError(result.error)
      })
      .finally(() => {
        setLoading(false);
      });
	}, [currentPage, debouncedValue]);

  const onDeleteRecord = (e, id, msg) => {
    e.preventDefault();
    setOnDeleteId(id);
    setDeleteDialog({show: true, message: msg});
  };

  const paginate = ({ forward = false, page = 0 }) => {
    const p = parseInt(page)
    if (p > 0) {
      setCurrentPage(p)
    } else if (forward && (currentPage < totalPages)) {
      setCurrentPage((prev) => prev + 1);
    } else if (!forward && (currentPage > 1)) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  const handleChange = (e) => {
    setCurrentPage(1);
    setUserInput(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      setCurrentPage(1);
    }
  }  

  const renderNoHayDatos = (
    <tr>
      <td colSpan={headers?.length || 1} className="text-center">
        <span className="badge text-secondary bg-body-secondary rounded-2 border border-secondary">
          No hay datos para mostrar.
        </span>
      </td>
    </tr>
  )

  const getButtonCol = (btn) => {
    if (btn.type === EDIT_BUTTON) {
      return (<GridEditButton key={EDIT_BUTTON} path={btn.path} />)
    } else if (btn.type === DELETE_BUTTON) {
      return (<GridDeleteButton key={DELETE_BUTTON} path={btn.path} onDelete={(e) => onDeleteRecord(e, btn.id, btn.message)} />)
    }
  }

  const getCol = (c, index) => {
    let content = ""
    if (c.type == DATA_COLUMN) {
      content = c.data
    } else if (c.type == BUTTON_COLUMN) {
      content = <>{c.buttons.map(getButtonCol)}</>
    }
    return (<td key={index}>{content}</td>)
  }

  const getRow = (d) => {
    const r = rowGenerator(d);
    const content = r.columns.map(getCol)
    return (<tr key={r.key}>{content}</tr>)
  }
	
	return (
    <>
      <div className="container mt-4">
        <div>
          <div className="col-8 d-inline-block">
              <h1 className="d-inline">Patrocinantes</h1>
              {loading && (
              <div className="d-inline ms-2 mx-2 text-center">
                <div className="spinner-border text-bg-success" style={{height: "16px !important", width: "16px !important"}} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
              )}
          </div>
          <div className="col-4 d-inline-flex justify-content-end">
            <Link to="/patrocinantes/new" className="btn btn-outline-primary mb-2">
              Nuevo
            </Link>
          </div>
        </div>
	      {error && (<ErrorMessage message={error} />)}
				
        {showSearchBar && (
        <div className="row mb-3 justify-content-center">
					<div className="col-7 col-offset-2">
            <div className="position-relative">
              <input id="criterio" type="text" className="form-control border-primary-subtle rounded-4 ps-5"
                placeholder={searchPlaceHolder} autoComplete="off" value={userInput}
                onChange={handleChange} onKeyDown={handleKeyDown}
              />
              <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" id="searchIcon">
                {SEARCH}
              </span>
            </div>

					</div>
				</div>
        )}
				
				<table className="table table-striped table-hover">
        {headers && (
          <thead>
            <tr>
              {headers.map((h, i) => (<th key={i}>{h}</th>))}
            </tr>
          </thead>
        )}
        <tbody>
          {!data || data.length === 0 ? (renderNoHayDatos) : (data.map(getRow))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-primary" onClick={() => paginate({forward: false})}
          disabled={currentPage === 1 || totalPages === 0}>
          Anterior
        </button>
        <span>          
          Página
          <select onChange={(e) => { paginate({ page: e.target.value })}} className="mx-2 text-center">
            {[...Array(totalPages).keys()].map((i) => (
              <option key={i + 1} value={i + 1} defaultValue={currentPage}>
                {i + 1}
              </option>
            ))}
          </select>
          de {totalPages}
        </span>
        <button className="btn btn-primary" onClick={() => paginate({forward: true})}
          disabled={currentPage === totalPages || totalPages === 0}>
          Siguiente
        </button>
      </div>

				{ deleteDialog.show && 
					<DeleteDialog
						deleteMessage={deleteDialog.message}
						handleDelete={handleDelete}
						handleCancel={() => setDeleteDialog(false)}
					/>
				}

        {debug && (<pre>{JSON.stringify(data, null, " ")}</pre>)}				
      </div>
    </>
  )
};

export default ListPatrocinantes;

import { useState, useEffect } from "react";
import { useNotification } from "../../contexts/Constants";
import useDebounce from "../../hooks/useDebounce";
import { GridEditButton, GridDeleteButton } from "./GridButtons";
import { SEARCH } from "../Shared/Icons";
import DeleteDialog from "../Modals/DeleteDialog";
import { DATA_COLUMN, BUTTON_COLUMN, CUSTOM_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../Shared/constants";
import { RECORDS_PER_PAGE } from "../../api/endpoints";

const Grid = ({ columnBuilder, recordsPerPage = RECORDS_PER_PAGE, headers = [], 
  showSearchBar = false, searchPlaceHolder, endpoints, debug = false }) => {
    
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [userInput, setUserInput] = useState("");
	const debouncedValue = useDebounce(userInput, 300)
	const [onDeleteId, setOnDeleteId] = useState(null);
	const [deleteDialog, setDeleteDialog] = useState({ show: false, message: "" });
	const { showSuccess, showError } = useNotification();

  const handleDelete = async () => {
    const result = await endpoints.delete(onDeleteId);
    setDeleteDialog({show: false});
    if (result?.error) {
      showError(result.error);
    } else {
      setData((prevData) => prevData.filter((doc) => doc.id !== onDeleteId));
      showSuccess("Se eliminó correctamente el registro.");
    }
  };
  
	useEffect(() => {
    async function fetchData() {
      const { ok, data, totalPages, error } = await endpoints.findAll(debouncedValue.trim(), currentPage, recordsPerPage);
      if (ok) {        
        showError(error);
        //setError(error);
      } else {
        setData(data);
        setTotalPages(totalPages || 1);
        let pager = document.getElementById('selectPager');
        if (pager) {
          pager.value = currentPage;
        }
      }
    }
    
    setLoading(true);
    fetchData().finally(() => setLoading(false));
	}, [currentPage, debouncedValue, endpoints, recordsPerPage, showError]);

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
        <span className="badge text-black fw-light bg-secondary-subtle rounded-2 border border-secondary">
          No hay datos para mostrar
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

  const getCol = (column, index) => {
    let content = ""
    if (column.type == DATA_COLUMN) {
      content = column.data
    } else if (column.type == BUTTON_COLUMN) {
      content = <>{column.buttons.map(getButtonCol)}</>
    } else if (column.type == CUSTOM_COLUMN) {
      content = column.content;
    }
    return (<td key={index}>{content}</td>)
  }

  const getRow = (d) => {
    const colBuilder = columnBuilder({ data: d, onDelete: onDeleteRecord });
    const content = colBuilder.columns.map(getCol)
    return (<tr key={colBuilder.key}>{content}</tr>)
  }

  const pager = (
    <div className="d-flex justify-content-between align-items-center">
      <button className="btn btn-primary" onClick={() => paginate({forward: false})}
        disabled={currentPage === 1 || totalPages === 0}>
        Anterior
      </button>
      <span>          
        Página
        <select id="selectPager" onChange={(e) => { paginate({ page: e.target.value })}} className="mx-2 text-center">
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
  );

  const spinner = (
    <div className="spinner-border text-success h4 m-auto d-block" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  );

  const table = (
    <table className="table table-striped table-hover">
    { headers && (
      <thead>
        <tr>
          {headers.map((h, i) => (<th key={i}>{h}</th>))}
        </tr>
      </thead>
    ) }
      <tbody>
        {(!data || data.length === 0) ? (renderNoHayDatos) : (data.map(getRow))}
      </tbody>
    </table>
  );

  const searchBar = (
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
  );
  
  
	return (
    <>
      {loading && spinner}

      {showSearchBar && (searchBar)}

      {table}

      {totalPages > 1 && (pager)}

      { deleteDialog.show && 
        <DeleteDialog
          deleteMessage={deleteDialog.message}
          handleDelete={handleDelete}
          handleCancel={() => setDeleteDialog({ show: false, message: "" })}
        />
      }

      {debug && (<pre>{JSON.stringify(data, null, " ")}</pre>)}
    </>
  )
};

export default Grid;

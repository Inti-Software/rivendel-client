import CustomList from "../Shared/CustomList";
import usePatrocinantes from "./hooks/usePatrocinantes";

export default function List() {
  const recordsPerPage = 50
	const headers = ["Nombre", "Matrícula", "Domicilio", "Localidad", "Casillero", ""];	
  const showSearchBar = true
  const debug = false
  const searchPlaceHolder = "Nombre, matrícula o casillero"
	
	const { rowGenerator, onFetchData, onDeleteRow } = usePatrocinantes();

	return CustomList({
		rowGenerator,
		recordsPerPage,
		headers,
		showSearchBar,
		searchPlaceHolder,
		onFetchData,
		onDeleteRow,
		debug
	});
}
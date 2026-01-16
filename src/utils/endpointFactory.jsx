export function fetchEndpointFactory(endpoint) {
  return async (query, currentPage, recordsPerPage) => {
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
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        totalPages: 0,
        error: `Error ${error.message} al consultar los datos.`,
      };
    }
  };
}

export function deleteEndpointFactory(endpoint) {
	return async (id) => {
		const response = await endpoint(id);
		if (!response.ok) {
			return { error: `Se produjo un error ${response.status} al intentar eliminar el registro.` };
		}
	};
}
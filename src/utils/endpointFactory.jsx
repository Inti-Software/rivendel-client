import { http } from "../api/http";

export class EndpointFactory {
  constructor(configuration) {
    this.config = configuration;
  }

  async findAll(query, currentPage, recordsPerPage) {    
    const findAllConfig = this.config.findAll({ query, currentPage, recordsPerPage });
    const response = await http(findAllConfig)
      .then(function(response) {
        const { data } = response;
        const totalRecords = data.totalRecords;
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        return {
          data: data.data || data,
          totalPages: totalPages,
          error: null,
        };
      })
      .catch((err) => {
        let status = err.response ? err.response.status : "inesperado";
        return {
          data: null,
          totalPages: 0,
          error: `Error ${status} al consultar los datos.`,
        };
      });

    return response;
  }

  async delete(id) {
    const response = await http(this.config.delete(id));
    if (!response.ok) {
      return { error: `Se produjo un error ${response.status} al intentar eliminar el registro.` };
    }
  };
}
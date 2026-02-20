import { http } from "../api/http";

export class EndpointFactory {
  constructor(configuration) {
    this.config = configuration;
  }

  async findAll(query, currentPage, recordsPerPage) {
    const config = this.config.findAll({query, currentPage, recordsPerPage});
    const response = await http(config)
      .then((response) => {
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
    const response = await http(this.config.delete(id))
      .then((response) => {
        const { status } = response;
        return { ok: status == 200 || status === 201 };
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          return { ok: false, error: data?.message };
        } else {
          let status = err.response ? err.response.status : "inesperado";
          return { ok: false, error: `Error ${status} al intentar eliminar el registro.` };
        }
      });
    return response;
  }

  async post({nombre, nroMatricula, domicilio, localidad, nroCasillero}) {
    const config = this.config.create({ nombre, nroMatricula, domicilio, localidad, nroCasillero });
    const response = await http(config)
      .then((response) => {
        const { status } = response;
        return { ok: status == 200 || status === 201 };
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          return { ok: false, error: data.message };
        } else {
          let status = err.response ? err.response.status : "inesperado";
          return { ok: false, error: `Error ${status} al intentar crear el registro.` };
        }
      });
    return response;
  }

  async update({id, nombre, nroMatricula, domicilio, localidad, nroCasillero}) {
    const config = this.config.update({ id, nombre, nroMatricula, domicilio, localidad, nroCasillero });
    const response = await http(config)
      .then((response) => {
        const { status } = response;
        return { ok: status == 200 || status === 201 };
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          return { ok: false, error: data.message };
        } else {
          let status = err.response ? err.response.status : "inesperado";
          return { ok: false, error: `Error ${status} al intentar actualizar el registro.` };
        }
      });
    return response;
  }

  async get(id) {
    const config = this.config.get(id);
    const response = await http(config)
      .then((response) => {
        const { data } = response;
        return { ok: true, data };
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          return { ok: false, error: data };
        } else {
          let status = err.response ? err.response.status : "inesperado";
          return { ok: false, error: `Error ${status} al consultar los datos.` };
        }
      });
    return response;
  }
}

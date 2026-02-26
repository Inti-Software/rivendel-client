import { http } from "./http";

export class HttpRepository {
  constructor(configuration) {
    this.config = configuration;
  }

  async request(config) {
    try {
      const response = await http(config);
      return { ok: true, data: response.data, status: response.status };
    } catch (err) {
      const status = err.response?.status ?? "inesperado";
      const message =
        err.response?.data?.message ??
        `Error ${status} al procesar la solicitud.`;

      return {
        ok: false,
        error: message,
        status,
      };
    }
  }

  async findAll(query, currentPage, recordsPerPage) {
    const config = this.config.findAll({query, currentPage, recordsPerPage});
    const result = await this.request(config);

    if (!result.ok) {
      return { data: null, totalPages: 0, error: result.error };
    }

    const totalRecords = result.data.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    return {
      data: result.data.data || result.data,
      totalPages,
      error: null,
    };
  }
  
  async delete(id) {
    return await this.request(this.config.delete(id));
  }

  async create(payload) {
    return await this.request(this.config.create(payload));
  }

  async update(payload) {
    return await this.request(this.config.update(payload));
  }
  async get(id) {
    const result = await this.request(this.config.get(id));
    if (!result.ok) return result;
    return { ok: true, data: result.data };
  }
}

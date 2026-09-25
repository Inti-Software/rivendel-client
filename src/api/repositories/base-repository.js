import { authHttp } from "../http";
import { RECORDS_PER_PAGE } from "../constants";

export default class BaseRepository {
  constructor(configuration) {
    this.config = configuration;
  }

  request = async (config) => {
    try {
      const response = await authHttp(config);
      return { ok: true, data: response.data, status: response.status };
    } catch (err) {
      const { status } = err.response || { status: "inesperado" };
      const message =
        err.response?.data?.message ??
        [`Error ${status} al procesar la solicitud.`];
      return { ok: false, error: message, status };
    }
  }

  findAll = async (params = {}) => {
    const config = this.config.findAll(params);
    const result = await this.request(config);

    if (!result.ok) {
      return { ...result, data: [], totalPages: 0 };
    }

    const totalRecords = result.data.totalRecords || 0;
    const recordsPerPage = params.recordsPerPage || RECORDS_PER_PAGE;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    return { ...result, data: { data: result.data.data || result.data, totalPages } };
  }

  delete = async (id) => {
    return await this.request(this.config.delete(id));
  }

  create = async (payload) => {
    return await this.request(this.config.create(payload));
  }

  update = async (payload) => {
    return await this.request(this.config.update(payload));
  }

  get = async (id) => {
    const result = await this.request(this.config.get(id));
    if (!result.ok) return result;
    return { ...result, data: result.data };
  }
}

import { beforeEach, describe, expect, it, vi } from "vitest";
import BaseRepository from "./base-repository.js";
import { authHttp } from "../http.js";

vi.mock("../http.js", () => ({
  authHttp: vi.fn(),
}));

const createRepository = () =>
  new BaseRepository({
    findAll: vi.fn((params) => ({ method: "get", url: "/records", params })),
    get: vi.fn((id) => ({ method: "get", url: `/records/${id}` })),
    create: vi.fn((payload) => ({ method: "post", url: "/records", data: payload })),
    update: vi.fn((payload) => ({ method: "patch", url: "/records/1", data: payload })),
    delete: vi.fn((id) => ({ method: "delete", url: `/records/${id}` })),
  });

describe("BaseRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve datos y status cuando request tiene éxito", async () => {
    const repository = createRepository();
    authHttp.mockResolvedValue({ data: { id: 1 }, status: 200 });

    await expect(repository.request({ method: "get", url: "/records" })).resolves.toEqual({
      ok: true,
      data: { id: 1 },
      status: 200,
    });
  });

  it("normaliza errores HTTP con mensaje y status", async () => {
    const repository = createRepository();
    authHttp.mockRejectedValue({
      response: { status: 422, data: { message: "Datos inválidos" } },
    });

    await expect(repository.request({ method: "post" })).resolves.toEqual({
      ok: false,
      error: "Datos inválidos",
      status: 422,
    });
  });

  it("normaliza errores inesperados sin response", async () => {
    const repository = createRepository();
    authHttp.mockRejectedValue(new Error("Network error"));

    await expect(repository.request({ method: "get" })).resolves.toEqual({
      ok: false,
      error: ["Error inesperado al procesar la solicitud."],
      status: "inesperado",
    });
  });

  it("calcula páginas y normaliza la respuesta de findAll", async () => {
    const repository = createRepository();
    authHttp.mockResolvedValue({
      status: 200,
      data: {
        totalRecords: 31,
        data: [{ id: 1 }, { id: 2 }],
      },
    });

    await expect(repository.findAll({ recordsPerPage: 15 })).resolves.toEqual({
      ok: true,
      status: 200,
      data: {
        data: [{ id: 1 }, { id: 2 }],
        totalPages: 3,
      },
    });
  });

  it("calcula páginas usando la cantidad de registros por página por defecto", async () => {
    const repository = new BaseRepository({
      findAll: (params) => ({ method: "get", url: "/records", params }),
    });
    authHttp.mockResolvedValue({
      status: 200,
      data: { totalRecords: 31, data: [{ id: 1 }] },
    });

    await expect(repository.findAll()).resolves.toMatchObject({
      ok: true,
      data: {
        data: [{ id: 1 }],
        totalPages: 3,
      },
    });
  });

  it("devuelve una colección vacía cuando findAll falla", async () => {
    const repository = createRepository();
    authHttp.mockRejectedValue({ response: { status: 500 } });

    await expect(repository.findAll({ recordsPerPage: 15 })).resolves.toEqual({
      ok: false,
      error: ["Error 500 al procesar la solicitud."],
      status: 500,
      data: [],
      totalPages: 0,
    });
  });

  it("delega get, create, update y delete en sus configuraciones", async () => {
    const repository = createRepository();
    authHttp.mockResolvedValue({ data: { ok: true }, status: 200 });

    await repository.get(7);
    await repository.create({ nombre: "Ana" });
    await repository.update({ id: 1, nombre: "Ana actualizada" });
    await repository.delete(7);

    expect(authHttp).toHaveBeenNthCalledWith(1, { method: "get", url: "/records/7" });
    expect(authHttp).toHaveBeenNthCalledWith(2, {
      method: "post",
      url: "/records",
      data: { nombre: "Ana" },
    });
    expect(authHttp).toHaveBeenNthCalledWith(3, {
      method: "patch",
      url: "/records/1",
      data: { id: 1, nombre: "Ana actualizada" },
    });
    expect(authHttp).toHaveBeenNthCalledWith(4, { method: "delete", url: "/records/7" });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Form from "./Form.jsx";
import { handleSubmit } from "../eventHandlers.js";
import { Partes } from "../../../api/repositories/partes.js";
import { TiposDocumento } from "../../../api/repositories/tipos-documentos.js";

vi.mock("../../../api/repositories/partes.js", () => ({
  Partes: {
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../../../api/repositories/tipos-documentos.js", () => ({
  TiposDocumento: {
    findAll: vi.fn(),
  },
}));

const renderForm = (initialPath = "/partes/new") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/partes" element={<div>Listado de partes</div>} />
        <Route path="/partes/new" element={<Form />} />
        <Route path="/partes/edit/:id" element={<Form />} />
      </Routes>
    </MemoryRouter>
  );

const getById = (id) => document.getElementById(id);

const fillValidForm = ({
  nombre = "Juan Pérez",
  nroDocumento = "12345678",
  cuil = "20123456789",
  domicilio = "Calle Falsa 123",
  localidad = "Rosario",
} = {}) => {
  fireEvent.change(getById("nombre"), {
    target: { id: "nombre", value: nombre },
  });
  fireEvent.change(getById("nroDocumento"), {
    target: { id: "nroDocumento", value: nroDocumento },
  });
  fireEvent.change(getById("cuil"), {
    target: { id: "cuil", value: cuil },
  });
  fireEvent.change(getById("domicilio"), {
    target: { id: "domicilio", value: domicilio },
  });
  fireEvent.change(getById("localidad"), {
    target: { id: "localidad", value: localidad },
  });
};

describe("<Form /> (Partes)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    TiposDocumento.findAll.mockResolvedValue({
      ok: true,
      data: {
        data: [
          { id: 1, descripcion: "DNI" },
          { id: 2, descripcion: "CUIT" },
        ],
      },
    });
  });

  it("renderiza el formulario en modo nuevo", async () => {
    renderForm();

    expect(screen.getByRole("heading", { name: /nueva parte/i })).toBeInTheDocument();
    expect(getById("nombre")).toBeInTheDocument();
    expect(getById("nroDocumento")).toBeInTheDocument();
    expect(getById("cuil")).toBeInTheDocument();
    expect(getById("domicilio")).toBeInTheDocument();
    expect(getById("localidad")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /grabar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancelar/i })).toHaveAttribute("href", "/partes");

    await waitFor(() => {
      expect(TiposDocumento.findAll).toHaveBeenCalledTimes(1);
    });
  });

  it("valida el submit y dispara errores cuando faltan datos obligatorios", async () => {
    const dispatch = vi.fn();
    const navigate = vi.fn();

    await handleSubmit(
      { preventDefault: vi.fn() },
      {
        id: 0,
        nombre: "    ",
        idTipoDocumento: 1,
        nroDocumento: "",
        cuil: "",
        domicilio: "",
        localidad: "",
        patrocinante: { id: 0, nombre: "", nroMatricula: 0 },
        esApoderado: false,
        loading: false,
        errors: [],
        isUpdate: false,
        enableCuil: true,
      },
      dispatch,
      navigate
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_ERRORS",
      errors: [
        "Ingrese un nombre.",
        "Ingrese un número de documento válido.",
        "Ingrese un cuil válido.",
      ],
    });
    expect(Partes.create).not.toHaveBeenCalled();
    expect(Partes.update).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("crea una parte cuando el formulario es válido", async () => {
    Partes.create.mockResolvedValue({ ok: true });

    renderForm();
    await waitFor(() => expect(TiposDocumento.findAll).toHaveBeenCalledTimes(1));

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /grabar/i }));

    await waitFor(() => expect(Partes.create).toHaveBeenCalledTimes(1));
    expect(Partes.create).toHaveBeenCalledWith({
      id: 0,
      nombre: "Juan Pérez",
      idTipoDocumento: 1,
      nroDocumento: "12345678",
      cuil: "20123456789",
      domicilio: "Calle Falsa 123",
      localidad: "Rosario",
      idPatrocinante: 0,
      esApoderado: false,
    });
  });

  it("carga una parte existente y la actualiza en modo edición", async () => {
    Partes.get.mockResolvedValue({
      ok: true,
      data: {
        id: 9,
        nombre: "María García",
        idTipoDocumento: 2,
        nroDocumento: "22333444",
        cuil: "27222333444",
        domicilio: "Av. Siempre Viva 742",
        localidad: "Córdoba",
        esApoderado: true,
        patrocinante: { id: 5, nombre: "Luis Gómez", nroMatricula: 50 },
      },
    });
    Partes.update.mockResolvedValue({ ok: true });

    renderForm("/partes/edit/9");

    await waitFor(() => {
      expect(screen.getByDisplayValue("María García")).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: /edición de parte/i })).toBeInTheDocument();

    fireEvent.change(getById("nombre"), {
      target: { id: "nombre", value: "María García Actualizada" },
    });
    fireEvent.click(screen.getByRole("button", { name: /grabar/i }));

    await waitFor(() => expect(Partes.update).toHaveBeenCalledTimes(1));
    expect(Partes.update).toHaveBeenCalledWith({
      id: 9,
      nombre: "María García Actualizada",
      idTipoDocumento: 2,
      nroDocumento: "22333444",
      cuil: "27222333444",
      domicilio: "Av. Siempre Viva 742",
      localidad: "Córdoba",
      idPatrocinante: 5,
      esApoderado: true,
    });
  });

  it("muestra el error que devuelve el backend si falla el guardado", async () => {
    Partes.create.mockResolvedValue({
      ok: false,
      error: "No se pudo guardar la parte",
    });

    renderForm();
    fillValidForm({ nombre: "Nueva parte", nroDocumento: "11111111", cuil: "20111111111", domicilio: "Paseo 1", localidad: "La Plata" });

    fireEvent.click(screen.getByRole("button", { name: /grabar/i }));

    await waitFor(() => {
      expect(screen.getByText("No se pudo guardar la parte")).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Form from "./Form.jsx";
import useForm from "../hooks/useForm.js";
import { handleSubmit } from "../eventHandlers.js";
import { Patrocinantes } from "../../../api/repositories/patrocinantes.js";

vi.mock("../../../api/repositories/patrocinantes.js", () => ({
  Patrocinantes: {
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

const renderForm = (initialPath = "/patrocinantes/new") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/patrocinantes" element={<div>Listado de patrocinantes</div>} />
        <Route path="/patrocinantes/new" element={<Form />} />
        <Route path="/patrocinantes/edit/:id" element={<Form />} />
      </Routes>
    </MemoryRouter>
  );

const fillForm = ({
  nombre = "Ana López",
  nroMatricula = "123",
  domicilio = "Calle Falsa 123",
  localidad = "Rosario",
  nroCasillero = "15",
} = {}) => {
  fireEvent.change(screen.getByLabelText(/nombre/i), {
    target: { id: "nombre", value: nombre },
  });
  fireEvent.change(screen.getByLabelText(/matrícula/i), {
    target: { id: "nroMatricula", value: nroMatricula },
  });
  fireEvent.change(screen.getByLabelText(/domicilio/i), {
    target: { id: "domicilio", value: domicilio },
  });
  fireEvent.change(screen.getByLabelText(/localidad/i), {
    target: { id: "localidad", value: localidad },
  });
  fireEvent.change(screen.getByLabelText(/casillero/i), {
    target: { id: "nroCasillero", value: nroCasillero },
  });
};

const HookHarness = () => {
  const { state } = useForm();

  return (
    <div>
      <span data-testid="hook-id">{String(state.id)}</span>
      <span data-testid="hook-nombre">{state.nombre}</span>
      <span data-testid="hook-matricula">{String(state.nroMatricula)}</span>
      <span data-testid="hook-localidad">{state.localidad}</span>
    </div>
  );
};

describe("<Form /> (Patrocinantes)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el formulario en modo nuevo", () => {
    renderForm();

    expect(screen.getByRole("heading", { name: /nuevo patrocinante/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/matrícula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/domicilio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/localidad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/casillero/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /grabar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancelar/i })).toHaveAttribute("href", "/patrocinantes");
  });

  it("valida el submit y no llama al backend si falta el nombre", async () => {
    const dispatch = vi.fn();
    const navigate = vi.fn();

    await handleSubmit(
      { preventDefault: vi.fn() },
      {
        id: 0,
        nombre: "   ",
        nroMatricula: 0,
        domicilio: "",
        localidad: "",
        nroCasillero: 0,
        loading: false,
        errors: [],
      },
      dispatch,
      navigate
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_ERRORS",
      errors: ["Ingrese el nombre del patrocinante"],
    });
    expect(Patrocinantes.create).not.toHaveBeenCalled();
    expect(Patrocinantes.update).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("crea un patrocinante cuando se envía el formulario con datos válidos", async () => {
    Patrocinantes.create.mockResolvedValue({ ok: true });

    renderForm();
    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /grabar/i }));

    await waitFor(() => {
      expect(Patrocinantes.create).toHaveBeenCalledTimes(1);
    });

    expect(Patrocinantes.create).toHaveBeenCalledWith({
      id: 0,
      nombre: "Ana López",
      nroMatricula: "123",
      domicilio: "Calle Falsa 123",
      localidad: "Rosario",
      nroCasillero: "15",
    });
  });

  it("carga y actualiza un patrocinante existente en modo edición", async () => {
    Patrocinantes.get.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        nombre: "Juan Pérez",
        nroMatricula: 456,
        domicilio: "Av. Siempre Viva 742",
        localidad: "Santiago del Estero",
        nroCasillero: 99,
      },
    });
    Patrocinantes.update.mockResolvedValue({ ok: true });

    renderForm("/patrocinantes/edit/7");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Juan Pérez")).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: /edición de patrocinante/i })).toBeInTheDocument();

    fillForm({
      nombre: "Juan Pérez Actualizado",
      nroMatricula: "999",
      domicilio: "Avenida de la Plata 10",
      localidad: "Mendoza",
      nroCasillero: "42",
    });

    fireEvent.click(screen.getByRole("button", { name: /grabar/i }));

    await waitFor(() => {
      expect(Patrocinantes.update).toHaveBeenCalledTimes(1);
    });

    expect(Patrocinantes.update).toHaveBeenCalledWith({
      id: 7,
      nombre: "Juan Pérez Actualizado",
      nroMatricula: "999",
      domicilio: "Avenida de la Plata 10",
      localidad: "Mendoza",
      nroCasillero: "42",
    });
  });

  it("carga los datos del hook useForm desde la ruta de edición", async () => {
    Patrocinantes.get.mockResolvedValue({
      ok: true,
      data: {
        id: 12,
        nombre: "María García",
        nroMatricula: 321,
        domicilio: "San Martín 90",
        localidad: "Córdoba",
        nroCasillero: 7,
      },
    });

    render(
      <MemoryRouter initialEntries={["/patrocinantes/edit/12"]}>
        <Routes>
          <Route path="/patrocinantes/edit/:id" element={<HookHarness />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("hook-id")).toHaveTextContent("12");
      expect(screen.getByTestId("hook-nombre")).toHaveTextContent("María García");
      expect(screen.getByTestId("hook-matricula")).toHaveTextContent("321");
      expect(screen.getByTestId("hook-localidad")).toHaveTextContent("Córdoba");
    });

    expect(Patrocinantes.get).toHaveBeenCalledWith("12");
  });

  it("muestra un error en la UI cuando el backend responde con fallo", async () => {
    Patrocinantes.create.mockResolvedValue({
      ok: false,
      error: "No se pudo guardar el patrocinante",
    });

    renderForm();
    fillForm({ nombre: "Patrocinante error" });

    fireEvent.click(screen.getByRole("button", { name: /grabar/i }));

    await waitFor(() => {
      expect(screen.getByText("No se pudo guardar el patrocinante")).toBeInTheDocument();
    });
  });
});

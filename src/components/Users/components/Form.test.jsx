import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Form from "./Form.jsx";
import { Users } from "../../../api/repositories/users.js";
import { setCalendarConnected } from "../../../stores/calendar.js";

vi.mock("../../../api/repositories/users.js", () => ({
  Users: {
    get: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../../GoogleCalendar/components/Button", () => ({
  Button: () => <button type="button">Google Calendar</button>,
}));

const renderForm = () =>
  render(
    <MemoryRouter initialEntries={["/users"]}>
      <Routes>
        <Route path="/users" element={<Form />} />
        <Route path="/" element={<div>Inicio</div>} />
        <Route path="/reclamos" element={<div>Reclamos</div>} />
      </Routes>
    </MemoryRouter>
  );

const fillRequiredFields = ({ nombre = "Ana López", nroHabilitacion = "123" } = {}) => {
  fireEvent.change(document.getElementById("nombre"), {
    target: { id: "nombre", value: nombre },
  });
  fireEvent.change(document.getElementById("nroHabilitacion"), {
    target: { id: "nroHabilitacion", value: nroHabilitacion },
  });
};

describe("<Form /> (Users)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCalendarConnected(false);
    Users.get.mockResolvedValue({
      ok: true,
      data: {
        nombre: "Usuario actual",
        nroHabilitacion: 10,
        googleCalendarConnected: false,
      },
    });
  });

  it("renderiza los datos de configuración y el estado desconectado de Calendar", async () => {
    renderForm();

    expect(screen.getByRole("heading", { name: "Configuración" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nº Habilitación/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña actual")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Nueva contraseña")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Repita la nueva contraseña")).toHaveAttribute("type", "password");
    expect(screen.getByText("Conecta tu calendario para sincronizar eventos.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Google Calendar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancelar/i })).toHaveAttribute("href", "/");

    await waitFor(() => {
      expect(Users.get).toHaveBeenCalledWith(undefined);
      expect(screen.getByDisplayValue("Usuario actual")).toBeInTheDocument();
      expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    });
  });

  it("muestra el estado conectado cuando el usuario tiene Calendar conectado", async () => {
    setCalendarConnected(true);
    Users.get.mockResolvedValue({
      ok: true,
      data: {
        nombre: "Usuario conectado",
        nroHabilitacion: 20,
        googleCalendarConnected: true,
      },
    });

    renderForm();

    await waitFor(() => {
      expect(screen.getByText("Tu calendario está conectado para sincronizar eventos.")).toBeInTheDocument();
    });
  });

  it("actualiza los campos de configuración y limpia errores previos", async () => {
    renderForm();

    await waitFor(() => expect(screen.getByDisplayValue("Usuario actual")).toBeInTheDocument());

    fireEvent.change(document.getElementById("nombre"), {
      target: { id: "nombre", value: "Nuevo nombre" },
    });
    fireEvent.change(document.getElementById("password"), {
      target: { id: "password", value: "actual" },
    });

    expect(screen.getByDisplayValue("Nuevo nombre")).toBeInTheDocument();
    expect(screen.getByDisplayValue("actual")).toBeInTheDocument();
  });

  it("guarda la configuración con todos los datos de contraseña", async () => {
    Users.update.mockResolvedValue({ ok: true });
    renderForm();
    await waitFor(() => expect(screen.getByDisplayValue("Usuario actual")).toBeInTheDocument());

    fillRequiredFields({ nombre: "Nombre actualizado", nroHabilitacion: "99" });
    fireEvent.change(document.getElementById("password"), {
      target: { id: "password", value: "actual" },
    });
    fireEvent.change(document.getElementById("newPassword"), {
      target: { id: "newPassword", value: "nueva" },
    });
    fireEvent.change(document.getElementById("newPasswordRepeated"), {
      target: { id: "newPasswordRepeated", value: "nueva" },
    });
    fireEvent.click(screen.getByRole("button", { name: /grabar/i }));

    await waitFor(() => expect(Users.update).toHaveBeenCalledTimes(1));
    expect(Users.update).toHaveBeenCalledWith({
      nombre: "Nombre actualizado",
      nroHabilitacion: "99",
      currentPassword: "actual",
      newPassword: "nueva",
      passwordConfirmation: "nueva",
    });
  });

  it("muestra un error de backend al guardar", async () => {
    Users.update.mockResolvedValue({ ok: false, error: "No se pudo actualizar" });
    renderForm();
    await waitFor(() => expect(screen.getByDisplayValue("Usuario actual")).toBeInTheDocument());

    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /grabar/i }));

    await waitFor(() => expect(screen.getByText("No se pudo actualizar")).toBeInTheDocument());
  });

  it("muestra el error de carga inicial", async () => {
    Users.get.mockResolvedValue({ ok: false, error: "No se pudo cargar el usuario" });

    renderForm();

    await waitFor(() => expect(screen.getByText("No se pudo cargar el usuario")).toBeInTheDocument());
  });
});

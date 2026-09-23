import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useForm from "./useForm.js";
import { setToken } from "../../../dtos/token.js";

vi.mock("../../../auth/auth.service.js", () => ({
  setAuthData: vi.fn(),
}));

const HookHarness = () => {
  const { state, dispatch, setField } = useForm();

  return (
    <div>
      <span data-testid="email">{state.email}</span>
      <span data-testid="redirect">{String(state.redirect)}</span>
      <span data-testid="loading">{String(state.loading)}</span>
      <input id="email" onChange={setField} />
      <button onClick={() => dispatch({ type: "TOGGLE_SHOW_PASSWORD" })}>toggle</button>
      <button onClick={() => dispatch({ type: "SUBMIT_START" })}>start</button>
      <button onClick={() => dispatch({ type: "SUBMIT_FAIL", error: "Error" })}>fail</button>
    </div>
  );
};

describe("useForm (Login)", () => {
  beforeEach(() => {
    setToken(null);
  });

  it("inicializa la sesión sin redirección cuando no hay token", async () => {
    render(<HookHarness />);

    await waitFor(() => expect(screen.getByTestId("redirect")).toHaveTextContent("false"));
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("redirecciona si ya existe un token", async () => {
    setToken("token-existente");
    render(<HookHarness />);

    await waitFor(() => expect(screen.getByTestId("redirect")).toHaveTextContent("true"));
  });

  it("actualiza un campo y limpia errores al escribir", async () => {
    render(<HookHarness />);

    fireEvent.click(screen.getByRole("button", { name: "fail" }));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { id: "email", value: "ana@example.com" },
    });

    expect(screen.getByTestId("email")).toHaveTextContent("ana@example.com");
  });

  it("actualiza el estado de carga al iniciar el submit", () => {
    render(<HookHarness />);

    fireEvent.click(screen.getByRole("button", { name: "start" }));

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });
});

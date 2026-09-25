import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useApi } from "./useApi.js";

const HookHarness = ({ repositoryMethod }) => {
  const { data, loading, error, execute, setData } = useApi(repositoryMethod);

  return (
    <div>
      <span data-testid="data">{JSON.stringify(data)}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="error">{error ?? ""}</span>
      <button onClick={() => execute({ query: "ana" })}>ejecutar</button>
      <button onClick={() => setData({ value: "manual" })}>set data</button>
    </div>
  );
};

describe("useApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("guarda los datos y finaliza loading cuando la API responde correctamente", async () => {
    const repositoryMethod = vi.fn().mockResolvedValue({ ok: true, data: { items: [1] } });
    render(<HookHarness repositoryMethod={repositoryMethod} />);

    fireEvent.click(screen.getByRole("button", { name: "ejecutar" }));

    await waitFor(() => expect(repositoryMethod).toHaveBeenCalledWith({ query: "ana" }));
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));

    expect(screen.getByTestId("data")).toHaveTextContent('{"items":[1]}');
    expect(screen.getByTestId("error")).toHaveTextContent("");
  });

  it("guarda el error cuando la API responde ok false", async () => {
    const repositoryMethod = vi.fn().mockResolvedValue({ ok: false, error: "No autorizado" });
    render(<HookHarness repositoryMethod={repositoryMethod} />);

    fireEvent.click(screen.getByRole("button", { name: "ejecutar" }));

    await waitFor(() => expect(screen.getByTestId("error")).toHaveTextContent("No autorizado"));
    expect(screen.getByTestId("data")).toHaveTextContent("null");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("convierte excepciones inesperadas en un error estable", async () => {
    const repositoryMethod = vi.fn().mockRejectedValue(new Error("Network error"));
    render(<HookHarness repositoryMethod={repositoryMethod} />);

    fireEvent.click(screen.getByRole("button", { name: "ejecutar" }));

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Ocurrió un error inesperado");
    });
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("permite actualizar los datos manualmente", () => {
    const repositoryMethod = vi.fn();
    render(<HookHarness repositoryMethod={repositoryMethod} />);

    fireEvent.click(screen.getByRole("button", { name: "set data" }));

    expect(screen.getByTestId("data")).toHaveTextContent('{"value":"manual"}');
  });
});

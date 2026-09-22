import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useSearchDialog from "./useSearchDialog.js";

const HookHarness = ({ searchFn, options = {}, termToSet = "  ana  " }) => {
  const state = useSearchDialog(searchFn, null, options);

  return (
    <div>
      <span data-testid="term">{state.term}</span>
      <span data-testid="count">{state.data.length}</span>
      <span data-testid="selected">{state.selected?.name ?? "none"}</span>
      <span data-testid="done">{String(state.done)}</span>
      <span data-testid="loading">{String(state.loading)}</span>
      <span data-testid="error">{state.error}</span>
      <button onClick={() => state.setTerm(termToSet)}>set term</button>
      <button onClick={() => state.buscar()}>search</button>
      <button onClick={() => state.selectRow(2)}>select</button>
    </div>
  );
};

describe("useSearchDialog", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("no busca términos menores a la longitud mínima", async () => {
    const searchFn = vi.fn();
    render(
      <HookHarness
        searchFn={searchFn}
        termToSet=" an "
        options={{ debounceMs: 10 }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "set term" }));
    await act(async () => vi.advanceTimersByTime(20));

    expect(searchFn).not.toHaveBeenCalled();
  });

  it("busca automáticamente con debounce y permite seleccionar un resultado", async () => {
    const searchFn = vi.fn().mockResolvedValue({
      ok: true,
      data: { data: [{ id: 1, name: "Ana" }, { id: 2, name: "Luis" }] },
    });
    render(
      <HookHarness searchFn={searchFn} options={{ debounceMs: 10 }} />
    );

    fireEvent.click(screen.getByRole("button", { name: "set term" }));
    await act(async () => {
      vi.advanceTimersByTime(20);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(searchFn).toHaveBeenCalledWith("ana");
    expect(screen.getByTestId("done")).toHaveTextContent("true");

    fireEvent.click(screen.getByRole("button", { name: "select" }));
    expect(screen.getByTestId("selected")).toHaveTextContent("Luis");
  });

  it("ejecuta la búsqueda manual con el término actual", async () => {
    const searchFn = vi.fn().mockResolvedValue({ ok: true, data: { data: [] } });
    render(
      <HookHarness searchFn={searchFn} options={{ debounceMs: 1000 }} />
    );

    fireEvent.click(screen.getByRole("button", { name: "set term" }));
    fireEvent.click(screen.getByRole("button", { name: "search" }));

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(searchFn).toHaveBeenCalledWith("ana");
  });

  it("expone un mensaje estable cuando falla la búsqueda", async () => {
    const searchFn = vi.fn().mockResolvedValue({ ok: false, error: "500" });
    render(
      <HookHarness searchFn={searchFn} options={{ debounceMs: 10 }} />
    );

    fireEvent.click(screen.getByRole("button", { name: "set term" }));
    await act(async () => {
      vi.advanceTimersByTime(20);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByTestId("error")).toHaveTextContent(
      "Ocurrió un error al realizar la búsqueda. Por favor, inténtelo de nuevo."
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });
});

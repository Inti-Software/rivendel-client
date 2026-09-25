import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { GridDeleteButton, GridEditButton, GridPrintButton } from "./GridButtons.jsx";

describe("GridButtons", () => {
  it("renderiza el enlace de edición con su ruta", () => {
    render(
      <MemoryRouter>
        <GridEditButton path="/partes/edit/7" />
      </MemoryRouter>
    );

    expect(screen.getByTitle("Editar")).toHaveAttribute("href", "/partes/edit/7");
  });

  it("ejecuta onDelete y conserva la ruta del enlace", () => {
    const onDelete = vi.fn();
    render(
      <MemoryRouter>
        <GridDeleteButton path="/partes/delete/7" onDelete={onDelete} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTitle("Eliminar"));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.getByTitle("Eliminar")).toHaveAttribute("href", "/partes/delete/7");
  });

  it("renderiza el enlace de impresión con target de nueva pestaña", () => {
    const onClick = vi.fn();
    render(
      <MemoryRouter>
        <GridPrintButton path="/reclamos/acta/5" onClick={onClick} />
      </MemoryRouter>
    );

    const button = screen.getByTitle("Imprimir");
    fireEvent.click(button);

    expect(button).toHaveAttribute("href", "/reclamos/acta/5");
    expect(button).toHaveAttribute("target", "__blank");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

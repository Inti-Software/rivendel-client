import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DeleteDialog from "./DeleteDialog.jsx";

describe("<DeleteDialog />", () => {
  it("muestra el mensaje y ejecuta eliminar", () => {
    const handleDelete = vi.fn();
    const handleCancel = vi.fn();

    render(
      <DeleteDialog
        deleteMessage="¿Eliminar este registro?"
        handleDelete={handleDelete}
        handleCancel={handleCancel}
      />
    );

    expect(screen.getByText("Confirmar eliminación")).toBeInTheDocument();
    expect(screen.getByText("¿Eliminar este registro?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it("ejecuta cancelar sin eliminar", () => {
    const handleDelete = vi.fn();
    const handleCancel = vi.fn();

    render(
      <DeleteDialog
        deleteMessage="Mensaje"
        handleDelete={handleDelete}
        handleCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleDelete).not.toHaveBeenCalled();
  });
});

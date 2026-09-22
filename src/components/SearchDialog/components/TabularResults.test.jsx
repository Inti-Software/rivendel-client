import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import TabularResults from "./TabularResults.jsx";

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "documento", label: "Documento" },
];

const data = [
  { id: 1, nombre: "Ana", documento: "123" },
  { id: 2, nombre: "Luis", documento: "456" },
];

describe("<TabularResults />", () => {
  it("renderiza encabezados y datos", () => {
    render(
      <TabularResults
        columns={columns}
        data={data}
        selectedId={null}
        selectRow={vi.fn()}
      />
    );

    expect(screen.getByRole("columnheader", { name: "Nombre" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Documento" })).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("456")).toBeInTheDocument();
  });

  it("selecciona una fila al hacer click y marca la fila seleccionada", () => {
    const selectRow = vi.fn();
    const { container } = render(
      <TabularResults columns={columns} data={data} selectedId={2} selectRow={selectRow} />
    );

    const rows = container.querySelectorAll("tbody tr");
    fireEvent.click(rows[0]);
    fireEvent.click(rows[1]);

    expect(selectRow).toHaveBeenNthCalledWith(1, 1);
    expect(selectRow).toHaveBeenNthCalledWith(2, 2);
    expect(rows[1].querySelector("td")).toHaveClass("bg-warning-subtle");
    expect(rows[0].querySelector("td")).not.toHaveClass("bg-warning-subtle");
  });
});

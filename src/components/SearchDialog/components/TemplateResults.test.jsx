import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import TemplateResults from "./TemplateResults.jsx";

describe("<TemplateResults />", () => {
  it("renderiza cada fila usando el template recibido", () => {
    const selectRow = vi.fn();
    const template = (row, isSelected, select) => (
      <tr
        key={row.id}
        onClick={() => select(row.id)}
        data-selected={String(isSelected)}
      >
        <td>{row.nombre}</td>
      </tr>
    );

    render(
      <TemplateResults
        template={template}
        data={[
          { id: 1, nombre: "Ana" },
          { id: 2, nombre: "Luis" },
        ]}
        selectedId={2}
        selectRow={selectRow}
      />
    );

    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Luis").closest("tr")).toHaveAttribute("data-selected", "true");
    fireEvent.click(screen.getByText("Ana"));
    expect(selectRow).toHaveBeenCalledWith(1);
  });
});

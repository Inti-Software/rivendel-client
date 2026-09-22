import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Content from "./Content.jsx";

const data = [{ id: 1, nombre: "Ana" }];

const template = (row) => (
  <tr key={row.id}>
    <td>{row.nombre}</td>
  </tr>
);

describe("<Content />", () => {
  it("no renderiza contenido cuando aún no terminó la búsqueda", () => {
    const { container } = render(
      <Content data={[]} visible={false} emptyMessage="Vacío" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza resultados tabulares cuando recibe columnas", () => {
    render(
      <Content
        data={data}
        columns={[{ key: "nombre", label: "Nombre" }]}
        visible
        selectedId={null}
        selectRow={() => {}}
      />
    );

    expect(screen.getByRole("columnheader", { name: "Nombre" })).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("renderiza resultados con template cuando no recibe columnas", () => {
    render(
      <Content
        data={data}
        template={template}
        visible
        selectedId={null}
        selectRow={() => {}}
      />
    );

    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("muestra el mensaje de error o vacío cuando no hay resultados", () => {
    render(
      <Content
        data={[]}
        visible
        error="Error de búsqueda"
        emptyMessage="Vacío"
      />
    );

    expect(screen.getByText("Error de búsqueda")).toBeInTheDocument();
  });
});

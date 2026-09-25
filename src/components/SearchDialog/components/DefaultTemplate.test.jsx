import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DefaultTemplate from "./DefaultTemplate.jsx";

describe("<DefaultTemplate />", () => {
  it("no renderiza el mensaje cuando no está visible", () => {
    const { container } = render(
      <DefaultTemplate visible={false} emptyMessage="Sin resultados" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el mensaje vacío y su clase visual", () => {
    render(
      <DefaultTemplate
        visible
        emptyMessage="Sin resultados"
        feedbackClassName="bg-warning-subtle"
      />
    );

    expect(screen.getByText("Sin resultados")).toHaveClass("bg-warning-subtle");
  });

  it("prioriza el error sobre el mensaje vacío", () => {
    render(
      <DefaultTemplate
        visible
        emptyMessage="Sin resultados"
        error="Falló la búsqueda"
      />
    );

    expect(screen.getByText("Falló la búsqueda")).toBeInTheDocument();
    expect(screen.queryByText("Sin resultados")).not.toBeInTheDocument();
  });
});

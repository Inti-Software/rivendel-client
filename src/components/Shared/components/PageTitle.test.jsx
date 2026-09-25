import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import PageTitle from "./PageTitle.jsx";

const renderPageTitle = (initialPath) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<PageTitle />} />
        <Route path="/reclamos/new" element={<PageTitle />} />
        <Route path="/reclamos/edit/:id" element={<PageTitle />} />
        <Route path="/patrocinantes" element={<PageTitle />} />
      </Routes>
    </MemoryRouter>
  );

describe("PageTitle", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("actualiza el título para la ruta principal", () => {
    renderPageTitle("/");

    expect(document.title).toBe("Inicio | Rivendel | Conciliaciones");
  });

  it("actualiza el título para una ruta de reclamo nuevo", () => {
    renderPageTitle("/reclamos/new");

    expect(document.title).toBe("Nuevo reclamo | Conciliaciones");
  });

  it("actualiza el título para una ruta de patrocinantes", () => {
    renderPageTitle("/patrocinantes");

    expect(document.title).toBe("Patrocinantes | Conciliaciones");
  });

  it("renderiza sin contenido visual", () => {
    renderPageTitle("/reclamos/edit/42");

    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });
});

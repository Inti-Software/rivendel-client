import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Contiene la lógica JS del modal
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ListTiposDocumentos from "./components/TiposDocumentos/List.jsx";
import NewTipoDocumento from "./components/TiposDocumentos/New.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import EditTipoDocumento from "./components/TiposDocumentos/Edit.jsx";
import ListPatrocinantes from "./components/Patrocinantes/List.jsx";
import ListPartes from "./components/Partes/List.jsx";
import NewParte from "./components/Partes/New.jsx";
import EditParte from "./components/Partes/Edit.jsx";
import ListResoluciones from "./components/Resoluciones/List.jsx";
import NewResolucion from "./components/Resoluciones/New.jsx";
import EditResolucion from "./components/Resoluciones/Edit.jsx";
import ListReclamos from "./components/Reclamos/List.jsx";
import Reporte from "./components/Reclamos/Reporte.jsx";
import LayoutRoutes from "./components/Layout/LayoutRoutes.jsx";
import ReclamosForm  from "./components/Reclamos/Form.jsx";
import PatrocinantesForm from "./components/Patrocinantes/Form.jsx";

const root = createRoot(document.getElementById("root"))
root.render(
  <StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/reclamos/reporte/:id" element={<Reporte root={root} />} />

          <Route element={<LayoutRoutes />}>
            <Route path="/" element={<App />} />
            <Route path="/tipos-documentos" element={<ListTiposDocumentos />} />
            <Route path="/tipos-documentos/new" element={<NewTipoDocumento />} />
            <Route path="/tipos-documentos/edit/:id" element={<EditTipoDocumento />} />
            <Route path="/patrocinantes" element={<ListPatrocinantes />} />
            <Route path="/patrocinantes/new" element={<PatrocinantesForm />} />
            <Route path="/patrocinantes/edit/:id" element={<PatrocinantesForm />} />
            <Route path="/partes" element={<ListPartes />} />
            <Route path="/partes/new" element={<NewParte />} />
            <Route path="/partes/edit/:id" element={<EditParte />} />
            <Route path="/resoluciones" element={<ListResoluciones />} />
            <Route path="/resoluciones/new" element={<NewResolucion />} />
            <Route path="/resoluciones/edit/:id" element={<EditResolucion />} />
            <Route path="/reclamos" element={<ListReclamos />} />
            <Route path="/reclamos/form" element={<ReclamosForm />} />
            <Route path="/reclamos/form/:id" element={<ReclamosForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  </StrictMode>
);

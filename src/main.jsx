import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Contiene la lógica JS del modal
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ListTiposDocumentos from "./components/TiposDocumentos/List.jsx";
import TipoDocumentoForm from "./components/TiposDocumentos/Form.jsx";
import NotificationProvider from "./contexts/NotificationProvider.jsx";
import ListPatrocinantes from "./components/Patrocinantes/List.jsx";
import ListPartes from "./components/Partes/List.jsx";
import ListResoluciones from "./components/Resoluciones/List.jsx";
import ResolucionesForm from "./components/Resoluciones/Form.jsx";
import ListReclamos from "./components/Reclamos/List.jsx";
import Reporte from "./components/Reclamos/Reporte.jsx";
import LayoutRoutes from "./components/Layout/LayoutRoutes.jsx";
import ReclamosForm  from "./components/Reclamos/Form.jsx";
import PatrocinantesForm from "./components/Patrocinantes/Form.jsx";
import PartesForm from "./components/Partes/Form.jsx";
import PageTitle from "./components/PageTitle/PageTitle.jsx";
import { setupInterceptors } from "./api/interceptors.js";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import { initializeAuth } from "./auth/auth.bootstrap.js";
import NotificationDisplay from "./components/Shared/NotificationDisplay.jsx";
import UserForm from "./components/Users/Form.jsx";

await initializeAuth();
setupInterceptors();
const root = createRoot(document.getElementById("root"))
root.render(
  <StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <PageTitle />
        <NotificationDisplay />
        <Routes>
            <Route path="/" element={<App />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/reclamos/reporte/:id" element={<Reporte root={root} />} />
              <Route element={<LayoutRoutes />}>
                <Route path="/user/form" element={<UserForm />} />
                
                <Route path="/tipos-documentos" element={<ListTiposDocumentos />} />
                <Route path="/tipos-documentos/new" element={<TipoDocumentoForm />} />
                <Route path="/tipos-documentos/edit/:id" element={<TipoDocumentoForm />} />

                <Route path="/patrocinantes" element={<ListPatrocinantes />} />
                <Route path="/patrocinantes/new" element={<PatrocinantesForm />} />
                <Route path="/patrocinantes/edit/:id" element={<PatrocinantesForm />} />
                
                <Route path="/partes" element={<ListPartes />} />
                <Route path="/partes/new" element={<PartesForm />} />
                <Route path="/partes/edit/:id" element={<PartesForm />} />

                <Route path="/resoluciones" element={<ListResoluciones />} />
                <Route path="/resoluciones/new" element={<ResolucionesForm />} />
                <Route path="/resoluciones/edit/:id" element={<ResolucionesForm />} />
                
                <Route path="/reclamos" element={<ListReclamos />} />
                <Route path="/reclamos/new" element={<ReclamosForm />} />
                <Route path="/reclamos/edit/:id" element={<ReclamosForm />} />
              </Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  </StrictMode>
);

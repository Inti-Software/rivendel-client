import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Contiene la lógica JS del modal
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import App from "./App.jsx";
import ListTiposDocumentos from "./components/TiposDocumentos/List.jsx";
import NewTipoDocumento from "./components/TiposDocumentos/New.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import EditTipoDocumento from "./components/TiposDocumentos/Edit.jsx";
import ListPatrocinantes from "./components/Patrocinantes/List.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/tipos-documentos" element={<ListTiposDocumentos />} />
            <Route path="/tipos-documentos/new" element={<NewTipoDocumento />} />
            <Route path="/tipos-documentos/edit/:id" element={<EditTipoDocumento />} />
            <Route path="/patrocinantes" element={<ListPatrocinantes />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </NotificationProvider>
  </StrictMode>
);

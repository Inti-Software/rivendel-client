import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import DataFetcher from "./components/TiposDocumentos/List.jsx";
import Layout from "./components/Layout/Layout.jsx";
import NewTipoDocumento from "./components/TiposDocumentos/New.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/tipos-documentos" element={<DataFetcher />} />
          <Route path="/tipos-documentos/new" element={<NewTipoDocumento />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>
);

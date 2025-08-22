import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import App from "./App.jsx";
import ListTiposDocumentos from "./components/TiposDocumentos/List.jsx";
import NewTipoDocumento from "./components/TiposDocumentos/New.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/tipos-documentos" element={<ListTiposDocumentos />} />
            <Route path="/tipos-documentos/new" element={<NewTipoDocumento />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </NotificationProvider>
  </StrictMode>
);

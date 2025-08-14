import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import DataFetcher from "./components/TiposDocumentos/List.jsx";
import Layout from "./components/Layout/Layout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/tiposdocumentos" element={<DataFetcher />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>
);

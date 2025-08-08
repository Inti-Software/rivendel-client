import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import DataFetcher from './components/TiposDocumentos/List.jsx' // Importa el componente

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tiposdocumentos" element={<DataFetcher />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

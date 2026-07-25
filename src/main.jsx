import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Contiene la lógica JS del modal
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutRoutes from './components/Layout/LayoutRoutes.jsx';
import PageTitle from './components/PageTitle/PageTitle.jsx';
import { setupInterceptors } from './api/interceptors.js';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import { initializeAuth } from './auth/auth.bootstrap.js';
import NotificationDisplay from './components/Shared/NotificationDisplay.jsx';
import App from './App.jsx';
import NotificationProvider from './contexts/NotificationProvider.jsx';
import ListPatrocinantes from './components/Patrocinantes/List.jsx';
import PatrocinantesForm from './components/Patrocinantes/Form.jsx';
import ListPartes from './components/Partes/List.jsx';
import PartesForm from './components/Partes/Form.jsx';
import ListReclamos from './components/Reclamos/components/List.jsx';
import ReclamosForm from './components/Reclamos/components/Form.jsx';
import UserForm from './components/Users/Form.jsx';
import { Callback as GoogleCalendarCallback } from './components/GoogleCalendar/components/Callback.jsx';
import { BackendStatusProvider } from './contexts/BackendStatusContext.jsx';
import { AppGate } from './components/Utils/AppGate.jsx';

await initializeAuth();
setupInterceptors();
dayjs.locale('es');
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BackendStatusProvider>
      <NotificationProvider>
        <BrowserRouter>
          <PageTitle />
          <NotificationDisplay />
          <AppGate>
            <Routes>
              <Route path="/" element={<App />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<LayoutRoutes />}>
                  <Route path="/user/form" element={<UserForm />} />

                  <Route path="/patrocinantes" element={<ListPatrocinantes />} />
                  <Route path="/patrocinantes/new" element={<PatrocinantesForm />} />
                  <Route path="/patrocinantes/edit/:id" element={<PatrocinantesForm />} />

                  <Route path="/partes" element={<ListPartes />} />
                  <Route path="/partes/new" element={<PartesForm />} />
                  <Route path="/partes/edit/:id" element={<PartesForm />} />

                  <Route path="/reclamos" element={<ListReclamos />} />
                  <Route path="/reclamos/new" element={<ReclamosForm />} />
                  <Route path="/reclamos/edit/:id" element={<ReclamosForm />} />

                  <Route path="/google-calendar/callback" element={<GoogleCalendarCallback />} />
                </Route>
              </Route>
            </Routes>
          </AppGate>
        </BrowserRouter>
      </NotificationProvider>
    </BackendStatusProvider>
  </StrictMode>,
);

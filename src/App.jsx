import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import GenerarSituacionPage from './pages/GenerarSituacionPage';
import SimulacionPage from './pages/SimulacionPage';
import HistorialPage from './pages/HistorialPage';
import BibliotecaPage from './pages/BibliotecaPage';
import LoginPage from './pages/LoginPage';

function PrivateRoute({ children }) {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  return isAuth ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  return isAuth ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/generar"
          element={
            <PrivateRoute>
              <GenerarSituacionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/simulacion/:id"
          element={
            <PrivateRoute>
              <SimulacionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <PrivateRoute>
              <HistorialPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/biblioteca"
          element={
            <PrivateRoute>
              <BibliotecaPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import GenerarSituacionPage from './pages/GenerarSituacionPage';
import SimulacionPage from './pages/SimulacionPage';
import HistorialPage from './pages/HistorialPage';
import BibliotecaPage from './pages/BibliotecaPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/generar" element={<MainLayout><GenerarSituacionPage /></MainLayout>} />
        <Route path="/simulacion/:id" element={<MainLayout><SimulacionPage /></MainLayout>} />
        <Route path="/historial" element={<MainLayout><HistorialPage /></MainLayout>} />
        <Route path="/biblioteca" element={<MainLayout><BibliotecaPage /></MainLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

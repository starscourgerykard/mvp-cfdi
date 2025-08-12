import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login_page';
import DashboardPage from './pages/dashboard_page';
import ResultsPage from './pages/results_page';
import './App.css';

/**
 * Componente principal de la aplicación
 * Maneja las rutas del MVP CFDI
 */
function App() {
  return (
    <Router>
      <div className="App">
        {/* Configuración de rutas principales */}
        <Routes>
          {/* Ruta raíz: Login */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Dashboard con las 3 acciones principales */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Página de resultados con parámetros */}
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
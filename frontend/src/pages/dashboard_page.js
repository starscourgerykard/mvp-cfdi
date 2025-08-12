import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de Dashboard principal
 * Pantalla 2: Muestra las 3 acciones principales del sistema CFDI
 */
function DashboardPage() {
  const navigate = useNavigate();

  /**
   * Maneja la navegación a la página de resultados
   * @param {string} action - Tipo de acción (download, validate, generate)
   */
  const handle_action = (action) => {
    navigate(`/results?action=${action}`);
  };

  /**
   * Maneja el cierre de sesión
   */
  const handle_logout = () => {
    navigate('/');
  };

  // Estilos para el contenedor principal
  const dashboard_container_style = {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px'
  };

  // Estilo para cada tarjeta de acción
  const action_card_style = {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  // Estilos para los botones de acción
  const button_download_style = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const button_validate_style = {
    ...button_download_style,
    backgroundColor: '#ffc107',
    color: 'black'
  };

  const button_generate_style = {
    ...button_download_style,
    backgroundColor: '#dc3545'
  };

  const logout_button_style = {
    marginTop: '30px',
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div style={dashboard_container_style}>
      <h1>Dashboard CFDI</h1>
      <p>Selecciona una acción para gestionar tus comprobantes fiscales:</p>
      
      {/* Grid de acciones principales */}
      <div style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
        
        {/* Acción 1: Descargar CFDIs */}
        <div style={action_card_style}>
          <h3>1. Descargar CFDIs</h3>
          <p>Descarga automática de todas las facturas emitidas o recibidas en un periodo específico</p>
          <button
            onClick={() => handle_action('download')}
            style={button_download_style}
          >
            Descargar CFDIs
          </button>
        </div>

        {/* Acción 2: Validar CFDIs */}
        <div style={action_card_style}>
          <h3>2. Validar CFDIs</h3>
          <p>Verifica que los CFDIs sean válidos y estén activos en la base de datos del SAT</p>
          <button
            onClick={() => handle_action('validate')}
            style={button_validate_style}
          >
            Validar CFDIs
          </button>
        </div>

        {/* Acción 3: Generar facturas */}
        <div style={action_card_style}>
          <h3>3. Generar Facturas</h3>
          <p>Crea nuevas facturas (CFDIs) para respaldar ventas y cumplir con obligaciones fiscales</p>
          <button
            onClick={() => handle_action('generate')}
            style={button_generate_style}
          >
            Generar Facturas
          </button>
        </div>
      </div>

      {/* Botón de logout */}
      <button onClick={handle_logout} style={logout_button_style}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default DashboardPage;
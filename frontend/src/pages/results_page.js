import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * Componente de página de resultados
 * Pantalla 3: Muestra los resultados de las acciones realizadas
 */
function ResultsPage() {
  // Estados para manejar carga y datos
  const [search_params] = useSearchParams();
  const [loading, set_loading] = useState(true);
  const [results, set_results] = useState([]);
  const navigate = useNavigate();
  
  // Obtener el tipo de acción desde la URL
  const action = search_params.get('action');

  /**
   * Efecto para simular carga de datos
   * En producción aquí iría la llamada real a la API
   */
  useEffect(() => {
    // Simular tiempo de procesamiento
    setTimeout(() => {
      set_results(get_mock_data(action));
      set_loading(false);
    }, 1500);
  }, [action]);

  /**
   * Genera datos de prueba según el tipo de acción
   * @param {string} action_type - Tipo de acción realizada
   * @returns {Array} Array de objetos con datos mock
   */
  const get_mock_data = (action_type) => {
    switch (action_type) {
      case 'download':
        return [
          { id: 'CFDI001', fecha: '2024-08-01', total: '$1,250.00', estado: 'Descargado' },
          { id: 'CFDI002', fecha: '2024-08-02', total: '$2,300.50', estado: 'Descargado' },
          { id: 'CFDI003', fecha: '2024-08-03', total: '$875.25', estado: 'Descargado' }
        ];
      case 'validate':
        return [
          { id: 'CFDI001', fecha: '2024-08-01', total: '$1,250.00', estado: 'Válido' },
          { id: 'CFDI002', fecha: '2024-08-02', total: '$2,300.50', estado: 'Válido' },
          { id: 'CFDI003', fecha: '2024-08-03', total: '$875.25', estado: 'Cancelado' }
        ];
      case 'generate':
        return [
          { id: 'CFDI004', fecha: '2024-08-09', total: '$1,500.00', estado: 'Generado' },
          { id: 'CFDI005', fecha: '2024-08-09', total: '$3,250.75', estado: 'Generado' }
        ];
      default:
        return [];
    }
  };

  /**
   * Obtiene el título de la página según la acción
   * @returns {string} Título correspondiente
   */
  const get_title = () => {
    switch (action) {
      case 'download': return 'CFDIs Descargados';
      case 'validate': return 'Validación de CFDIs';
      case 'generate': return 'Facturas Generadas';
      default: return 'Resultados';
    }
  };

  /**
   * Obtiene el mensaje de carga según la acción
   * @returns {string} Mensaje de proceso en curso
   */
  const get_loading_message = () => {
    switch (action) {
      case 'download': return 'Descargando CFDIs del SAT...';
      case 'validate': return 'Validando CFDIs contra el SAT...';
      case 'generate': return 'Generando nuevas facturas...';
      default: return 'Procesando...';
    }
  };

  // Estilos para los componentes
  const results_container_style = {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px'
  };

  const loading_container_style = {
    textAlign: 'center',
    marginTop: '100px'
  };

  const table_style = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const table_header_style = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left'
  };

  const table_cell_style = {
    border: '1px solid #ddd',
    padding: '12px'
  };

  const button_primary_style = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  const button_secondary_style = {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  // Pantalla de carga
  if (loading) {
    return (
      <div style={loading_container_style}>
        <h2>Procesando...</h2>
        <div style={{ fontSize: '18px', marginTop: '20px' }}>
          {get_loading_message()}
        </div>
      </div>
    );
  }

  return (
    <div style={results_container_style}>
      <h1>{get_title()}</h1>
      
      {/* Tabla de resultados */}
      <div style={{ marginTop: '30px' }}>
        <table style={table_style}>
          <thead>
            <tr>
              <th style={table_header_style}>ID CFDI</th>
              <th style={table_header_style}>Fecha</th>
              <th style={table_header_style}>Total</th>
              <th style={table_header_style}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index}>
                <td style={table_cell_style}>{item.id}</td>
                <td style={table_cell_style}>{item.fecha}</td>
                <td style={table_cell_style}>{item.total}</td>
                <td style={{ 
                  ...table_cell_style,
                  color: item.estado === 'Cancelado' ? 'red' : 'green',
                  fontWeight: 'bold'
                }}>
                  {item.estado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de navegación */}
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={button_primary_style}
        >
          Volver al Dashboard
        </button>
        
        <button
          onClick={() => navigate('/')}
          style={button_secondary_style}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;

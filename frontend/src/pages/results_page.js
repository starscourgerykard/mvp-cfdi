import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { get_action_data, format_table_data } from '../services/api_service';

/**
 * Componente de página de resultados actualizado
 * Pantalla 3: Muestra los resultados reales desde la API FastAPI
 */
function ResultsPage() {
  // Estados para manejar carga y datos
  const [search_params] = useSearchParams();
  const [loading, set_loading] = useState(true);
  const [results, set_results] = useState([]);
  const [error, set_error] = useState(null);
  const [api_response, set_api_response] = useState(null);
  const navigate = useNavigate();
  
  // Obtener el tipo de acción desde la URL
  const action = search_params.get('action');

  /**
   * Efecto para cargar datos reales desde la API
   */
  useEffect(() => {
    const load_data = async () => {
      set_loading(true);
      set_error(null);
      
      try {
        // Llamar a la API según la acción
        const response = await get_action_data(action);
        
        if (response.success) {
          // Formatear datos para la tabla
          const formatted_data = format_table_data(response.data, action);
          set_results(formatted_data);
          set_api_response(response);
        } else {
          set_error(response.message);
          set_results([]);
        }
      } catch (err) {
        set_error('Error de conexión con el servidor');
        set_results([]);
        console.error('Error cargando datos:', err);
      } finally {
        set_loading(false);
      }
    };

    if (action) {
      load_data();
    } else {
      set_error('Acción no especificada');
      set_loading(false);
    }
  }, [action]);

  /**
   * Obtiene el título según la acción
   */
  const get_action_title = () => {
    switch (action) {
      case 'download':
        return 'CFDIs Descargados';
      case 'validate':
        return 'CFDIs Validados';
      case 'generate':
        return 'Facturas Generadas';
      default:
        return 'Resultados';
    }
  };

  /**
   * Obtiene las columnas de la tabla según la acción
   */
  const get_table_columns = () => {
    const base_columns = ['ID', 'Fecha', 'Total', 'Estado'];
    
    switch (action) {
      case 'download':
        return [...base_columns, 'Emisor', 'Receptor', 'Serie-Folio'];
      case 'validate':
        return [...base_columns, 'Emisor', 'Estatus SAT', 'Sello Válido'];
      case 'generate':
        return [...base_columns, 'Receptor', 'UUID', 'Serie-Folio'];
      default:
        return base_columns;
    }
  };

  /**
   * Obtiene los valores de una fila según la acción
   */
  const get_row_values = (item) => {
    const base_values = [item.id, item.fecha, item.total, item.estado];
    
    switch (action) {
      case 'download':
        return [...base_values, item.emisor, item.receptor, item.serie_folio];
      case 'validate':
        return [...base_values, item.emisor, item.estatus_sat, item.sello_valido];
      case 'generate':
        return [...base_values, item.receptor, item.uuid, item.serie_folio];
      default:
        return base_values;
    }
  };

  /**
   * Maneja el regreso al dashboard
   */
  const handle_back_to_dashboard = () => {
    navigate('/dashboard');
  };

  /**
   * Recarga los datos
   */
  const handle_reload = async () => {
    set_loading(true);
    set_error(null);
    
    try {
      const response = await get_action_data(action);
      
      if (response.success) {
        const formatted_data = format_table_data(response.data, action);
        set_results(formatted_data);
        set_api_response(response);
      } else {
        set_error(response.message);
      }
    } catch (err) {
      set_error('Error de conexión con el servidor');
      console.error('Error recargando datos:', err);
    } finally {
      set_loading(false);
    }
  };

  // Estilos para los componentes
  const results_container_style = {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px'
  };

  const header_style = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const button_style = {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 5px'
  };

  const reload_button_style = {
    ...button_style,
    backgroundColor: '#28a745'
  };

  const loading_style = {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666'
  };

  const error_style = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '5px',
    border: '1px solid #f5c6cb',
    marginBottom: '20px'
  };

  const stats_style = {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '5px',
    border: '1px solid #c3e6cb',
    marginBottom: '20px'
  };

  const table_style = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const th_style = {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontWeight: 'bold'
  };

  const td_style = {
    padding: '10px',
    borderBottom: '1px solid #dee2e6'
  };

  const no_data_style = {
    textAlign: 'center',
    padding: '50px',
    color: '#666',
    fontStyle: 'italic'
  };

  return (
    <div style={results_container_style}>
      {/* Header con título y botones */}
      <div style={header_style}>
        <h1>{get_action_title()}</h1>
        <div>
          <button onClick={handle_reload} style={reload_button_style}>
            🔄 Recargar
          </button>
          <button onClick={handle_back_to_dashboard} style={button_style}>
            ← Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div style={error_style}>
          <strong>Error:</strong> {error}
          <br />
          <small>Verifica que el backend esté funcionando en http://localhost:8000</small>
        </div>
      )}

      {/* Mostrar estadísticas si están disponibles */}
      {api_response && api_response.success && (
        <div style={stats_style}>
          <strong>✅ {api_response.message}</strong>
          <br />
          Total de registros: {api_response.total || results.length}
          {api_response.total_amount && (
            <>
              <br />
              Monto total: {api_response.total_amount}
            </>
          )}
          {api_response.stats && (
            <>
              <br />
              Estadísticas: {JSON.stringify(api_response.stats)}
            </>
          )}
        </div>
      )}

      {/* Contenido principal */}
      {loading ? (
        <div style={loading_style}>
          <div>⏳ Cargando datos desde la API...</div>
          <small>Conectando con http://localhost:8000</small>
        </div>
      ) : results.length > 0 ? (
        <div>
          {/* Tabla de resultados */}
          <table style={table_style}>
            <thead>
              <tr>
                {get_table_columns().map((column, index) => (
                  <th key={index} style={th_style}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={item.id || index}>
                  {get_row_values(item).map((value, col_index) => (
                    <td key={col_index} style={td_style}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Información adicional */}
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p>📊 Mostrando {results.length} registros</p>
            <p>🔄 Datos actualizados desde la API FastAPI</p>
            <p>⏰ Última actualización: {new Date().toLocaleString('es-MX')}</p>
          </div>
        </div>
      ) : (
        <div style={no_data_style}>
          {error ? (
            <div>
              <h3>❌ No se pudieron cargar los datos</h3>
              <p>Verifica que el backend esté funcionando correctamente</p>
              <button onClick={handle_reload} style={reload_button_style}>
                Intentar de nuevo
              </button>
            </div>
          ) : (
            <div>
              <h3>📄 No hay datos disponibles</h3>
              <p>No se encontraron {get_action_title().toLowerCase()} en el sistema</p>
            </div>
          )}
        </div>
      )}

      {/* Footer con información de debug */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666'
      }}>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            🔧 Información de Debug
          </summary>
          <pre style={{ marginTop: '10px', overflow: 'auto' }}>
            {JSON.stringify({
              action,
              loading,
              error,
              results_count: results.length,
              api_response: api_response ? {
                success: api_response.success,
                message: api_response.message,
                total: api_response.total
              } : null
            }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

export default ResultsPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login_user, check_session, check_api_health } from '../services/api_service';

/**
 * Componente de login actualizado
 * Pantalla 1: Login con autenticación real via API FastAPI
 */
function LoginPage() {
  const [username, set_username] = useState('');
  const [password, set_password] = useState('');
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState('');
  const [api_status, set_api_status] = useState('checking');
  const navigate = useNavigate();

  /**
   * Verifica el estado de la API al cargar la página
   */
  useEffect(() => {
    const check_api_and_session = async () => {
      // Verificar si ya hay una sesión activa
      const session = check_session();
      if (session.is_logged_in) {
        navigate('/dashboard');
        return;
      }

      // Verificar estado de la API
      try {
        const health = await check_api_health();
        set_api_status(health.success ? 'online' : 'offline');
      } catch (err) {
        set_api_status('offline');
      }
    };

    check_api_and_session();
  }, [navigate]);

  /**
   * Maneja el envío del formulario de login
   */
  const handle_submit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      set_error('Por favor ingresa usuario y contraseña');
      return;
    }

    set_loading(true);
    set_error('');

    try {
      const response = await login_user(username.trim(), password.trim());
      
      if (response.success) {
        // Login exitoso - navegar al dashboard
        navigate('/dashboard');
      } else {
        set_error(response.message || 'Error al hacer login');
      }
    } catch (err) {
      set_error('Error de conexión con el servidor');
      console.error('Error en login:', err);
    } finally {
      set_loading(false);
    }
  };

  /**
   * Completa el formulario con un usuario demo
   */
  const fill_demo_user = (user_type) => {
    switch (user_type) {
      case 'admin':
        set_username('admin');
        set_password('admin123');
        break;
      case 'user':
        set_username('usuario');
        set_password('user123');
        break;
      case 'demo':
        set_username('demo');
        set_password('demo');
        break;
      default:
        break;
    }
    set_error('');
  };

  // Estilos para los componentes
  const login_container_style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  };

  const login_form_style = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  };

  const form_group_style = {
    marginBottom: '20px'
  };

  const label_style = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  };

  const input_style = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  const button_style = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1
  };

  const error_style = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
    marginBottom: '15px',
    fontSize: '14px'
  };

  const api_status_style = {
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const get_api_status_style = () => ({
    ...api_status_style,
    backgroundColor: api_status === 'online' ? '#d4edda' : api_status === 'offline' ? '#f8d7da' : '#fff3cd',
    color: api_status === 'online' ? '#155724' : api_status === 'offline' ? '#721c24' : '#856404',
    border: `1px solid ${api_status === 'online' ? '#c3e6cb' : api_status === 'offline' ? '#f5c6cb' : '#ffeaa7'}`
  });

  const demo_buttons_style = {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6'
  };

  const demo_button_style = {
    padding: '5px 10px',
    margin: '2px',
    fontSize: '12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  };

  return (
    <div style={login_container_style}>
      <div style={login_form_style}>
        {/* Título */}
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          💼 MVP CFDI
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Sistema de Gestión Fiscal
        </p>

        {/* Estado de la API */}
        <div style={get_api_status_style()}>
          <span>
            {api_status === 'online' && '🟢 API Conectada'}
            {api_status === 'offline' && '🔴 API Desconectada'}
            {api_status === 'checking' && '🟡 Verificando API...'}
          </span>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div style={error_style}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Formulario de login */}
        <form onSubmit={handle_submit}>
          <div style={form_group_style}>
            <label style={label_style}>Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => set_username(e.target.value)}
              style={input_style}
              placeholder="Ingresa tu usuario"
              disabled={loading}
            />
          </div>

          <div style={form_group_style}>
            <label style={label_style}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => set_password(e.target.value)}
              style={input_style}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={button_style}
            disabled={loading || api_status === 'offline'}
          >
            {loading ? '⏳ Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>
        </form>

        {/* Botones de usuario demo */}
        <div style={demo_buttons_style}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
            👤 Usuarios de Demostración:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            <button
              onClick={() => fill_demo_user('admin')}
              style={demo_button_style}
              disabled={loading}
            >
              Admin
            </button>
            <button
              onClick={() => fill_demo_user('user')}
              style={demo_button_style}
              disabled={loading}
            >
              Usuario
            </button>
            <button
              onClick={() => fill_demo_user('demo')}
              style={demo_button_style}
              disabled={loading}
            >
              Demo
            </button>
          </div>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
            💡 También puedes usar cualquier usuario/contraseña para el MVP
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;